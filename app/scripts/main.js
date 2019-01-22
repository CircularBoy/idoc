// document.querySelector('.hero').classList.add('hero--load');
new Vue({
  el: '#app',
  data: {
    activeModal: null,
    currentExpert: null
  }
});
//
//jquery parents() pure js
//
(function () {
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();
Element.prototype.parents = function(selector) {
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
  const inputs = form.querySelectorAll('input[type=text]');
  let valid = 1;
  inputs.forEach(elem => {
    let val = elem.value;
    let field = elem.parentNode;
    if(val !== undefined && val !== ' ' && val.length > 3 && val.length < 50) {
      field.classList.remove('input-field--error');
    } else {
      field.classList.add('input-field--error');
      valid = 0;
    }  
  });   

  return valid;
}
//handler
function formHadle(form, redirectLink, phpHandler) {
  form.addEventListener('submit', function(e){
    e.preventDefault();

    const valid = validate(this);
    if(valid) {
      this.classList.add('form__form--load');
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if(request.readyState === 4) {
          if(request.status === 200) { 
            console.log('text ' + request.responseText);
            window.location.href = redirectLink;
          } else {
            console.log('Упс, что-то пошло не так. Попробуйте, пожалуйста, еще раз');
          } 
        }
      };
      const data = Array.from(new FormData(this), e => e.map(encodeURIComponent).join('=')).join('&');
      request.open('POST', phpHandler, true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      request.send(data);
    }
      
  });
}

// hide icons func 
function hideIcons (inputs) {
  if(inputs && window.innerWidth < 576) {
    inputs.forEach(function(item) {
      item.addEventListener('input', function() {
        let inputVal = item.value;
        let inputParent = this.parentNode;
        inputVal.length > 0 ? inputParent.classList.add('input-field--focus') : inputParent.classList.remove('input-field--focus');
      });
    });
  }
}

//
// Dots generate for sliders
//

const sliderDotBlocks = document.querySelectorAll(
  '[data-glide-el="controls[nav]"]:not([data-glide-generate-false])'
);

if (sliderDotBlocks) {
  sliderDotBlocks.forEach(function(dotBlock) {
    let prentNode = dotBlock.parents('.glide')[0];
    let sliderSlides = prentNode.querySelector('.glide__slides');

    for (let i = 0; i < sliderSlides.children.length; i++) {
      let sliderDot = document.createElement('div');
      sliderDot.classList.add('glide__bullet');
      sliderDot.setAttribute('data-glide-dir', '=' + i);

      dotBlock.appendChild(sliderDot);
    }
  });
}

//
// Open/close mobile menu
//

const toggleMobileMenu = function() {
  document.querySelector('.menu-top').classList.toggle('menu-top-click');
  document.querySelector('.menu-middle').classList.toggle('menu-middle-click');
  document.querySelector('.menu-bottom').classList.toggle('menu-bottom-click');
};

const closeMobileMenu = function() {
  document.querySelector('.menu-top').classList.remove('menu-top-click');
  document.querySelector('.menu-middle').classList.remove('menu-middle-click');
  document.querySelector('.menu-bottom').classList.remove('menu-bottom-click');
};

const headerMenu = document.querySelector('.header__mobile-menu');

if (headerMenu) {
  headerMenu.addEventListener('click', function() {
    document.querySelector('.header__nav').classList.toggle('header__nav--open');
    document.querySelector('.header').classList.toggle('header--menu-open');
    document.querySelector('html').classList.toggle('hide-scroll');
    toggleMobileMenu();
  });
}

if (window.innerWidth < 768) {

  const menuItems = document.querySelectorAll('.header__nav a');

  menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
      document.querySelector('.header__nav').classList.toggle('header__nav--open');
      document.querySelector('.header').classList.toggle('header--menu-open');
      toggleMobileMenu();
    });
  });
}

//
// header on scroll active
//

const header = document.querySelector('.header');
if(header) {
  window.addEventListener('scroll', function() {
    const distanceTop = window.pageYOffset || document.documentElement.scrollTop;
    distanceTop > 0 ? header.classList.add('header--scroll') : header.classList.remove('header--scroll');
  });
}


//
// fix menu on scroll
//

const headerMenuMobile = document.querySelector('.header__nav--open');

if(headerMenuMobile) {
  headerMenuMobile.onscroll = function() {
    return false;
  };
}
//
// aboutUs slider
//

const aboutUsSlider = document.querySelector('.about-us__slider .glide');

if (aboutUsSlider) {

  const aboutUsSliderPrev = document.querySelector('.about-us__slider-prev');
  const aboutUsSliderNext = document.querySelector('.about-us__slider-next');

  aboutUsSliderPrev.addEventListener('click', function() {
    aboutUsSliderInit.go('<');
  });

  aboutUsSliderNext.addEventListener('click', function() {
    aboutUsSliderInit.go('>');
  });

  var aboutUsSliderInit = false;

  const aboutUsSliderFn = function() {
    if (window.innerWidth < 768) {
      if (!aboutUsSliderInit) {
        aboutUsSliderInit = new Glide(aboutUsSlider, {
          type: 'carousel',
          mode: 'vertical',
          perView: 1
        });

        aboutUsSliderInit.mount();
      } else {
        // destroy slider if init
        if (typeof aboutSliderInit === 'object') {
          aboutSliderInit.destroy();
          aboutSliderInit = false;
        }
      }
    }
  };

  aboutUsSliderFn();
  window.addEventListener('resize', aboutUsSliderFn);
}

//
// about slider
//

const aboutSlider = document.querySelector('.about__slider .glide');
if (aboutSlider) {

  const aboutSliderPrev = document.querySelector('.about__slider-prev');
  const aboutSliderNext = document.querySelector('.about__slider-next');

  aboutSliderPrev.addEventListener('click', function() {
    aboutSliderInit.go('<');
  });

  aboutSliderNext.addEventListener('click', function() {
    aboutSliderInit.go('>');
  });

  var aboutSliderInit = false;

  const aboutSliderFn = function() {
    if (window.innerWidth < 992) {
      if (!aboutSliderInit) {
        aboutSliderInit = new Glide(aboutSlider, {
          type: 'carousel',
          perView: 1,
          bound: true,
          gap: 30,
          peek: { before: 140, after: 180 },
          breakpoints: {
            767: {
              perView: 1,
              peek: { before: 10, after: 10 },
              gap: 50
            }
          }
        });

        aboutSliderInit.mount();
      }
    } else {
      // destroy slider if init
      if (typeof aboutSliderInit === 'object') {
        aboutSliderInit.destroy();
        aboutSliderInit = false;
      }
    }
  };

  aboutSliderFn();
  window.addEventListener('resize', aboutSliderFn);
}

// Init gumshoe

gumshoe.init({
  activeClass: 'header__nav-link--active',
  offset: 95,
  selector: '[data-gumshoe]',
  callback: function(nav) {
    if (nav === undefined) {
      document
        .querySelector('.header__nav-link:first-child')
        .classList.add('header__nav-link--active');
    }
  }
});


// Init smoth scroll

const offset = function() {
  if(window.innerWidth > '1199') {
    return '95';
  } else if (window.innerWidth > '719') {
    return '95';
  } else {
    return '72';
  }
}();

var scroll = new SmoothScroll('.scroll-to[href*="#"]', {
  header: '[data-scroll-header]',
  offset: offset
});




//
//  custom scroll bar
//

const customScrollTablet = document.querySelector('[data-custom-scroll-tablet]');

if(customScrollTablet) {
  const scrollBar = new SimpleBar(customScrollTablet, { 
    autoHide: false 
  });

  //hide icon scroll
  const scrollIcon = document.querySelector('#scroll-icon');

  scrollBar.getScrollElement().addEventListener('scroll', function() {
    scrollIcon.classList.add('about-us__icon-scroll--hide');
  });
}
//
// simple scroll
//

// const customScroll = document.querySelectorAll('[data-custom-scroll')

// if(customScroll.length > 0) {
//   customScroll.forEach(el => new SimpleBar());
// }

//
// therapy dropdown
//

const dropdown = document.querySelectorAll('[data-dropdown]');

if (dropdown) {
  dropdown.forEach(function(elem) {
    elem.addEventListener('click', function() {
      dropdown.forEach(function(itemInner) {
        // itemInner.classList.remove('therapy__item--active')
      });
      const click = elem.getAttribute('data-click');
      if (click)
        elem.classList.toggle('therapy__item--hide');
      
      elem.setAttribute('data-click', 'true');
    });
      
  });
}

//
// experts more
//

const expertBtn = document.querySelector('[data-all-experts]');

if(expertBtn) {
  expertBtn.addEventListener('click' , function() {
    const expertItemWrap = expertBtn.parents('.experts__items')[0];
    const expertItems = expertItemWrap.querySelectorAll('.experts__item:not(.experts__item--active)');
    
    expertItems.forEach(function(item) {
      item.classList.add('experts__item--active');
    });
  });
}

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

const getTargetHTML = function(elem) {
  let id = elem.getAttribute('data-show-id');
  const target = document.querySelector(`[data-id="${id}"]`);
  return target.outerHTML;
};

//for all modal
document.querySelectorAll('[data-show-id]:not([data-exp-id])').forEach(function(elem) {
  const html = getTargetHTML(elem);
  const instance = basicLightbox.create(html, {
    afterShow: (instance) => {
      let modal = instance.element();
      const id = elem.getAttribute('data-exp-id');
      const inputHide = modal.querySelector('[data-input-id]');
      if(inputHide) {
        inputHide.value = id;
      }

      const form = modal.querySelector('form');
      if(form) {
        formHadle(form, 'success.html', 'rest.php');
        
        const formInputs = form.querySelectorAll('.input');
        hideIcons(formInputs);
      }

      
      
    },
  });

  elem.addEventListener('click', function() {
    instance.show();
  });

});

//for modal expert
document.querySelectorAll('[data-show-id][data-exp-id]').forEach(function(elem) {
  const html = getTargetHTML(elem);
  const instance = basicLightbox.create(html, {
    afterShow: (instance) => {
      let modal = instance.element();
      const id = elem.getAttribute('data-exp-id');
      const inputHide = modal.querySelector('[data-input-id]');
      inputHide.value = id;

      const form = modal.querySelector('form');

      formHadle(form, 'success.html', 'rest.php');

      const formInputs = form.querySelectorAll('.input');
      
      hideIcons(formInputs);
    },
  });

  elem.addEventListener('click', function() {
    instance.show();
  });

});

//
// Animate
//

AOS.init({
  once: true,
  disable: window.innerWidth < 1024
});

//
// animate counter
//

var options = {
  useEasing: true,
  useGrouping: true, 
  separator: '', 
  decimal: '.', 
};

const itemCounter1 = document.querySelector('.statistic__item:nth-child(1) .statistic__count');
const itemCounter2 = document.querySelector('.statistic__item:nth-child(2) .statistic__count');
const itemCounter3 = document.querySelector('.statistic__item:nth-child(3) .statistic__count');

const counter1 = new CountUp(itemCounter1, 0, 48, 0, 2.5, options);
const counter2 = new CountUp(itemCounter2, 0, 650, 0, 3, options);
const counter3 = new CountUp(itemCounter3, 0, 27600, 0, 3.7, options);

const itemOffset1 = itemCounter1.getBoundingClientRect().top - window.innerHeight;
const itemOffset2 = itemCounter2.getBoundingClientRect().top - window.innerHeight;
const itemOffset3 = itemCounter3.getBoundingClientRect().top - window.innerHeight;

function counter () {
  const distance = window.pageYOffset || document.documentElement.scrollTop;
  if(distance > itemOffset1) {
    counter1.start();
  }
  if(distance > itemOffset2) {
    counter2.start();
  }
  if(distance > itemOffset3) {
    counter3.start();
  } 
}

counter();

window.onscroll = function() {
  counter();
};

// some forms handler
const freeForm1 = document.querySelector('.js-free1-form');
if (freeForm1) {
  formHadle(freeForm1, 'success.html', 'rest.php');
}
const freeForm2 = document.querySelector('.js-free2-form');
if (freeForm2) {
  formHadle(freeForm2, 'success.html', 'rest.php');
}
const bonusForm = document.querySelector('.js-bonus-form');

if (bonusForm) {
  formHadle(bonusForm, 'download.html', 'rest-book.php');
}

//inputs form keydown hide icons

const formInputs = document.querySelectorAll('.input');

hideIcons(formInputs);

//
//ref system
//
// function getRef(search) {
//   var id = search.substring(1);

//   history.pushState({
//     id: id
//   }, 'Home | Ref', 'http://localhost:3000');
//   console.log(id);
// }

// if(window.location.search) {
//   getRef(window.location.search);
// }