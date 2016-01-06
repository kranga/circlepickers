var mint;

var globalOrigin = {
	x: 116,
	y: 116	
};

var animatingFlag = false;
var baseValue = 0;

var currentRotation = 90;

var changeTheta = 0;
var oldChangeTheta = 0;
var totalChangeTheta = 0;
var animateChangeTheta = 0;

var circleRadius = 96;

var start = {
	x : undefined,
	y : undefined
};

var stop =  {
	x: undefined,
	y: undefined
};

var mousespeed = {
	lastx: undefined,
	lasty: undefined,
	lasttime: undefined
};

var startValue = 0;
var startDegree;
var slotWidth = 15;


var ballFlag = false;
var downFlag = false;
var dragFlag = false;
var initialTheta = undefined;
var moveTheta = undefined;

var opacityID = undefined;

enyo.kind({
	name: "enyo.Testbed",
	kind: enyo.VFlexBox,
	pack: "center",
	align: "center",
	components: [
			{name: "IntegerPicker1", kind: enyo.VFlexBox, className: "integer-picker1", pack: "center", align: "center", onmouseup: "myup", onmousemove: "mymove", components: [
//			{name: "log", content: $L("log"), onclick: "logClicked"},
			{name: "animator", kind: enyo.Animator, onBegin: "beginAnimation", onAnimate: "stepAnimation", onEnd: "endAnimation", onStop: "stopAnimation"},
			{name: "text", content: $L("0"), className: "half-circle-text"},
			{name: "Circle", className: "circle", onmousedown: "mydown", components: [
				{name: "ball", className: "ball"},				
				{name: "doneButton", layoutKind: "HFlexLayout", align: "center", className: "done-button", components: [
					{name: "leftBracket", content: $L("("), className: "bracket"},
					{name: "done", content: $L("Done"), className: "done"},
					{name: "rightBracket", content: $L(")"), className: "bracket"},	
				]},
		]},
	]},
			
	],
		
		
	create: function() {
		this.inherited(arguments);
		setTimeout(enyo.bind(this, "updateState"), 1);	
	},
	
	// rendered: function() {
	// 	this.inherited(arguments)
	// }

		logClicked: function() {
		 	this.test(); 		
		},

		test: function() {
			//this.updateState();
			this.rotate(90);
		},

		setPositionByDegree: function(elem, theta) {							
			bounds = elem.getBounds();


			this.setBasicPositionByDegree(elem, bounds.width, bounds.height, theta, 96, globalOrigin);
		},	

		setBasicPositionByDegree: function(elem, w, h, t, r, o) {
			var oldt;
			var p = {
				x: 0,
				y: 0	
			};	

			oldt = t;
			t = (t + 270) % 360;

			t = t * (Math.PI/180);

			p.x = o.x + r*(Math.cos(t)) - (w/2);
			p.y = o.y + r*(Math.sin(t)) - (h/2);

			this.setBasicPositionByPoint(elem, p);
			if (elem != this.$.ball) elem.applyStyle("-webkit-transform", "rotate("+oldt+"deg)");	
		},

		setBasicPositionByPoint: function(elem, p) {
			p.x = Math.round(p.x);
			p.y = Math.round(p.y);

			elem.applyStyle("left", p.x +  "px");
			elem.applyStyle("top", p.y + "px");
		},	

		rotate: function (degrees)
		{
			degrees = (degrees + 360) % 360;		
			


			currentRotation = degrees;

			this.setPositionByDegree(this.$.ball, currentRotation);
			//this.degreeToNum(currentRotation);
			this.degreeToNum(totalChangeTheta);
		},
		
		
		degreeToNum: function (degrees) {
			num = Math.round(degrees/slotWidth);
			this.$.text.setContent(num);
			totalChangeTheta = num*slotWidth;
		},

		showNumbers: function() {
			this.changeState();	
			this.$.ball.applyStyle("opacity", 1);			
		},


		hideNumbers: function() {
			this.$.ball.applyStyle("opacity", 0);
			this.opacityID = setTimeout(enyo.bind(this, "showNumbers") , 330);
		},

		changeState: function() {
			var stateDegrees = 0;    

			totalChangeTheta = 0;

			this.rotate(stateDegrees);	
		},


		updateState: function() {		
				
			this.hideNumbers();								
			//this.$.ball.applyStyle("opacity", 1);
		},	

		dotProduct: function(v1, v2) {
			return (v1.x*v2.x + v1.y*v2.y);	
		},

		distance: function(p1, p2) {
			return (this.magnitude(this.pointsToVector(p1, p2)));
		},

		magnitude: function(v) {
			return (Math.sqrt((Math.pow(v.x, 2) + Math.pow(v.y, 2))));
		},

		pointsToVector: function(p1, p2) {
			return { x: p1.x - p2.x, y: p1.y - p2.y};
		},

		xyToPoint: function(x, y) {
			return {x: x, y: y};
		},

		adjustMouseCoordinates: function(inEvent) {
			var circleBounds, x, y;

			circleBounds = this.$.Circle.getBounds();
			x = inEvent.x - circleBounds.left;
			y = inEvent.y - circleBounds.top;

			return {x: x, y: y};

		},

		inBounds: function(bounds, point) {
			if ( (bounds.left <= point.x) && (point.x <= (bounds.left + bounds.width)) &&
					(bounds.top <= point.y) && (point.y <= (bounds.top + bounds.height)) )
				return true;
			else 
				return false;
		},
		
		circleClicked: function(inSender, inEvent) {
			var click, distance;

			click = this.adjustMouseCoordinates(inEvent);

			distance = this.distance(click, globalOrigin);
			if (distance < 65) return;

			theta = this.utilPointToDegree(click);

			if (animatingFlag == true) return;		

			interval = slotWidth;

			rem = theta % interval;

			theta = theta - rem;
			if ( rem < (interval/2)) rem = 0; else rem = interval;

			theta = theta+rem;

			dest = theta;

			this.defaultAnimate(currentRotation, dest);		
		},

		snapToValue: function() {
			var val;
			var dint = slotWidth;
			val = (Math.round(currentRotation / dint) * dint);
			
			newRotation = val;

			this.defaultAnimate(currentRotation, newRotation);
		},	

		mydown: function(inSender, inEvent) {
			start = this.adjustMouseCoordinates(inEvent);

			if (this.inBounds(this.$.doneButton.getBounds(), start)) 
			{
				return;
			}
			this.ballFlag = true;
			this.downFlag = true;
			
			changeTheta =  this.utilPointToDegree(this.adjustMouseCoordinates(inEvent));
			oldChangeTheta = changeTheta;

			initialTheta = currentRotation;
		},

		mymove: function(inSender, inEvent) {												
			if (!this.downFlag) return;
			if (!this.ballFlag) return;

			oldChangeTheta = changeTheta;

			stop = this.adjustMouseCoordinates(inEvent);

			changeTheta = this.utilPointToDegree(this.adjustMouseCoordinates(inEvent));

			moveTheta = this.find_angle(start, stop, globalOrigin);

			totalChangeTheta = totalChangeTheta + this.cycleDiff(oldChangeTheta, changeTheta, 360);

		//	this.$.log.setContent("totalChangeTheta: " + totalChangeTheta);

			var diffy = initialTheta + moveTheta;
			
			//this.$.log.setContent("diffy: " + diffy + " currentRotation: " + currentRotation);

			if (Math.abs(diffy - currentRotation) > 3) {
				this.dragFlag = true;
				currentRotation = diffy;
				this.rotate(currentRotation);			
			}						
		},

		cycleDiff: function(start, end, cycle) {
			var ldif = end - start;

			if (ldif > (cycle/2)) {
				ldif = ldif - cycle;
			} else if (ldif < -(cycle/2)) {
				ldif = ldif + cycle;
			}
				return (ldif);				
		},
		
		myup: function(inSender, inEvent) {

			if (!this.downFlag) return;

			stop = this.adjustMouseCoordinates(inEvent);

			if (this.dragFlag) {
				this.snapToValue();
			}
			else {
				this.circleClicked(inSender, inEvent);
			}

			this.dragFlag = false;
			this.downFlag = false;
			this.ballFlag = false;			
		},

		myout: function(inSender, inEvent) {
			if (!this.downFlag) return;

			stop = this.adjustMouseCoordinates(inEvent);

			if (this.dragFlag) {
				this.snapToValue();
			}

			this.dragFlag = false;
			this.downFlag = false;
			this.ballFlag = false;				
		},

		/**
		* Calculates the angle (in radians) between two vectors pointing outward from one center
		*
		* @param p0 first point
		* @param p1 second point
		* @param c center point
		*/

		find_angle: function(p0,p1,c) {
			var t1, t2, diffy;

			t1 = this.utilPointToDegree(p0);
			t2 = this.utilPointToDegree(p1);		

			diffy = t2 - t1;
			diffy = (diffy + 360) % 360;

			return (diffy);
		},

		degreeToPoint: function(theta) {
			var p;

			p = this.utilDegreeToPoint(theta, circleRadius, globalOrigin);
			return {x: p.x, y : p.y};
		},


		utilDegreeToPoint: function(theta, radius, origin) {
			var x, y, radian;

			radian = theta * Math.PI/180;

			x = Math.round(origin.x + radius*Math.sin(radian));
			y = Math.round(origin.y - radius*Math.cos(radian));

			return { x: x, y : y};            
		},


		utilPointToDegree: function(p) {
			var origin, zero, v1, v2, theta;
			origin = globalOrigin;
			zero = this.degreeToPoint(0);

			v1 = this.pointsToVector(zero, origin);
			v2 = this.pointsToVector(p, origin);

			costheta = this.dotProduct(v1, v2) / (this.magnitude(v1)*this.magnitude(v2)) ;

			theta = Math.acos(costheta) * 180 / Math.PI;

			if (p.x < origin.x) theta = (360 - theta);

			theta = (theta + 360) % 360;

			return (theta);
		},	

		/*takes the shortest path*/
		defaultAnimate: function(degree1, degree2) {
			var distance1, distance2, dest;

			degree1 = (degree1 + 360) % 360;
			degree2 = (degree2 + 360) % 360;

			distance1 = degree2 - degree1;
			distance2 = degree1 - degree2;

			distance1 =  (distance1 + 360) % 360;
			distance2 =  (distance2 + 360) % 360;

			if (distance1 <= distance2) {
				dest = distance1;
			}
			else {
				dest = -(distance2);
			}

			this.animatingFlag = true;
			this.baseValue = degree1;
			animateChangeTheta = totalChangeTheta;
			this.$.animator.play(0, dest);                                                                                                                                                                               
		},

		beginAnimation: function(inSender, inStart, inEnd) {
			this.rotateIfDifferent(inStart);
		},

		stepAnimation: function(inSender, inValue) {
			this.rotateIfDifferent(inValue);
		},

		endAnimation: function(inSender, inValue) {
			this.rotateIfDifferent(inValue);
			this.animatingFlag = false;
		},

		stopAnimation: function(inSender, inValue, inStart, inEnd) {
			this.rotateIfDifferent(inEnd);
			this.animatingFlag = false;
		},			

		rotateIfDifferent: function(value) {
			totalChangeTheta = animateChangeTheta + value;
			value = this.baseValue + value;			
			value = (value + 360) % 360;			
			if (value != this.currentRotation) this.rotate(value);
		},

		cycle: function(num, cycle) {
			while (num < 0) {
				 num = num + cycle;
			}
				return (num % cycle);
		},	
});