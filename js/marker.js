var nexto = nexto?nexto:{};

nexto.Marker = function(img, parent, zoom, rX, rY, width, height){

    this.devicePixelRatio = window.devicePixelRatio || 1;

    this._width = width?width:45;
    this._height = height?height:45;
    this.parent = parent;
    this.rX = rX;
    this.rY = rY;
    this._img = img;
    this._zoom = zoom;

    this.draw();

};


nexto.Marker.prototype.draw = function(){

    var self = this;

    var marker = new createjs.Bitmap(this._img.img);

    marker.scaleX = 0.5*this.devicePixelRatio;
    marker.scaleY = 0.5*this.devicePixelRatio;

    marker.x = -(this._width*this.devicePixelRatio)/2;
    marker.y = -(this._height*this.devicePixelRatio)/2;

    this.container = new createjs.Container();

    this.container.x = self.rX*self.parent.getBounds().width-self.parent.getBounds().width/2;
    this.container.y = self.rY*self.parent.getBounds().height-self.parent.getBounds().height/2;

    this.container.scaleX = this.container.scaleY = 1/self._zoom+((1-1/self._zoom)*0.1);

    this.container.addChild(marker);

    this.marker = marker;

};

nexto.Marker.prototype.setImage = function(img){

    var marker = new createjs.Bitmap(img);

    this._img = img;

    this.container.removeChild(this.marker);

    marker.scaleX = 0.5*this.devicePixelRatio;
    marker.scaleY = 0.5*this.devicePixelRatio;

    marker.x = -(32*this.devicePixelRatio)/2;
    marker.y = -(32*this.devicePixelRatio);

    this.container.addChild(marker);

    this.marker = marker;

};