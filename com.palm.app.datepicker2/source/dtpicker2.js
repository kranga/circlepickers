var mydate = new Date();
var mode = "hour";
var currentRotation = 90;


var circleRadius = 96;
var globalOrigin = {
	x: 116,
	y: 116	
};
var start = {
	x : undefined,
	y : undefined
};
var stop =  {
	x: undefined,
	y: undefined
};


//var intervalConst = 25;
var intervalConst = 15;
var stepConst = 3;

var downFlag = false;
var dragFlag = false;
var initialTheta = undefined;
var moveTheta = undefined;


var animatingFlag = false;
var stepSize;
var startAnimation;
var stopAnimation;
var currentStep;
var maxSteps;
var animationIntervalID;
var animationDistance;

function mydisplayString() {
	
	var hourD = mydate.getHours();
	var minutesD = mydate.getMinutes();
	var secondsD = mydate.getSeconds();
	var ampmD = " PM ";
		if (hourD < 12){
			ampmD = " AM "
		};
		if (hourD > 12){
			hourD -= 12
		};
		if (hourD < 10){
			if (hourD === 0) hourD = "12";
			else hourD = "0" + hourD
		};
		if (minutesD < 10){
			minutesD = "0" + minutesD;
		};
		if (secondsD < 10){
			secondsD = "0" + secondsD;
		};
		var realtimeD = {hours:hourD+ ":",mins:minutesD+ ":",secs:secondsD+ " ", ampm:ampmD};
				
		return (realtimeD);
}

enyo.kind({
	name: "enyo.Testbed",
	kind: enyo.VFlexBox,
	pack: "center",
	align: "center",
	components: [

		{name: "DatePicker2", kind: enyo.VFlexBox, className: "date-picker2", pack: "center", align: "center", onmouseup: "myup", onmousemove: "mymove", components: [
		{name: "log", content: $L("log"), onclick: "logClicked"},
//		{name: "text", content: $L("5  :  05  AM"), className: "half-circle-text", onclick: "arrowClicked"},
		{name: "text", className: "half-circle-text", components:[
			{name:"hrtxt",content:$L("12:"), className:"fleft", onclick: "tabsClicked"},
			{name:"mintxt",content:$L("12:"), className:"fleft", onclick: "tabsClicked"},
			{name:"sectxt",content:$L("12 "), className:"fleft", onclick: "tabsClicked"},
			{name:"aptxt",content:$L("AM"), className:"fleft", onclick: "tabsClicked"}
		]
		},
		{name: "underline", className: "underline"},
		{name: "halfCircle", className: "half-circle", onmousedown: "mydown", /* onmousemove: "mymove", onmouseup: "myup", onmouseout: "myup", */ components: [
			{name: "ball", className: "ball"},
			{name: "arrow", className: "arrow", onclick: "arrowClicked"},
			{name: "number0", content: $L("12"), className: "number n0"},
			{name: "number1", content: $L("1"), className: "number n1"},
			{name: "number2", content: $L("2"), className: "number n2"},
			{name: "number3", content: $L("3"), className: "number n3"},
			{name: "number4", content: $L("4"), className: "number n4"},
			{name: "number5", content: $L("5"), className: "number n5"},
			{name: "number6", content: $L("6"), className: "number n6"},
			{name: "number7", content: $L("7"), className: "number n7"},	
			{name: "number8", content: $L("8"), className: "number n8"},
			{name: "number9", content: $L("9"), className: "number n9"},			
			{name: "number10", content: $L("10"), className: "number n10"},						
			{name: "number11", content: $L("11"), className: "number n11"},
		]
		},
		]},	
	],


		setPosition: function(elem, theta) {					
			
		
			bounds = elem.getBounds();
			//if (bounds.width == undefined) bounds.width = 0;
			//if (bounds.height == undefined) bounds.height = 0;
			
			this.setBasicPosition(elem, bounds.width, bounds.height, theta, 96, globalOrigin);
		//	this.$.log.setContent("width: " + bounds.width + "height: " + bounds.height + "top: " + bounds.top + "left: " + bounds.left);

					

		},	
	
		setBasicPosition: function(elem, w, h, t, r, o) {
			
			t = t + 270;
			t = t % 360;
			
			a = (t * Math.PI / 180);
			 
			elem.applyStyle("left", Math.round(o.x + r*(Math.cos(a)) - (w/2)) +  "px");
			elem.applyStyle("top", Math.round(o.y + r*(Math.sin(a)) - (h/2)) + "px");			
		},	
	
	create: function() {
		this.inherited(arguments);
		
		setTimeout(enyo.bind(this, "updateState"), 10);				
	},
	
	snapToValue: function() {
		
		
		if (mode === "ampm") {
			this.ampmSnapToValue();
			return;
		}
				
		var val;
		var dint = 360 / numSlots;
		val = (Math.round(currentRotation / dint) * dint);

		
		newRotation = val;
		
		if (currentRotation > newRotation) step = -(stepConst);
		else step = stepConst;
		this.animateBetweenDegrees(currentRotation, newRotation, step, intervalConst);
	},
	
	ampmSnapToValue: function() {
		var newRotation, step, deg;
		// this.animateBetweenDegrees(135, 0, -0.20, 1);
		// 
		// this.animateBetweenDegrees(315, 0, 0.20, 1);
		// 
		// this.animateBetweenDegrees(315, 270, -0.20, 1);
		
		//this.animateBetweenDegrees(135, 270, 0.20, 1);
		
		deg = currentRotation;
		
		if (deg < 135) {
			step = -(stepConst);
			newRotation = 0;
		}
		else if (deg < 270) {
			step = stepConst;
			newRotation = 270;
		}
		else if (deg < 315) {
			step = -(stepConst);
			newRotation = 270;
		}
		else {
			step = stepConst;
			newRotation = 0;	
		}		
		
		
		this.animateBetweenDegrees(deg, newRotation, step, intervalConst);		
		
	},

	myclick: function(inSender, inEvent) {
		
		var theta, point, rem, interval, slots, dest;		
		
		point = this.adjustMouseCoordinates(inEvent);
		
		theta = this.utilPointToDegree(point);
		
		// (mode === "ampm") slots = 2;
	//	else slots = 12;
		if (animatingFlag == true) return;		
		
		if (mode === "ampm") {
			this.ampmClick(theta);
			return;
		}		
		
		interval = (360 / numSlots);
				
		rem = theta % interval;
		
		theta = theta - rem;
		if ( rem < (interval/2)) rem = 0; else rem = interval;
		
		theta = theta+rem;
		
		dest = currentRotation + theta;
	
		 if (theta <= 180) this.animateBetweenDegrees(currentRotation, dest, stepConst, intervalConst);
		 
		 if (theta > 180) this.animateBetweenDegrees(currentRotation, dest, -(stepConst), intervalConst);

	},
	
	ampmClick: function(degree) {
		var start, dest;
		
		//this.$.log.setContent("here " + degree);
		
		if (currentRotation == 0) {
			if ( (degree > 180) && (degree < 315)) this.animateBetweenDegrees(0, 270, -(stepConst), intervalConst);
		} else if (currentRotation == 270) {
			if ( (degree < 180) && (degree > 45)) this.animateBetweenDegrees(270, 0, stepConst, intervalConst);	
		}			
	},
	
	mydown: function(inSender, inEvent) {
		this.ballFlag = false;
			
		start = this.adjustMouseCoordinates(inEvent);
		
		if (this.inBounds(this.$.arrow.getBounds(), start)) return;
		
		this.downFlag = true;
		
		initialTheta = currentRotation;
		
	},
	
	mymove: function(inSender, inEvent) {
 		var diffy;
		
		
		if (!this.downFlag) return;
		
		this.dragFlag = true;
		
		stop = this.adjustMouseCoordinates(inEvent);
		
		diffy = -(this.find_angle(start, stop, globalOrigin));
		
		if (Math.abs(diffy - currentRotation) > 3) {
			currentRotation = diffy;
			this.rotate(currentRotation, "mymove");			
		}
		

	},
	
	myup: function(inSender, inEvent) {
		
		if (!this.downFlag) return;
		
		stop = this.adjustMouseCoordinates(inEvent);

		if (this.dragFlag) {
			this.snapToValue();
		}
		else {
			this.myclick(inSender, inEvent);
		}
		
		this.dragFlag = false;
		this.downFlag = false;
	},
	
	myout: function(inSender, inEvent) {
		//if (this.)
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
				
//		this.$.log.setContent("start: " + t1 + " stop: " + t2);
		
		diffy = t2 - t1;
		
		diffy = (diffy + 360) % 360;
		
		return (diffy);
	},
	
	rotate: function (degrees, string)
	{
		var adjustedDegrees, oldDegrees;
		degrees = (degrees + 360) % 360;		
		adjustedDegrees = 360 - degrees;
		
		this.setPosition(this.$.number0, 0 + adjustedDegrees);
		this.setPosition(this.$.number1, 30 + adjustedDegrees);
		this.setPosition(this.$.number2, 60 + adjustedDegrees);
		this.setPosition(this.$.number3, 90 + adjustedDegrees);
		this.setPosition(this.$.number4, 120 + adjustedDegrees);
		this.setPosition(this.$.number5, 150 + adjustedDegrees);
		this.setPosition(this.$.number6, 180 + adjustedDegrees);
		this.setPosition(this.$.number7, 210 + adjustedDegrees);
		this.setPosition(this.$.number8, 240 + adjustedDegrees);
		this.setPosition(this.$.number9, 270 + adjustedDegrees);
		this.setPosition(this.$.number10, 300 + adjustedDegrees);
		this.setPosition(this.$.number11, 330 + adjustedDegrees);
		
		currentRotation = degrees;
		

			
		 if (mode == "hour") {
		 	mydate.setHours(this.degreesToHours(currentRotation));	
		 }
		 else if (mode == "minute") {
		 	mydate.setMinutes(this.degreesToMinutes(currentRotation));
		}
		else if (mode == "second") {
			seconds = Math.round(currentRotation/6);
			if (seconds >= 60) seconds = 0;
			mydate.setSeconds(seconds);
		}
		else if (mode == "ampm") {
			mydate.setHours(this.degreesToAmpm(currentRotation));	
		}
		
		var hrtxtObj  = document.getElementById('testbed_hrtxt'),
			mintxtObj = document.getElementById('testbed_mintxt'),
			sectxtObj = document.getElementById('testbed_sectxt'),
			aptxtObj  = document.getElementById('testbed_aptxt');	
			
		var getRTime = 	mydisplayString();
			
		if(hrtxtObj.firstChild) 	hrtxtObj.firstChild.nodeValue  = getRTime.hours;
		if(mintxtObj.firstChild) 	mintxtObj.firstChild.nodeValue = getRTime.mins;
		if(sectxtObj.firstChild) 	sectxtObj.firstChild.nodeValue = getRTime.secs;
		if(aptxtObj.firstChild) 	aptxtObj.firstChild.nodeValue  = getRTime.ampm;		
	},
	
	logClicked: function() {
		this.test();
		
	},
	
	meanimate : function() {
		var degree, diff;
		
		degree = Math.round(this.startAnimation + (this.currentStep*this.stepSize));
		degree = (degree + 360) % 360;
		
		diff = Math.abs(degree - this.stopAnimation);
		
		if  ( (diff < Math.abs(this.stepSize/2)) || (this.currentStep >= this.maxSteps) ) {
			clearInterval(this.animationIntervalID);
			degree = this.stopAnimation;
			this.animatingFlag = false;
		}
		
		this.currentStep++;
		this.rotate(degree, "meanimate");
			
	},
	
	animateBetweenDegrees : function(degree1, degree2, step, interval) {
		
		if (this.animatingFlag || step == 0) return;
		
		this.startAnimation = (degree1 + 360)%360;
		this.stopAnimation = (degree2 + 360)%360;
		this.stepSize = step;
		this.currentStep = 0;
		this.animatingFlag = true;
		this.maxSteps = this.calculateMaxSteps(step, this.startAnimation, this.stopAnimation);
		
		//this.$.log.setContent("values: " + this.startAnimation + this.stopAnimation + this.stepSize + this.currentStep + this.animatingFlag);
		
		this.animationIntervalID = setInterval(enyo.bind(this, "meanimate"), interval);
		
	},
	
	calculateMaxSteps : function(step, degree1, degree2) {
		var distance;
		if (step > 0) {
			distance = degree2 -degree1;
			if (distance < 0) distance = 360 + distance;
		}
		else if (step < 0) {
			distance = degree1 -degree2;
			if (distance < 0) distance = 360 + distance;		
		}
		
		if (distance >= 135) {
			step = step*2.5;
			this.stepSize = step;
		}
        
        this.animationDistance = distance;
		//this.$.log.setContent("distance: " + distance + " step: " + step);
		return ( (Math.abs(distance) / Math.abs(step)) + 1);
	},
    
	calcDegree: function() {
		var i, v, N, A, B, X, degree;

		i = this.currentStep;
		N = this.maxSteps;
		A = 0; B = this.animationDistance;
		v = i / N;
		v = this.smoothstep(v);
		X = A + v*B;
		// 
		if (this.stepSize < 0) X = -X;
		// 
		return Math.round((((this.startAnimation + X) + 360) % 360));	
		
		//this.$.log.setContent("i: " + i + " N: " + N + " A: " + A + " B: " + B + " v: " + v + " X: " + X);
		
		//degree = Math.round(this.startAnimation + (this.currentStep*this.stepSize));
		//degree = (degree + 360) % 360;
		
		//return (degree);
	},
    
	smoothstep: function(x) {
		return ((x) * (x) * (3 - 2 * (x)));
	},
    
	showNumbers: function() {
		this.changeState();	
		this.$.ball.applyStyle("opacity", 1);
		this.$.number0.applyStyle("opacity", 1);
		this.$.number1.applyStyle("opacity", 1);
		this.$.number2.applyStyle("opacity", 1);
		this.$.number3.applyStyle("opacity", 1);
		this.$.number4.applyStyle("opacity", 1);
		this.$.number5.applyStyle("opacity", 1);
		this.$.number6.applyStyle("opacity", 1);
		this.$.number7.applyStyle("opacity", 1);
		this.$.number8.applyStyle("opacity", 1);
		this.$.number9.applyStyle("opacity", 1);
		this.$.number10.applyStyle("opacity", 1);
		this.$.number11.applyStyle("opacity", 1);
	},
	
	
	hideNumbers: function() {
		this.$.ball.applyStyle("opacity", 0);
		this.$.number0.applyStyle("opacity", 0);
		this.$.number1.applyStyle("opacity", 0);
		this.$.number2.applyStyle("opacity", 0);
		this.$.number3.applyStyle("opacity", 0);
		this.$.number4.applyStyle("opacity", 0);
		this.$.number5.applyStyle("opacity", 0);
		this.$.number6.applyStyle("opacity", 0);
		this.$.number7.applyStyle("opacity", 0);
		this.$.number8.applyStyle("opacity", 0);
		this.$.number9.applyStyle("opacity", 0);
		this.$.number10.applyStyle("opacity", 0);
		this.$.number11.applyStyle("opacity", 0);	
			
		this.opacityID = setTimeout(enyo.bind(this, "showNumbers") , 330);
	},
	
	changeState: function() {
		var stateDegrees = 0;

		if(this.$.underline.hasClass("hour")) this.$.underline.removeClass("hour");
		if(this.$.underline.hasClass("minute")) this.$.underline.removeClass("minute");
		if(this.$.underline.hasClass("second")) this.$.underline.removeClass("second");
		if(this.$.underline.hasClass("ampm")) this.$.underline.removeClass("ampm");
		
		if (mode === "hour") {
			stateDegrees = this.hoursToDegrees(mydate.getHours());
			this.$.underline.removeClass("minute");
			this.$.underline.removeClass("ampm");
			this.$.underline.addClass("hour");
			numSlots = 12;
		}
		else if (mode === "minute") {
			stateDegrees = this.minutesToDegrees(mydate.getMinutes());
			this.$.underline.removeClass("hour");
			this.$.underline.removeClass("ampm");
			this.$.underline.addClass("minute");
			numSlots = 60;
		}
		else if (mode === "second") {
				stateDegrees = this.minutesToDegrees(mydate.getSeconds());
				this.$.underline.addClass("second");
				numSlots = 60;
		}
		else if (mode === "ampm") {
			stateDegrees = this.ampmToDegrees(mydate.getHours());
			this.$.underline.removeClass("hour");
			this.$.underline.removeClass("minute");
			this.$.underline.addClass("ampm");
			numSlots = 2;
		}
		
		if (mode === "minute" || mode === "second") {
			this.$.number0.setContent($L("0"));
			this.$.number1.setContent($L("5"));
			this.$.number2.setContent($L("10"));
			this.$.number3.setContent($L("15"));
			this.$.number4.setContent($L("20"));
			this.$.number5.setContent($L("25"));
			this.$.number6.setContent($L("30"));
			this.$.number7.setContent($L("35"));
			this.$.number8.setContent($L("40"));
			this.$.number9.setContent($L("45"));
			this.$.number10.setContent($L("50"));
			this.$.number11.setContent($L("55"));
		} else if (mode === "hour") {
			this.$.number0.setContent($L("12"));
			this.$.number1.setContent($L("1"));
			this.$.number2.setContent($L("2"));
			this.$.number3.setContent($L("3"));
			this.$.number4.setContent($L("4"));
			this.$.number5.setContent($L("5"));
			this.$.number6.setContent($L("6"));
			this.$.number7.setContent($L("7"));
			this.$.number8.setContent($L("8"));
			this.$.number9.setContent($L("9"));
			this.$.number10.setContent($L("10"));
			this.$.number11.setContent($L("11"));		
		} else if (mode === "ampm") {
			this.$.number0.setContent($L("AM"));
			this.$.number1.setContent($L(""));
			this.$.number2.setContent($L(""));
			this.$.number3.setContent($L(""));
			this.$.number4.setContent($L(""));
			this.$.number5.setContent($L(""));
			this.$.number6.setContent($L(""));
			this.$.number7.setContent($L(""));
			this.$.number8.setContent($L(""));
			this.$.number9.setContent($L("PM"));
			this.$.number10.setContent($L(""));
			this.$.number11.setContent($L(""));
		}
		
		this.rotate(stateDegrees, "UpdateState");
    },
	
	updateState: function() {
        this.hideNumbers();	
		
	},
	
	tabsClicked: function(inSender, inEvent) {
		var eleClicked = inSender.id;
		switch(eleClicked){
			case 'testbed_hrtxt':
				mode="hour";
				break;
			case 'testbed_mintxt':
				mode="minute";
				break;	
			case 'testbed_sectxt':
				mode="second";
				break;
			case 'testbed_aptxt':
				mode="ampm";
				break;	
		}
		this.updateState();
	},	
	
	
	hoursToDegrees: function(hours) {
		hours = hours % 12;
		return (hours*30);	
	},
	
	minutesToDegrees: function (minutes) {
		return (minutes*6);	
	},
	
	ampmToDegrees: function (hours) {
		if (hours < 12) return (0);
		else return (270);
	},
	
	degreesToHours: function(degrees) {
		var hours, base;
		
		if (mydate.getHours() < 12) base = 0; else base = 12; 
		degrees = degrees % 360;
		hours = (Math.round(degrees/30)%12) + base;
		return (hours);
	},
	
	degreesToMinutes: function(degrees) {
		degrees = degrees % 360;
		var minutes;
		minutes = Math.round(degrees/6);
		return (minutes%60);
	},
	
	degreesToAmpm: function(degrees) {
		
		var hours, part;
	
		degrees = degrees % 360;
		part = mydate.getHours() % 12;
		if ( (degrees > 315) || (degrees < 135)) hours = part;
		else hours = 12 + part;
		return (hours);
	},
	
	arrowClicked: function(inSender, inEvent) {
		if (mode === "hour") {
			mode = "minute";
		}
		else if (mode === "minute") {
			mode = "second";
		}
		else if (mode === "second") {
			mode = "ampm";
		}
		else {
			mode = "hour";
		}
		this.updateState();
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
		
		circleBounds = this.$.halfCircle.getBounds();
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
	
	test: function() {
		
		//this.calculateMaxSteps(-stepConst, 330, 320);

		//this.animateBetweenDegrees(30, 330, -0.20, 1);
		// this.mode = "minute";
		// 	this.$.log.setContent("mode " + this.mode)
		// 	this.updateState();
		// 	this.refresh();
		
		
	},
	

	
	
	
});