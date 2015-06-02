'use strict';

function getSlidesFromDom() {

  function parseSection(element) {
    var yaw = parseFloat(element.getAttribute('data-yaw'));
    var pitch = parseFloat(element.getAttribute('data-pitch'));
    var perspectiveRadius = parseFloat(element.getAttribute('data-perspective-radius'));

    if(isNaN(yaw)) {
      throw new Error("Section is missing data-yaw attribute");
    }
    if(isNaN(pitch)) {
      throw new Error("Section is missing data-pitch attribute");
    }
    if(isNaN(perspectiveRadius)) {
      throw new Error("Section is missing data-perspective-radius attribute");
    }

    var section = {
      element: element,
      yaw: yaw,
      pitch: pitch,
      perspectiveRadius: perspectiveRadius      
    };

    var domSlides = element.querySelectorAll('[data-slide]');
    section.slides = nodeListToArray(domSlides);
    section.length = section.slides.length;

    return section;
  }

  var domSections = document.querySelectorAll("[data-section]");
  return nodeListToArray(domSections).map(parseSection);
}

function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

window.getSlidesFromDom = getSlidesFromDom;