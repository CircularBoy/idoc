"use strict";

// document.querySelector('.hero').classList.add('hero--load');

//
//cookies
//

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}
//get
function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

//
// timer
//

var timer = document.querySelector('.timer');

function getTime(seconds) {
  var date = new Date(null);
  date.setSeconds(seconds); // specify value for SECONDS here
  var result = date.toISOString().substr(11, 8);
  return result;
}

function writeTime(date) {
  timer.innerHTML = date;
}
function writeCookie(seconds) {
  setCookie('timer', seconds, {
    expires: 2629743
  });
}

if (timer) {
  if (getCookie('timer') !== undefined) {
    var time = getTime(getCookie('timer'));
    writeTime(time);
  }
  var timerInput = document.querySelector('.action-input');
  var setTimer = setInterval(function () {
    if (getCookie('timer') === undefined) {
      writeCookie(30 * 60);
    }
    var seconds = getCookie('timer');
    if (seconds < 0 || getCookie('timer') < 0) {
      clearInterval(setTimer);
      writeTime('время истекло');
      console.log(seconds);
      timer.classList.add('action__timer--expired');
      timerInput.value = 'Скидка недействительна';
    } else {
      var time = getTime(seconds);
      writeTime(time);
      var newSeconds = seconds - 1;
      writeCookie(newSeconds);
    }
  }, 1000);
}

//
//jquery parents() pure js
//
(function () {
  if (typeof NodeList.prototype.forEach === "function") return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();
Element.prototype.parents = function (selector) {
  var elements = [];
  var elem = this;
  var ishaveselector = selector !== undefined;

  while ((elem = elem.parentElement) !== null) {
    if (elem.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    if (!ishaveselector || elem.matches(selector)) {
      elements.push(elem);
    }
  }

  return elements;
};
//
// forms
//

// validate
function validate(form) {
  var inputs = form.querySelectorAll('input[type=text]');
  var valid = 1;
  inputs.forEach(function (elem) {
    var val = elem.value;
    var field = elem.parentNode;
    if (val !== undefined && val !== ' ' && val.length > 3 && val.length < 50) {
      field.classList.remove('input-field--error');
    } else {
      field.classList.add('input-field--error');
      valid = 0;
    }
  });

  return valid;
}
//handler
function formHadle(form, phpHandler, modal) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = validate(this);
    if (valid) {
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        console.log(request.readyState);

        if (request.readyState === 4 && request.status === 200) {
          console.log('text ' + request.responseText);
          if (modal) {
            modal.close();
          }
          window.location.href = "https://idocservice.com.ua/thank/#action";
          // successModal.show();
        }
      };
      request.open('POST', phpHandler, true);
      var data = Array.from(new FormData(this), function (e) {
        return e.map(encodeURIComponent).join('=');
      }).join('&');
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      request.send(data);
    }
  });
}

//
// Dots generate for sliders
//

var sliderDotBlocks = document.querySelectorAll('[data-glide-el="controls[nav]"]:not([data-glide-generate-false])');

if (sliderDotBlocks) {
  sliderDotBlocks.forEach(function (dotBlock) {
    var prentNode = dotBlock.parents('.glide')[0];
    var sliderSlides = prentNode.querySelector('.glide__slides');

    for (var i = 0; i < sliderSlides.children.length; i++) {
      var sliderDot = document.createElement('div');
      sliderDot.classList.add('glide__bullet');
      sliderDot.setAttribute('data-glide-dir', '=' + i);

      dotBlock.appendChild(sliderDot);
    }
  });
}

//
// Open/close mobile menu
//

var toggleMobileMenu = function toggleMobileMenu() {
  document.querySelector('.menu-top').classList.toggle('menu-top-click');
  document.querySelector('.menu-middle').classList.toggle('menu-middle-click');
  document.querySelector('.menu-bottom').classList.toggle('menu-bottom-click');
};

var closeMobileMenu = function closeMobileMenu() {
  document.querySelector('.menu-top').classList.remove('menu-top-click');
  document.querySelector('.menu-middle').classList.remove('menu-middle-click');
  document.querySelector('.menu-bottom').classList.remove('menu-bottom-click');
};

var headerMenu = document.querySelector('.header__mobile-menu');

if (headerMenu) {
  headerMenu.addEventListener('click', function () {
    document.querySelector('.header__nav').classList.toggle('header__nav--open');
    document.querySelector('.header').classList.toggle('header--menu-open');
    document.querySelector('html').classList.toggle('hide-scroll');
    toggleMobileMenu();
  });
}

if (window.innerWidth < 992) {

  var menuItems = document.querySelectorAll('.header__nav a');

  menuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      document.querySelector('.header__nav').classList.toggle('header__nav--open');
      document.querySelector('.header').classList.toggle('header--menu-open');
      toggleMobileMenu();
    });
  });
}

window.addEventListener('resize', function () {
  if (window.innerWidth > 992) {
    document.querySelector('.header__nav').classList.remove('header__nav--open');
    document.querySelector('.header').classList.remove('header--menu-open');
    closeMobileMenu();
  }
});

//
// services slider
//

var servicesSlider = document.querySelector('.services__slider .glide');

if (servicesSlider) {

  var servicesSliderPrev = document.querySelector('.services__slider-prev');
  var servicesSliderNext = document.querySelector('.services__slider-next');

  servicesSliderPrev.addEventListener('click', function () {
    servicesSliderInit.go('<');
  });

  servicesSliderNext.addEventListener('click', function () {
    servicesSliderInit.go('>');
  });

  var servicesSliderInit = false;

  var servicesSliderFn = function servicesSliderFn() {
    // if (window.innerWidth < 768) {
    if (!servicesSliderInit) {
      servicesSliderInit = new Glide(servicesSlider, {
        type: 'carousel',
        perView: 4,
        breakpoints: {
          992: {
            perView: 3
          },
          766: {
            perView: 2
          },
          500: {
            perView: 1
          }
        }
      });

      servicesSliderInit.mount();
    } else {}
    // // destroy slider if init
    // if (typeof servicesSliderInit === 'object') {
    //   servicesSliderInit.destroy();
    //   servicesSliderInit = false;
    // }

    // }
  };

  servicesSliderFn();
  window.addEventListener('resize', servicesSliderFn);
}

//
// manufac slider
//

var manufacSlider = document.querySelector('.manufac__slider .glide');
if (manufacSlider) {

  var manufacSliderPrev = document.querySelector('.manufac__slider-prev');
  var manufacSliderNext = document.querySelector('.manufac__slider-next');

  manufacSliderPrev.addEventListener('click', function () {
    manufacSliderInit.go('<');
  });

  manufacSliderNext.addEventListener('click', function () {
    manufacSliderInit.go('>');
  });

  var manufacSliderInit = false;

  var manufacSliderFn = function manufacSliderFn() {
    // if (window.innerWidth < 768) {
    if (!manufacSliderInit) {
      manufacSliderInit = new Glide(manufacSlider, {
        type: 'carousel',
        perView: 5,
        breakpoints: {
          992: {
            perView: 3
          },
          766: {
            perView: 2
          },
          500: {
            perView: 1
          }
        }
      });

      manufacSliderInit.mount();
    } else {}
    // // destroy slider if init
    // if (typeof manufacSliderInit === 'object') {
    //   manufacSliderInit.destroy();
    //   manufacSliderInit = false;
    // }

    // }
  };

  manufacSliderFn();
  window.addEventListener('resize', manufacSliderFn);
}

// Init gumshoe

gumshoe.init({
  activeClass: 'header__nav-link--active',
  offset: 95,
  selector: '[data-gumshoe]',
  callback: function callback(nav) {
    if (nav === undefined) {
      document.querySelector('.header__nav-link:first-child').classList.add('header__nav-link--active');
    }
  }
});

// Init smoth scroll

var offset = function () {
  if (window.innerWidth > '1199') {
    return '0';
  } else if (window.innerWidth > '992') {
    return '0';
  } else {
    return '150';
  }
}();

var scroll = new SmoothScroll('.scroll-to[href*="#"]', {
  header: '[data-scroll-header]',
  offset: offset
});

//
// Modals
//

function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function closeModal() {
  eventFire(document.querySelector('.basicLightbox '), 'click');
}

var getTargetHTML = function getTargetHTML(elem) {
  var id = elem.getAttribute('data-show-id');
  var target = document.querySelector("[data-id=\"" + id + "\"]");
  return target.outerHTML;
};

//for all modal
document.querySelectorAll('[data-show-id]:not([data-success])').forEach(function (elem) {
  var html = getTargetHTML(elem);
  var simpleModal = basicLightbox.create(html, {
    afterShow: function afterShow(simpleModal) {
      var modal = simpleModal.element();
      var form = modal.querySelector('form');
      if (form) {
        formHadle(form, '../../../../../googleapi/success.php', simpleModal);
      }
    }
  });

  elem.addEventListener('click', function () {
    simpleModal.show();
  });
});

//for success

var html = document.querySelector('[data-success]').outerHTML;
var successModal = basicLightbox.create(html, {
  onShow: function onShow(instance) {
    console.log(123);
  },
  closable: true
});

//
// Animate
//

// AOS.init({
//   once: true,
//   disable: window.innerWidth < 1024
// });

//
// animate counter
//

var options = {
  useEasing: true,
  useGrouping: true,
  separator: '',
  decimal: '.'
};

var itemCounter1 = document.querySelector('.stat__item:nth-child(1) .stat__number');
var itemCounter2 = document.querySelector('.stat__item:nth-child(2) .stat__number');
var itemCounter3 = document.querySelector('.stat__item:nth-child(3) .stat__number');
var itemCounter4 = document.querySelector('.stat__item:nth-child(4) .stat__number');

var counter1 = new CountUp(itemCounter1, 0, 9000, 0, 2.5, options);
var counter2 = new CountUp(itemCounter2, 0, 5, 0, 3, options);
var counter3 = new CountUp(itemCounter3, 0, 94, 0, 3.7, options);
var counter4 = new CountUp(itemCounter4, 0, 97, 0, 3.7, options);

var itemOffset1 = itemCounter1.getBoundingClientRect().top - window.innerHeight;
var itemOffset2 = itemCounter2.getBoundingClientRect().top - window.innerHeight;
var itemOffset3 = itemCounter3.getBoundingClientRect().top - window.innerHeight;
var itemOffset4 = itemCounter4.getBoundingClientRect().top - window.innerHeight;

function counter() {
  var distance = window.pageYOffset || document.documentElement.scrollTop;
  if (distance > itemOffset1) {
    counter1.start();
  }
  if (distance > itemOffset2) {
    counter2.start();
  }
  if (distance > itemOffset3) {
    counter3.start();
  }
  if (distance > itemOffset4) {
    counter4.start();
  }
}

counter();

window.onscroll = function () {
  counter();
};

// some forms handler
var simpleForms = document.querySelectorAll('.formSimple');

if (simpleForms.length > 0) {
  simpleForms.forEach(function (item) {
    formHadle(item, '../../../../googleapi/success.php', false);
  });
}