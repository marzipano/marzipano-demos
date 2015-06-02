'use strict';

function updateHashWithDeck(deck) {
  /* Bind page hash to slide */

  // Set hash if none is set
  if(!getRoute()) {
    setRoute(0, 0);
  }

  // Update hash when slide changes.
  deck.addEventListener('slideChanged', setRoute);

  // Set slide from initial hash, also update whenever the hash changes.
  updateDeckFromUrl();
  window.addEventListener('hashchange', updateDeckFromUrl);

  function updateDeckFromUrl() {
    deck.setSlide.apply(deck, getRoute());
  }
}

function getRoute() {
  var regex = /^#([0-9]+)\-([0-9]+)$/;
  var match = window.location.hash.match(regex);

  if (!match) {
    return null;
  } else {
    return [ parseInt(match[1]), parseInt(match[2]) ];
  }
}

function setRoute(newSection, newSlide) {
  window.location.hash = newSection + '-' + newSlide;
}

window.updateHashWithDeck = updateHashWithDeck;