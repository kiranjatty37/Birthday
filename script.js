window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   || 
		//window.webkitRequestAnimationFrame || 
		//window.mozRequestAnimationFrame    || 
		//window.oRequestAnimationFrame      || 
		//window.msRequestAnimationFrame     || 
		function( callback ){
			window.setTimeout(callback);
		};
})();

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
    keyword = "HAPPY BIRTHDAY SUNNY",
		imageData,
		density = 10,
		mouse = {},
		hovered = false,
		colors = ["236, 252, 17", "233, 150, 15","10, 230, 255","254, 230, 211","255, 0, 0","20, 255, 10"],
		minDist = 30,
		bounceFactor = 1;
var img = document.getElementById('source');
var image=[];
for(var i=0; i<6; i++)
    image[i] = document.getElementById("source"+(i+1));

var W = window.outerWidth,
    H = window.outerHeight;

canvas.width = W;
canvas.height = H;

console.log(W+" "+H);

document.addEventListener("mousemove", function(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}, false);

// Particle Object
var Particle = function() {
	this.w =  Math.random()*10.5;
	this.h =  Math.random()*10.5;
	this.x = -W;
	this.y = -H;
	this.free = false;
	
	this.vy = -5 + parseInt(Math.random() * 10) / 2;
	this.vx = -4 + parseInt(Math.random() * 8);
	
	// Color
	this.a = Math.random();
	this.color = colors[parseInt(Math.random()*colors.length)];
	
	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	};
	
	this.draw = function() {
		ctx.fillStyle = "rgba("+this.color+","+this.a+")";
        //ctx.globalAlpha=1;
        //var i = parseInt(Math.random()*10)%5;
        /*var imgd = ctx.getImageData(0, 0, W, W);
        for (i = 0; i < imgData.data.length; i += 4) {
        imgd.data[i] = 255 - imgd.data[i];
        imgd.data[i+1] = 255 - imgd.data[i+1];
        imgd.data[i+2] = 255 - imgd.data[i+2];
        imgd.data[i+3] = 255;
    }*/
    //ctx.putImageData(imgData, 0, 0);
		//ctx.drawImage(img, this.x, this.y,  this.w,  this.h);
        ctx.fillStyle = "rgba("+this.color+","+this.a+")";
		ctx.fillRect(this.x, this.y,  this.w,  this.h);
        //console.log(this.w);
	}
};

var particles = [];

// Draw the text
function drawText() {
	ctx.clearRect(0, 0, W, H);
    //ctx.drawImage(img, 500, 80,  400, 400);
    ctx.fillStyle = "#8800ff";
	ctx.font = "100px 'Arial', sans-serif";
	ctx.textAlign = "center";
	ctx.fillText(keyword, W/2, H/8);
}

// Clear the canvas
function clear() {
	ctx.clearRect(0, 0, W, H);
}

// Get pixel positions
function positionParticles() {
	// Get the data
	imageData = ctx.getImageData(0, 0, 1440, 1440);
	var data = imageData.data;
    
    //console.log(imageData.height);
    //console.log(imageData.width);
	
	// Iterate each row and column
	for (var i = 0; i < imageData.height; i += density) {
		for (var j = 0; j < imageData.width/2.5; j += density) {
			
			// Get the color of the pixel
			var color = data[((j * ( imageData.width * 4)) + (i * 4)) - 1];
			//console.log(((j * ( imageData.width * 4)) + (i * 4)) - 1);
            //console.log(color);
        
			// If the color is not black, draw pixels
			if (color !== 0) {
				particles.push(new Particle());
				particles[particles.length - 1].setPosition(i, j);
			}
		}
	}
}

drawText();
positionParticles();


// Update
function update() {
	clear();
	//ctx.fillStyle = "#ffffff";
	//ctx.font = "100px 'Arial', sans-serif";
	//ctx.textAlign = "center";
	//ctx.fillText(keyword, W/2, 4*H/5);
    
	for(i = 0; i < particles.length; i++) {
		var p = particles[i];
		
		if(mouse.x > p.x && mouse.x < p.x + p.w && mouse.y > p.y && mouse.y < p.y + p.h) 
			hovered = true;
		
		if(hovered == true) {
			
			var dist = Math.sqrt((p.x - mouse.x)*(p.x - mouse.x) + (p.y - mouse.y)*(p.y - mouse.y));
			
			if(dist <= minDist)
				p.free = true;
			
			if(p.free == true) {
				p.y += p.vy;
				p.vy += 0.1;
				p.x += p.vx;
				
				// Collision Detection
				if(p.y + p.h > H) {
					p.y = H -  p.h;
					//p.vy *= -bounceFactor;
					
					// Friction applied when on the floor
					if(p.vx > 0)
						p.vx -= 0.1;
					else 
						p.vx += 0.1;
				}
				
				if(p.x + p.w > W) {
					p.x = W - p.w;
					//p.vx *= -bounceFactor;
				}
				
				if(p.x < 0) {
					p.x = 0;
					p.vx *= -0.5;
				}
			}
		}
		
		ctx.globalCompositeOperation = "lighter";
		p.draw();
	}
}


(function animloop(){
    //sleep(1);
	requestAnimFrame(animloop);
	update();
    //requestAnimFrame(animloop);
})();
