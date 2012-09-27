/*
 
y
|     z
|   /
| /
*---------x


*/

var Vector2d = function(x,y){
	//functions w/ prefix _ alters variable, w/o it returns a variable
	
	if (arguments.length==1 && arguments.length.x != undefined){
		this.x = x.x;
		this.y = x.y;
	} else {
		this.x = x || 0;
		this.y = y || 0;
		
	}
	
	this._add = function(vec){
		this.x += vec.x;
		this.y += vec.y;
	}
	this.add = function(vec){
		if (arguments.length==2) vec = {x: arguments[0]||0, y: arguments[1]||0};
		return new Vector2d(this.x + vec.x, this.y + vec.y);
	}
	
	this.distanceFrom = function(vec){
		var a2 = Math.pow(this.x - vec.x, 2);
		var b2 = Math.pow(this.y - vec.y, 2);
		var c = Math.sqrt(a2 + b2);
		return c;
	}
	
	this._norm = function(){
		var sum = Math.abs(this.x) + Math.abs(this.y);
		this.x = this.x / sum;
		this.y = this.y / sum;
	}
	this.norm = function(){
		var sum = Math.abs(this.x) + Math.abs(this.y);
		return new Vector2d(this.x / sum, this.y / sum);
	}
}

var Vector3d = function(x,y,z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	
	this._add = function(vec){
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
	}
	this.add = function(vec){
		return new Vector3d(this.x + vec.x, this.y + vec.y, this.z + vec.z);
	}
	this.distanceFrom = function(vec){
		var a2 = Math.pow(this.x - vec.x, 2);
		var b2 = Math.pow(this.y - vec.y, 2);
		var c2 = Math.pow(this.z - vec.z, 2);
		var c = Math.sqrt(a2 + b2 + c2);
		return c;
	}
	this._norm = function(){
		var s = Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
		this.x = this.x / s;
		this.y = this.y / s;
		this.z = this.z / s;
	}
	this.norm = function(){
		var s = Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
		return new Vector3d(this.x / s, this.y / s, this.z / s);
	}
}