//magic numbers

var transitionInterval = 100; //millseconds
var circleSize = 0; //pixels

var mode = "month";
var mydate = new Date();

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

var intervalConst = 15;
var stepConst = 3;

var startValue;
var slotWidth;
var numberOfSlots;

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
			{name: "DatePicker1", kind: enyo.VFlexBox, className: "date-picker1", pack: "center", align: "center", onmouseup: "myup", onmousemove: "mymove", components: [
//			{name: "log", content: $L("log"), onclick: "logClicked"},
			{name: "animator", kind: enyo.Animator, onBegin: "beginAnimation", onAnimate: "stepAnimation", onEnd: "endAnimation", onStop: "stopAnimation"},
			{name: "text", className: "half-circle-text", components:[
				{name:"monthtxt",content:$L("Jan"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(" "), className:"fleft"},
				{name:"daytxt",content:$L("1"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(", "), className:"fleft"},
				{name:"yeartxt",content:$L("2012"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(" "), className:"fleft"},
				{name:"hrtxt",content:$L("12"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(" : "), className:"fleft"},
				{name:"mintxt",content:$L("12"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(" : "), className:"fleft"},
				{name:"sectxt",content:$L("12"), className:"fleft", onclick: "tabsClicked"},
				{content: $L(" "), className:"fleft"},
				{name:"aptxt",content:$L("AM"), className:"fleft", onclick: "tabsClicked"}
			]
			},
			{name: "underline", className: "underline left"},
			{name: "Circle", className: "circle", onmousedown: "mydown", components: [
				{name: "ball", className: "ball"},
				{name: "arrow", kind: "CustomButton", className: "arrow", onclick: "arrowClicked"},

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
					
				{name: "doneButton", layoutKind: "HFlexLayout", align: "center", className: "done-button", components: [
					{name: "leftBracket", content: $L("("), className: "bracket"},
					{name: "done", content: $L("Done"), className: "done"},
					{name: "rightBracket", content: $L(")"), className: "bracket"},	
				]},
		]},
	]},	
		
	],
	
	mydisplayString: function() {

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
			var realtimeD = {hours:hourD,mins:minutesD,secs:secondsD, ampm:ampmD, years: mydate.getFullYear(), 
			months: this.monthString(mydate.getMonth()), days: mydate.getDate()};

			return (realtimeD);
	},

	monthString: function(mnum) {
		 var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		 return (months[mnum]);
	},	
	

	create: function() {
		this.inherited(arguments);
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.updateState();
	},
		
	logClicked: function() {
	 	this.test(); 		
	},
	
	test: function() {
		this.defaultAnimate(330, 30);
	},
	
	
	setPositionByDegree: function(elem, theta) {							
		bounds = elem.getBounds();

				
		this.setBasicPositionByDegree(elem, bounds.width, bounds.height, theta, 96, globalOrigin);
	},	
		
	setBasicPositionByDegree: function(elem, w, h, t, r, o) {
		var p = {
			x: 0,
			y: 0	
		};	
						
		t = (t + 270) % 360;
		t = t * (Math.PI/180);
				 
		p.x = o.x + r*(Math.cos(t)) - (w/2);
		p.y = o.y + r*(Math.sin(t)) - (h/2);
				 
		this.setBasicPositionByPoint(elem, p);	
	},
	
	setBasicPositionByPoint: function(elem, p) {
		p.x = Math.round(p.x);
		p.y = Math.round(p.y);
		
		elem.applyStyle("left", p.x +  "px");
		elem.applyStyle("top", p.y + "px");
	},	
	
	centerUnderline: function() {					
		tb = this.$.monthtxt.getBounds();
		ub = this.$.underline.getBounds();		
		
		if (mode == "month") {
			tb = this.$.monthtxt.getBounds();
		} else if (mode == "day")	{
			tb = this.$.daytxt.getBounds();
		} else if (mode == "year")	{
			tb = this.$.yeartxt.getBounds();
		} else if (mode == "hour")	{
			tb = this.$.hrtxt.getBounds();
		} else if (mode == "minute")	{
			tb = this.$.mintxt.getBounds();
		} else if (mode == "second")	{
			tb = this.$.sectxt.getBounds();
		} else if (mode == "ampm")	{
			tb = this.$.aptxt.getBounds();
		}
				
		x = tb.left + (tb.width/2);
		x = x - (ub.width/2);
		x = Math.round(x);
				
		this.$.underline.applyStyle("left", x +  "px");
		this.$.underline.applyStyle("top", (tb.top + tb.height + 60) +  "px");				
	},	

	rotate: function (degrees)
	{
		//var adjustedDegrees, oldDegrees;
		degrees = (degrees + 360) % 360;		
		//adjustedDegrees = 360 - degrees;
				
		 this.setPositionByDegree(this.$.number0, 0);
		 this.setPositionByDegree(this.$.number1, 30);
		 this.setPositionByDegree(this.$.number2, 60);
		 this.setPositionByDegree(this.$.number3, 90);
		 this.setPositionByDegree(this.$.number4, 120);
		 this.setPositionByDegree(this.$.number5, 150);
		 this.setPositionByDegree(this.$.number6, 180);
		 this.setPositionByDegree(this.$.number7, 210);
		 this.setPositionByDegree(this.$.number8, 240);
		 this.setPositionByDegree(this.$.number9, 270);
		 this.setPositionByDegree(this.$.number10, 300);
		 this.setPositionByDegree(this.$.number11, 330);
				
		currentRotation = degrees;
		
		this.setPositionByDegree(this.$.ball, currentRotation);
		
		theta = degrees;
		
		if (mode === "hour") 
		{
			oldhours = mydate.getHours();
			if (oldhours >= 12) oldhours = 12;
			else oldhours = 0;	
			
			hours = Math.floor(theta/30);
			hours = hours + oldhours;
			mydate.setHours(hours);
			
		}
		else if (mode === "minute") {
			minutes = Math.round(theta/6);
			if (minutes >= 60) minutes = 0;
			mydate.setMinutes(minutes);
		}
		else if (mode === "second") {
			seconds = Math.round(theta/6);
			if (seconds >= 60) seconds = 0;
			mydate.setSeconds(seconds);
		}
		else if (mode === "ampm") {
			ampm = Math.floor(theta/180);
			
			hours = mydate.getHours();
			
			hours1 = hours % 12;
			
			if (ampm == 0) {
				hours = hours1;				
			}
			
			if (ampm == 1) {
				hours = hours1  + 12;				
			}
			mydate.setHours(hours);			
			
		} 	else if (mode === "month") 
		{
						//oldhours = mydate.getHours();
						//if (oldhours >= 12) oldhours = 12;
						//else oldhours = 0;	
						months = Math.round(theta/30);
						if (months >= 12) months = 0;
						mydate.setMonth(months);
		}
		else if (mode === "day") 
		{
			mydate.setDate(this.degreeToDay(totalChangeTheta));
		}
		else if (mode === "year") 
		{
			mydate.setFullYear(this.degreeToYear(totalChangeTheta));
		}
		
				
		var hrtxtObj  = document.getElementById('testbed_hrtxt'),
			mintxtObj = document.getElementById('testbed_mintxt'),
			sectxtObj = document.getElementById('testbed_sectxt'),
			aptxtObj  = document.getElementById('testbed_aptxt');
			yeartxtObj  = document.getElementById('testbed_yeartxt');
			monthtxtObj  = document.getElementById('testbed_monthtxt');
			daytxtObj  = document.getElementById('testbed_daytxt');
	
			
		var getRTime = 	this.mydisplayString();
			
		if(hrtxtObj.firstChild) 	hrtxtObj.firstChild.nodeValue  = getRTime.hours;
		if(mintxtObj.firstChild) 	mintxtObj.firstChild.nodeValue = getRTime.mins;
		if(sectxtObj.firstChild) 	sectxtObj.firstChild.nodeValue = getRTime.secs;
		if(aptxtObj.firstChild) 	aptxtObj.firstChild.nodeValue  = getRTime.ampm;
		if(yeartxtObj.firstChild) 	yeartxtObj.firstChild.nodeValue  = getRTime.years;
		if(monthtxtObj.firstChild) 	monthtxtObj.firstChild.nodeValue  = getRTime.months;
		if(daytxtObj.firstChild) 	daytxtObj.firstChild.nodeValue  = getRTime.days;
					
		
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
		
		totalChangeTheta = 0;
				
		if (mode === "hour") {
			stateDegrees = this.hoursToDegrees(mydate.getHours());
			numSlots = 12;
		}
		else if (mode === "minute") {
				stateDegrees = this.minutesToDegrees(mydate.getMinutes());
				numSlots = 60;
			}
			else if (mode === "second") {
					stateDegrees = this.minutesToDegrees(mydate.getSeconds());
					numSlots = 60;
				}
			else if (mode === "ampm") {
				stateDegrees = this.ampmToDegrees(mydate.getHours());
				numSlots = 2;
			}
			else if (mode === "year") {
				stateDegrees = 0;
				startValue = mydate.getFullYear();
				slotWidth = 30;
				numberOfSlots = 12;
				numSlots = 12;
			} 	
			else if (mode === "month") {
				stateDegrees = this.monthToDegrees(mydate.getMonth());
				numSlots = 12;
			}
			else if (mode === "day") {
				stateDegrees = 0;
				startValue = mydate.getDate() - 1;
				slotWidth = 30;
				numberOfSlots = 12;
				numSlots = 12;
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
				this.$.number0.setContent($L("0"));
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
				this.$.number0.setContent($L(""));
				this.$.number1.setContent($L(""));
				this.$.number2.setContent($L(""));
				this.$.number3.setContent($L("AM"));
				this.$.number4.setContent($L(""));
				this.$.number5.setContent($L(""));
				this.$.number6.setContent($L(""));
				this.$.number7.setContent($L(""));
				this.$.number8.setContent($L(""));
				this.$.number9.setContent($L("PM"));
				this.$.number10.setContent($L(""));
				this.$.number11.setContent($L(""));
			}  	else if (mode === "year") {
							this.$.number0.setContent($L(""));
							this.$.number1.setContent($L(""));
							this.$.number2.setContent($L(""));
							this.$.number3.setContent($L(""));
							this.$.number4.setContent($L(""));
							this.$.number5.setContent($L(""));
							this.$.number6.setContent($L(""));
							this.$.number7.setContent($L(""));
							this.$.number8.setContent($L(""));
							this.$.number9.setContent($L(""));
							this.$.number10.setContent($L(""));
							this.$.number11.setContent($L(""));
						} 	else if (mode === "month") {
							this.$.number0.setContent($L("Jan"));
							this.$.number1.setContent($L("Feb"));
							this.$.number2.setContent($L("Mar"));
							this.$.number3.setContent($L("Apr"));
							this.$.number4.setContent($L("May"));
							this.$.number5.setContent($L("Jun"));
							this.$.number6.setContent($L("Jul"));
							this.$.number7.setContent($L("Aug"));
							this.$.number8.setContent($L("Sep"));
							this.$.number9.setContent($L("Oct"));
							this.$.number10.setContent($L("Nov"));
							this.$.number11.setContent($L("Dec"));
						} 	else if (mode === "day") {
							this.$.number0.setContent("");
							this.$.number1.setContent($L(""));
							this.$.number2.setContent($L(""));
							this.$.number3.setContent($L(""));
							this.$.number4.setContent($L(""));
							this.$.number5.setContent($L(""));
							this.$.number6.setContent($L(""));
							this.$.number7.setContent($L(""));
							this.$.number8.setContent($L(""));
							this.$.number9.setContent($L(""));
							this.$.number10.setContent($L(""));
							this.$.number11.setContent($L(""));				
			}

			this.rotate(stateDegrees);	
	},
	
	myshow: function(elem, show, value) {
		elem = (elem + 12) % 12;
		
		var obj = this.getNobj(elem);
				
		if (show) val = "visible";
		else val = "hidden";
		obj.applyStyle("visibility", val);
		if (show) obj.setContent(value);
	},
	
	getNobj: function(num) {
		return (num >= 0 && num <= 11) ? this.$["number"+num] : undefined;
	},	
	
	updateState: function() {
		this.centerUnderline();	
		this.hideNumbers();								
	},	

	hoursToDegrees: function(hours) {
		hours = hours % 12;
		return (hours*30);	
	},
	
	monthToDegrees: function(month) {
		return (this.hoursToDegrees(month));
	},	
		
	minutesToDegrees: function (minutes) {
		return (minutes*6);	
	},
		
	ampmToDegrees: function (hours) {
		if (hours < 12) return (90);
		else return (270);
	},
		
	degreesToHours: function(degrees) {
		var hours, base;
			
		if (mydate.getHours() < 12) base = 0; else base = 12; 
		degrees = degrees % 360;
		hours = (Math.round(degrees/30)%12) + base;
		return (hours);
	},
	
	degreesToMonths: function(degrees) {
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
		if ( (degrees > 0) && (degrees < 180) ) hours = part;
		else hours = 12 + part;
		return (hours);
	},
	
	arrowClicked: function(inSender, inEvent) {
		if (mode === "month") {
			mode = "day";
		}
		else if (mode === "day") {
			mode = "year";
		}
		else if (mode === "year") {
			mode = "hour";
		}
		else if (mode === "hour") {
			mode = "minute";
		}
		else if (mode === "minute") {
			mode = "second";
		}
		else if (mode === "second") {
			mode = "ampm";
		}
		else {
			mode = "month";
		}
		this.updateState();	
	},
	
	backArrowClicked: function(inSender, inEvent) {
		if (mode === "ampm") {
			mode = "second";
		}
		else if (mode === "second") {
			mode = "minute";
		}
		else if (mode === "minute") {
			mode = "hour";
		}
		else {
			mode = "ampm";
		}
		this.updateState();	
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
				case 'testbed_monthtxt':
					mode="month";
					break;
				case 'testbed_daytxt':
					mode="day";
					break;
				case 'testbed_yeartxt':
					mode="year";
					break;
		}
		this.updateState();
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
	
	modeChange: function() {
		if (mode === "hour") {
			return (30);
		}	
		else if (mode === "minute") {
			return (6);
		}
		else if (mode === "second") {
			return (6);				
		}
		else if (mode === "ampm") {
			return (180);
		}
		else return (30);	
	},

	//Plus Clicked
	
	plusClicked: function(inSender, inEvent) {
		change = this.modeChange();
		this.defaultAnimate(currentRotation, currentRotation + change);
	},
	
	//Minus Clicked
	
	minusClicked: function(inSender, inEvent) {
		change = this.modeChange();
		this.defaultAnimate(currentRotation, currentRotation - change);
	},
	
	circleClicked: function(inSender, inEvent) {		
		var click, distance;
		
		click = this.adjustMouseCoordinates(inEvent);
		
		distance = this.distance(click, globalOrigin);
		if (distance < 65) return;
		
		theta = this.utilPointToDegree(click);
				
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
				
		dest = theta;
			
		this.defaultAnimate(currentRotation, dest);			
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
			
		this.defaultAnimate(currentRotation, newRotation);
	},
		
	ampmSnapToValue: function() {
		var newRotation, step, deg;
						
		deg = currentRotation;
			
		if (deg  <= 180) {
			newRotation = 90;
		}
		else newRotation = 270;		
			
		this.defaultAnimate(deg, newRotation);					
	},	
	
	
		ampmClick: function(degree) {
			var start, dest;
			
			//this.$.log.setContent("here " + degree);
			
			if (currentRotation == 90) {
				if (degree > 180) this.defaultAnimate(90, 270);
			} else if (currentRotation == 270) {
				if (degree <= 180) this.defaultAnimate(270, 90);	
			}			
		},	
		
			mydown: function(inSender, inEvent) {
					
				start = this.adjustMouseCoordinates(inEvent);
								
				
				if (this.inBounds(this.$.arrow.getBounds(), start)) return;
				//if (this.inBounds(this.$.backArrow.getBounds(), start)) return;
				//if (this.inBounds(this.$.plus.getBounds(), start)) return;
				//if (this.inBounds(this.$.minus.getBounds(), start)) return;
				if (this.inBounds(this.$.doneButton.getBounds(), start)) return;
				//if (this.inBounds(this.$.ball.getBounds(), start)) {
				if (true) {
					this.ballFlag = true;
				} else this.ballFlag = false;
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
				
				var diffy = initialTheta + moveTheta;
				
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
					ldif = ldif + cycle
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

				//		this.$.log.setContent("start: " + t1 + " stop: " + t2);

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

		dayToDegree : function (days) {
			return ((days - startValue) * slotWidth);
		},

		degreeToDay : function (degrees) {
			var nslots = 0;

			nslots = Math.round(degrees/slotWidth);

			numSlots = this.daysInMonth(mydate.getMonth(), mydate.getFullYear());

			return (this.cycle (nslots + startValue, numSlots) + 1);
		},

		daysInMonth: function(month,year) {
		    return new Date(year, month + 1, 0).getDate();
		},

		monthToDegree: function ( month) {
			return ((month - startValue) * slotWidth);
		},

		degreeToMonth: function ( degrees) {
			var nslots = 0;

			nslots = Math.round(degrees/slotWidth);	

			return (this.cycle(nslots + startValue, 12));
		},

		yearToDegree: function (year) {
			return ((year - startValue) * slotWidth);
		},

		degreeToYear: function(degrees) {
			var nslots = 0;

			nslots = Math.round(degrees/slotWidth);

			return (nslots + startValue);

		},		
		
		
});
