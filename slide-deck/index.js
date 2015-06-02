'use strict';

var slideWidth = 800;
var slideHeight = 600;

var SlideDeck = window.SlideDeck;
var getSlidesFromDom = window.getSlidesFromDom;

var sections = getSlidesFromDom();
var deck = new SlideDeck(sections);

/* Bind hash to current slide */
updateHashWithDeck(deck);

/* Change slides with keys */
/* TODO: add swipe change slide */
document.addEventListener('keydown', function(e) {
  var k = e.keyCode;
  if (k === 37 || k === 38 || k === 33) // left arrow, up arrow, page up
    deck.prevSlide();
  else if (k === 39 || k === 40 || k === 13 || k === 34) // right arrow, down arrow, enter, page down
    deck.nextSlide();
});


/* Setup Marzipano */

var viewer = new Marzipano.Viewer(document.getElementById('viewer'));
viewer.controls().disable();

var source = Marzipano.ImageUrlSource.fromString(
  "../common-media/museu_da_electricidade/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: "../common-media/museu_da_electricidade/preview.jpg" });

var geometry = new Marzipano.CubeGeometry([
    { "tileSize": 256, "size": 256, "fallbackOnly": true },
    { "size": 512, "tileSize": 512 },
    { "size": 1024, "tileSize": 512 },
    { "size": 2048, "tileSize": 512 }
]);

var view = new Marzipano.RectilinearView();
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

/* Position the section elements */
viewer.renderLoop().addEventListener('afterRender', updateSectionPositions);

/* Look to each section on slide changes */
deck.addEventListener('slideChanged', lookToCurrentSectionWithAnimation);

/* If the size changes the fov must change to fit the current section  */
view.addEventListener('resize', updateSectionPositionsAndView);
viewer.stage().addEventListener('resize', updateSectionPositionsAndView);

/* Display the initial scene and look to the initial section */
scene.switchTo({ transitionDuration: 0 });
updateSectionPositionsAndView();


/* Change the visible slide */
deck.addEventListener('slideChanged', updateSlide);
updateSlide();

function updateSlide() {
  var currentSectionIndex = deck.currentSection;
  var currentSlideIndex = deck.currentSlide;

  sections.forEach(function(section, sectionIndex) {
    section.slides.forEach(function(element, slideIndex) {
      element.classList.remove('before');
      element.classList.remove('current');
      element.classList.remove('after');

      if(sectionIndex < currentSectionIndex) {
        if(slideIndex < section.slides.length - 1) {
          element.classList.add('before');
        }
        else {
          element.classList.add('current');
        }
      }

      else if(sectionIndex > currentSectionIndex) {
        if(slideIndex > 0) {
          element.classList.add('after');
        }
        else {
          element.classList.add('current');
        }
      }

      else if(sectionIndex === currentSectionIndex) {
        if(slideIndex < currentSlideIndex) {
          element.classList.add('before');
        }
        else if(slideIndex === currentSlideIndex) {
          element.classList.add('current');
        }
        else if(slideIndex > currentSlideIndex) {
          element.classList.add('after');
        }
      }
    });
  });
}


/* Code to update the section positions */

/* When looking directly at a slide it should not have any transformation,
   since the browser may not render it sharply. Therefore we do not use
   scene.createHotspot() but position slides with css instead. */
function updateSectionPositions() {
  sections.forEach(function(section, sectionIndex) {

    var el = section.element;

    /* If we are in this section and there is no movement center the slide
       on the screen without using transforms */
    if(deck.currentSection === sectionIndex && !scene.movement()) {
      el.style['position'] = 'absolute';
      el.style['top'] = '50%';
      el.style['left'] = '50%';
      el.style['margin-top'] = -slideHeight/2 + 'px';
      el.style['margin-left'] = -slideWidth/2 + 'px';
      setWithVendorPrefix(el, 'transform', null);
    }
    /* Otherwise, transform it as usual */
    else {
      /* We can pass `section` directly as the first argument, as it has `yaw`
         and `pitch properties */
      var transform = view.coordinatesToPerspectiveTransform(section, section.perspectiveRadius);

      el.style['position'] = 'absolute';
      el.style['top'] = '0';
      el.style['left'] = '0';
      el.style['margin-top'] = '0';
      el.style['margin-left'] = '0';
      setWithVendorPrefix(el, 'transform', transform);
    }
  });
}

/* Code to look to the current section */
var lookingTo = null;

function lookToCurrentSectionWithAnimation() {
  var sectionIndex = deck.getSlide()[0];
  if(lookingTo !== sectionIndex) {
    lookingTo = sectionIndex;
    var section = sections[sectionIndex];

    /* This fov is the one with which the section element is displayed with
       its original size */
    var fov = 2 * Math.atan(view.size().height/section.perspectiveRadius);

    scene.lookTo({ yaw: section.yaw, pitch: section.pitch, fov: fov });
  }
}

function updateView() {
  var sectionIndex = deck.getSlide()[0];
  var section = sections[sectionIndex];
  var fov = 2 * Math.atan(view.size().height/section.perspectiveRadius);
  view.setParameters({ yaw: section.yaw, pitch: section.pitch, fov: fov });
}

function updateSectionPositionsAndView() {
  updateSectionPositions();
  updateView();
}

/* Helper to set properties with a vendor prefix */
function setWithVendorPrefix(element, property, value) {
  element.style['-ms-' + property] = value;
  element.style['-webkit-' + property] = value;
  element.style[property] = value;
}

