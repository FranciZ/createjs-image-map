var nexto = nexto?nexto:{};

nexto.Map = function(elementId, width, height){

    this.devicePixelRatio = window.devicePixelRatio || 1;

    this._lastX = 0;
    this._lastY = 0;
    this._zoom = this.devicePixelRatio;
    this._mouseX = 0;
    this._mouseY = 0;
    this._markerAssets = [];
    this._mapAsset = null;
    this._eventListeners = [];
    this._step = 0;

    this.markers = [];

    this.element = document.getElementById(elementId);

    // set the display size of the canvas.
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";

    // set the size of the drawingBuffer
    this.element.width = width * this.devicePixelRatio;
    this.element.height = height * this.devicePixelRatio;

    this._createCanvas(elementId);
    this._setupPan(this.element);

};

nexto.Map.prototype.setSize = function(width, height){

    // set the display size of the canvas.
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";

    // set the size of the drawingBuffer
    this.element.width = width * this.devicePixelRatio;
    this.element.height = height * this.devicePixelRatio;

};

nexto.Map.prototype.on = function(eventType, callback){

    this._eventListeners.push({ type:eventType, cb:callback });

};

nexto.Map.prototype._onPan = function(ev){

    var self = this;

    var x = self._lastX + ev.deltaX * self.devicePixelRatio;
    var y = self._lastY + ev.deltaY * self.devicePixelRatio;

    if(self._isWithinBounds(x, y)) {

        TweenLite.to(self.container, 0.1, {
            x: x,
            y: y
        });

    }

};

nexto.Map.prototype._onPanEnd = function(evt){

    var self = this;

    self._lastX = self.container.x;
    self._lastY = self.container.y;

};

nexto.Map.prototype._onStageMouseMove = function(evt){

    var self = this;

    self._mouseX = evt.stageX;
    self._mouseY = evt.stageY;

};

nexto.Map.prototype._onMouseWheel = function(evt){

    var self = this;

    var spinY = self._normalizeScroll(evt.originalEvent).spinY;

    if(self._isWithinBounds(self.container.x, self.container.y)) {

        self._zoom += spinY;

        if (self._zoom > 0.5) {

            self.container.setTransform(self._lastX, self._lastY, self._zoom, self._zoom, 0, 0, 0);

        } else {
            self._zoom = 0.5;
        }

        if (self._zoom < 3.5) {

            self.container.setTransform(self._lastX, self._lastY, self._zoom, self._zoom, 0, 0, 0);


        } else {

            self._zoom = 3.5;

        }

        self._transformedWidth = self.container.getTransformedBounds().width;
        self._transformedHeight = self.container.getTransformedBounds().height;

        self.updateMarkerScale();

    }

};

nexto.Map.prototype._setupPan = function(myElement){

    var self = this;

    this.hammertime = new Hammer(myElement);

    this.hammertime.on('pan', self._onPan.bind(this));
    this.hammertime.on('panend', this._onPanEnd.bind(this));

    this.stage.addEventListener('stagemousemove', this._onStageMouseMove.bind(this));

    $(this.element).on('mousewheel', this._onMouseWheel.bind(this));

};

nexto.Map.prototype._isWithinBounds = function(x, y){

    var width = this._transformedWidth;
    var height = this._transformedHeight;

    var stageWidth = this.element.width;
    var stageHeight = this.element.height;

    console.log(stageWidth);

    var containerTopLeft = { x: x-width/2, y:y - height/2 };
    var containerBottomRight = { x: x+width/2, y:y + height/2 };

    if((containerBottomRight.x > stageWidth/2 && containerBottomRight.y > stageHeight/2) && (containerTopLeft.x < stageWidth/2 && containerTopLeft.y < stageHeight/2)){
        return true;
    }else{
        return false;
    }


};

nexto.Map.prototype.updateMarkerScale = function(){

    var self = this;

    _.each(self.markers, function(marker, index){

        self.markers[index].container.scaleX = self.markers[index].container.scaleY = 1/self._zoom+((1-1/self._zoom)*0.1);

    });

};

nexto.Map.prototype._createCanvas = function(elementId){

    //Create a stage by getting a reference to the canvas
    this.stage = new createjs.Stage(elementId);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.stage);

};

nexto.Map.prototype.destroy = function(){

    this.stage.enableDOMEvents(false);

    createjs.Ticker.removeEventListener("tick", this.stage);
    createjs.Ticker.reset();

    _.each(this._markerAssets, function(marker){

        marker = null;

    });

    this.hammertime.off('pan', self._onPan);
    this.hammertime.off('panend', this._onPanEnd);

    this.stage.removeEventListener('stagemousemove', this._onStageMouseMove);

    $(this.element).off('mousewheel');

    this._markerAssets = null;
    this._mapAsset = null;

};

nexto.Map.prototype.getZoom = function(){

    return this._zoom;

};

nexto.Map.prototype.setZoom = function(level){

    var self = this;

    self._zoom = level;

    TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

};

nexto.Map.prototype.zoomIn = function(){

    var self = this;

    self._zoom += 0.4;

    if(self._zoom >0.5) {

        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }else{
        self._zoom = 0.5;
    }

    if(self._zoom < 3.5) {

        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }else{

        self._zoom = 3.5;
        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }

    this._transformedWidth = this.container.getTransformedBounds().width;
    this._transformedHeight = this.container.getTransformedBounds().height;

    self.updateMarkerScale();

};

nexto.Map.prototype.zoomOut = function(){


    var self = this;

    self._zoom -= 0.4;

    if(self._zoom >0.5) {

        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }else{
        self._zoom = 0.5;
    }

    if(self._zoom < 3.5) {

        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }else{

        self._zoom = 3.5;
        TweenLite.to(self.container, 0.1, {scaleX:self._zoom, scaleY:self._zoom});

    }

    this._transformedWidth = this.container.getTransformedBounds().width;
    this._transformedHeight = this.container.getTransformedBounds().height;

    self.updateMarkerScale();

};

nexto.Map.prototype.loadMarkers = function(paths, cb){

    var preload = new createjs.LoadQueue(true, null, true);

    _.each(paths, function(path, i){

        preload.loadFile(path);

    });

    preload.addEventListener("fileload", this._onMarkerLoaded.bind(this));

};

nexto.Map.prototype._onMarkerLoaded = function(evt){

    this._markerAssets.push({ src:evt.item.src , img: evt.result, originalEvent:evt});

    if(evt.target.progress === 1){
        this._loadStep();
    }

};

nexto.Map.prototype.loadMap = function(path, cb){

    var preload = new createjs.LoadQueue();

    preload.addEventListener("fileload", this._onMapLoaded.bind(this));

    preload.loadFile(path);

};

nexto.Map.prototype._onMapLoaded = function(evt){

    this._mapAsset = { src:evt.item.src , img: evt.result, originalEvent:evt};

    if(evt.target.progress === 1){
        this._loadStep();
    }

};

nexto.Map.prototype._loadStep = function(){

    this._step++;

    if(this._step === 2){
        this._loadDone();
    }

};

nexto.Map.prototype._loadDone = function(){

    this._draw(this._mapAsset.img);
    
    _.each(this._eventListeners, function(eventListener, i){

        console.log(eventListener);

        if(eventListener.type === 'onload') {

            eventListener.cb(this);

        }

    });

};

nexto.Map.prototype._draw = function(img){

    var self = this;

    if(this.container){

        this.container.removeChild(this.bitmap);
        this.bitmap = null;

        this.stage.removeChild(this.container);
        this.container = null;

    }

    this.bitmap = new createjs.Bitmap(img);

    var width = this.bitmap.getTransformedBounds().width;
    var height = this.bitmap.getTransformedBounds().height;

    this.bitmap.regX = width/2;
    this.bitmap.regY = height/2;
    this.container = new createjs.Container();
    this.container.addChild(this.bitmap);
    this.stage.addChild(this.container);

    this._lastX = this.container.x = this.element.width/this.devicePixelRatio;
    this._lastY = this.container.y = this.element.height/this.devicePixelRatio;

    this.container.scaleX = this.container.scaleY = this._zoom;

    this._transformedWidth = this.container.getTransformedBounds().width;
    this._transformedHeight = this.container.getTransformedBounds().height;

    this.container.addEventListener('click', function(evt){

        var cX = self.container.x;
        var cY = self.container.y;

        var mX = evt.stageX;
        var mY = evt.stageY;

        var cW = self.container.getTransformedBounds().width;
        var cH= self.container.getTransformedBounds().height;

        var left = cX - cW/2;
        var top = cY - cH/2;

        var rX = ((left + mX)-left*2) / cW;
        var rY = ((top + mY)-top*2) / cH;

        _.each(self._eventListeners, function(eventListener, i){

            if(eventListener.type === 'mapclick') {

                eventListener.cb({
                    originalEvent: evt,
                    container: {x: cX, y: cY, width: cW, height: cH},
                    mouse: {x: mX, y: mY},
                    ratio: {x: rX, y: rY}
                });

            }

        });

        console.log('cX:', cX);
        console.log('cY:', cY);
        console.log('mX:', mX);
        console.log('mY:', mY);
        console.log('cW:', cW);
        console.log('cH:', cH);

        var markerImg = self._markerAssets[0];

    });

    this.stage.update();

    console.log('Draw');

};

nexto.Map.prototype.clearMarkers = function(){

    var self = this;

    _.each(this.markers, function(marker, i){

        self.container.removeChild(marker.container);
        self.markers.splice(i,1);

    });

};

nexto.Map.prototype.addMarker = function(markerPath, ratioX, ratioY, width, height){

    var markerData = _.find(this._markerAssets, {src:markerPath});

    var marker = new nexto.Marker(markerData, this.container, this._zoom, ratioX, ratioY, width, height);

    this.markers.push(marker);

    this.container.addChild(marker.container);

    return marker;

};

nexto.Map.prototype._normalizeScroll = function(event){

    // Reasonable defaults
    var PIXEL_STEP  = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;


        var sX = 0, sY = 0,       // spinX, spinY
            pX = 0, pY = 0;       // pixelX, pixelY

        // Legacy
        if ('detail'      in event) { sY = event.detail; }
        if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
        if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
        if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

        // side scrolling on FF with DOMMouseScroll
        if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
            sX = sY;
            sY = 0;
        }

        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;

        if ('deltaY' in event) { pY = event.deltaY; }
        if ('deltaX' in event) { pX = event.deltaX; }

        if ((pX || pY) && event.deltaMode) {
            if (event.deltaMode == 1) {          // delta in LINE units
                pX *= LINE_HEIGHT;
                pY *= LINE_HEIGHT;
            } else {                             // delta in PAGE units
                pX *= PAGE_HEIGHT;
                pY *= PAGE_HEIGHT;
            }
        }

        // Fall-back if spin cannot be determined
        if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
        if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

        return { spinX  : sX,
            spinY  : sY,
            pixelX : pX,
            pixelY : pY };


};
