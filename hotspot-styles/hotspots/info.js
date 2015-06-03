scene.hotspotContainer().createHotspot(document.querySelector("#info"), { yaw: -2.93, pitch: -0.15 });

document.querySelector("#info .icon_wrapper").addEventListener('click', function() {
  document.querySelector("#info").classList.toggle('expanded');
  document.querySelector("#inner_icon").classList.toggle('closeIcon');
});

document.querySelector("#info .close").addEventListener('click', function() {
  document.querySelector("#info").classList.remove('expanded');
  document.querySelector("#inner_icon").classList.remove('closeIcon');
});


document.querySelector('#info input[type="text"]').addEventListener('keydown', function(evt) {
  evt.stopPropagation();
});