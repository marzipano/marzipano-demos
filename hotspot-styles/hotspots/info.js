scene.hotspotContainer().createHotspot(document.querySelector("#info"), { yaw: -2.93, pitch: -0.15 });

document.querySelector("#info .icon_wrapper").addEventListener('click', function() {
  document.querySelector("#info").classList.toggle('expanded');
  document.querySelector("#inner_icon").classList.toggle('closeIcon');

  if(document.querySelector("#info").classList.contains('expanded')) {
    var position = viewer.view().coordinatesToScreen({ yaw: -0.1, pitch: 0.1 });

    // Center the modal horizontally and adjust it vertically
    // It is not possible to precisely center vertically as we do not know its size
    position.x += 175;
    position.y += 150;

    var coords = viewer.view().screenToCoordinates(position, coords);

    viewer.lookTo(coords, { transitionDuration: 300 });
  }
});

document.querySelector("#info .close").addEventListener('click', function() {
  document.querySelector("#info").classList.remove('expanded');
  document.querySelector("#inner_icon").classList.remove('closeIcon');
});


document.querySelector('#info input[type="text"]').addEventListener('keydown', function(evt) {
  evt.stopPropagation();
});