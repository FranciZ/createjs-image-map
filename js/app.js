

var map = new nexto.Map('map-canvas', 600, 400);
var hasMoved = false;
var mouseDown = false;
var marker;

map.loadMap('img/map.jpg');
map.loadMarkers(['img/marker.png','img/cup.png']);

map.on('markersloaded', function(){

    console.log('MARKERS LOADED');

});

setTimeout(function(){

   //map.destroy();
    marker.setImage('img/cup.png');

}, 4000);

map.on('mapclick', function(evt){

    if(!hasMoved) {
        map.clearMarkers();
        marker = map.addMarker('img/marker.png', evt.ratio.x, evt.ratio.y);
    }

});

$('#zoom-in').on('click', function(){

    map.zoomIn();

});

$('#zoom-out').on('click', function(){

    map.zoomOut();

});

$(document).on('mousemove', function(){

    if(mouseDown) {
        hasMoved = true;
    }

});

$(document).on('mouseup', function(){

    mouseDown = false;
    setTimeout(function(){

        hasMoved  = false;

    },0);

});

$(document).on('mousedown', function(){

    mouseDown = true;

});