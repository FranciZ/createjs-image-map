var nexto = nexto?nexto:{};

nexto.Marker = function(img, parent, zoom, rX, rY){

    this.parent = parent;
    this.rX = rX;
    this.rY = rY;
    this._img = img;
    this._zoom = zoom;

    this.draw();

};


nexto.Marker.prototype.draw = function(){

    var self = this;

    console.log(this._img.img);

    var marker = new createjs.Bitmap(this._img.img);

    marker.scaleX = 0.5;
    marker.scaleY = 0.5;

    marker.x = -32/2;
    marker.y = -32;

    this.container = new createjs.Container();

    this.container.x = self.rX*self.parent.getBounds().width-self.parent.getBounds().width/2;
    this.container.y = self.rY*self.parent.getBounds().height-self.parent.getBounds().height/2;

    this.container.scaleX = this.container.scaleY = 1/self._zoom+((1-1/self._zoom)*0.1);

    this.container.addChild(marker);

    this.marker = marker;

};