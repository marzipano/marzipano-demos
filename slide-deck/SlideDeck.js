'use strict';

var eventEmitter = window.eventEmitter;

function SlideDeck(sections, opts) {
  opts = opts || {};

  this.sections = sections;
  this.wrapAround = opts.wrapAround || false;

  this.currentSection = 0;
  this.currentSlide = 0;
  this.changeEnabled = true;
}
eventEmitter(SlideDeck);


SlideDeck.prototype.atDeckStart = function() {
  return this.currentSection === 0 && this.currentSlide === 0;
}

SlideDeck.prototype.atDeckEnd = function() {
  return this.currentSection === this.sections.length - 1 && this.currentSlide === this.sections[this.currentSection].length - 1;
}

SlideDeck.prototype.atSectionStart = function() {
  return this.currentSlide === 0;
}

SlideDeck.prototype.atSectionEnd = function() {
  return this.currentSlide === this.sections[this.currentSection].length - 1;
}

SlideDeck.prototype.slideExists = function(section, slide) {
  return 0 <= section && section < this.sections.length && 0 <= slide && slide < this.sections[section].length;
}

SlideDeck.prototype.getSlide = function() {
  return [ this.currentSection, this.currentSlide ];
}

SlideDeck.prototype.setSlide = function(newSection, newSlide) {
  if(this.changeEnabled) {
    if (!this.slideExists(newSection, newSlide)) {
      console.warn("Trying to jump to non-existent section " + newSection + " slide " + newSlide);
      return;
    }
    var oldSection = this.currentSection;
    var oldSlide = this.currentSlide;
    this.currentSection = newSection;
    this.currentSlide = newSlide;
    if (newSection != oldSection || newSlide != oldSlide)
      this.emit('slideChanged', newSection, newSlide, oldSection, oldSlide);
  }
}

SlideDeck.prototype.prevSlide = function() {
  var newSection, newSlide;
  if (this.atDeckStart() && !this.wrapAround) {
    //console.warn("Refusing to wrap around deck start");
    return;
  }
  if (this.atSectionStart()) {
    newSection = (this.currentSection - 1 + this.sections.length) % this.sections.length;
    newSlide = deck.sections[newSection].length - 1;
  }
  else {
    newSection = this.currentSection;
    newSlide = this.currentSlide - 1;
  }
  this.setSlide(newSection, newSlide);
}

SlideDeck.prototype.nextSlide = function() {
  var newSection, newSlide;
  if (this.atDeckEnd() && !this.wrapAround) {
    //console.warn("Refusing to wrap around deck end");
    return;
  }
  if (this.atSectionEnd()) {
    newSection = (this.currentSection + 1) % this.sections.length;
    newSlide = 0;
  }
  else {
    newSection = this.currentSection;
    newSlide = this.currentSlide + 1;
  }
  this.setSlide(newSection, newSlide);
}

SlideDeck.prototype.disableSlideChange = function() { this.changeEnabled = false; }
SlideDeck.prototype.enableSlideChange = function() { this.changeEnabled = true; }