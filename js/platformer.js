var Platformer = (function() {
	var JUMPING_HEIGHT = -4.2, START_FALL = 0,
		LEFT = 37, RIGHT = 39, UP = 38,
		MOVING_DISTANCE = 250;

	var sprite = {}, keysDown = {}, 
		gamePieces = [], movingBlocks = [], border = {},
		canvas, ctx;

	var gravity = 0.1, velY = 0, 
		speed = 2, blockSpeed = 1;

	var Sprite = function(startX, startY, imageLeft, imageRight, imageJumping) {
		this.height = 61;
		this.width = 70;
		this.x = startX;
		this.y = startY;
		this.movingRight = true;
		this.jumping = false;

		this.image_left = imageLeft;
		this.image_right = imageRight;
		this.image_jumping = imageJumping;
	}

	var setupCanvas = function(canvasId, collisionClass) {
		canvas = document.getElementById(canvasId);
		ctx = canvas.getContext('2d');

		// Register game pieces
		gamePieces = [];
		elements = document.getElementsByClassName(collisionClass);

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			// Register game pieces
			gamePieces.push({
				moves: element.hasAttribute('move'),
				left: element.offsetLeft - canvas.offsetLeft - sprite.width,
				top: element.offsetTop - canvas.offsetTop - sprite.height,
				right: element.offsetLeft - canvas.offsetLeft + element.offsetWidth,
				bottom: element.offsetTop - canvas.offsetTop + element.offsetHeight
			});

			// Register moving elements
			if (element.hasAttribute('move')) {
				movingBlocks.push({
					id: element.id,
					delta: 0,
					right: true,
					index: gamePieces.length - 1
				});
			}
		}

		// Add Bottom, less complicated for jumping/ledges
		gamePieces.push({
			left: 0,
			top: canvas.height - sprite.height,
			right: canvas.width - sprite.width,
			bottom: canvas.height - sprite.height + 10
		});

		// Add left and right borders
		border = {
			left: 0,
			right: canvas.width - sprite.width
		}

	};

	var standingOn = function(gamePiece) {
		if (sprite.x >= gamePiece.left &&
			sprite.x <= gamePiece.right &&
			sprite.y === gamePiece.top) {
			return true;
		}
		else return false;
	};

	var collisionWith = function(element, x, y) {
		if (x > element.left && x < element.right &&
			y > element.top && y < element.bottom) {
			return true;
		}
		return false;
	};

	var handleMovingPieces = function() {
		for (var i = 0; i < movingBlocks.length; i++) {
			var block = movingBlocks[i];
			var element = document.getElementById(block.id);

			// Change Direction
			if (block.delta === MOVING_DISTANCE) {
				block.right = !block.right;
				block.delta = 0;
			} else {
				var gamePiece = gamePieces[block.index];

				// Update element position
				if (block.right) {
					element.style.left = element.offsetLeft + blockSpeed + "px";
				} else {
					element.style.left = element.offsetLeft - blockSpeed + "px";
				}

				// Update gamepiece positions
				gamePiece.left = element.offsetLeft - canvas.offsetLeft - sprite.width;
				gamePiece.right = element.offsetLeft - canvas.offsetLeft + element.offsetWidth;
				block.delta += 1;

				// Update sprite
				if (standingOn(gamePiece) || collisionWith(gamePiece, sprite.x, sprite.y)) {
					if (block.right) {
						sprite.x += blockSpeed;
					} else {
						sprite.x -= blockSpeed;
					}
				}
			}
		}
	}

	var handleJump = function() {
		if (sprite.jumping) {
			velY += gravity;

			var tempY = sprite.y + velY;

			// Check for collisions
			for (var i = 0; i < gamePieces.length; i++) {
				var gamePiece = gamePieces[i];

				if (collisionWith(gamePiece, sprite.x, tempY)) {
					// Falling or rising?
					if (velY >= 0) {
					 	// Land on object
						sprite.y = gamePiece.top;
						sprite.jumping = false;
					} else {
						// Hit head on gamePiece
						velY = START_FALL;
					}
					return;
				}
			}
			sprite.y = tempY;
		}
	};

	var handleKeydown = function() {
		// Jump
		if (keysDown[UP]) {
			if(!sprite.jumping) {
       			sprite.jumping = true;
	       		velY = JUMPING_HEIGHT;
	      	}
		}
		// Move Left or Right
		if (keysDown[LEFT] || keysDown[RIGHT]) {

			var tempX = sprite.x;

			if (keysDown[LEFT]) {
				sprite.movingRight = false;
				tempX -= speed;
			} else {
				sprite.movingRight = true;
				tempX += speed;
			}

			// Check for collisions and ledges
			for (var i = 0; i < gamePieces.length; i++) {
				var gamePiece = gamePieces[i];

				// Stepped off ledge
				if (tempX > gamePiece.left && tempX < gamePiece.right &&
				    sprite.y < gamePiece.top && sprite.jumping == false) {
					/*** Make more robust ***/
					sprite.jumping = true;
					velY = START_FALL;
				}

				// Collision
				if (collisionWith(gamePiece, tempX, sprite.y)) {
					return;
				}
			}

			// Keep within bounds
			if (tempX > border.left && tempX < border.right) {
				sprite.x = tempX;
			}
		}
	};

	// The main game loop
	var main = function () {
		// Reset canvas
		canvas.width = canvas.width;	

		handleKeydown();
		handleJump();
		handleMovingPieces();

		if (sprite.jumping) {
			ctx.drawImage(sprite.image_jumping, sprite.x, sprite.y);
		} else if (sprite.movingRight) {
			ctx.drawImage(sprite.image_right, sprite.x, sprite.y);
		} else {
			ctx.drawImage(sprite.image_left, sprite.x, sprite.y);
		}

	};
	
	return {
		setupSprite: function(startX, startY, imageLeft, imageRight, imageJumping) { 
			sprite = new Sprite(startX, startY, imageLeft, imageRight, imageJumping);
		},
		setupCanvas: function(canvasId, collisionClass) { 
			if (sprite) {
				setupCanvas(canvasId, collisionClass);
			} else {
				console.log("Must register Sprite before Canvas.");
			}
		},
		start: function() { 

			addEventListener("keydown", function (e) {
				if ([LEFT,RIGHT,UP].indexOf(e.keyCode) != -1) e.preventDefault();
				keysDown[e.keyCode] = true;
			}, false);

			addEventListener("keyup", function (e) {
				delete keysDown[e.keyCode];
			}, false);

			if (canvas && sprite) {
				setInterval(main, 1);
			} else {
				console.log("Must register both Sprite and Canvas with Platformer.");
			}
		}
	};

})();


(function() {
  var canvas = document.getElementById("game-canvas");
  canvas.height = 400;
  canvas.width = 1210;
  canvas.style.top = document.getElementById("game-start").offsetTop + 50;
  canvas.style.left = (window.innerWidth - 1220) / 2;

  var startTop = parseInt(canvas.style.top) + 352;
  var startLeft = 250;

  var blocks = document.getElementsByClassName("game-block");
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.left = startLeft + (i * 140) + "px";
    blocks[i].style.top = startTop - (i * 75) + "px";
  }

  var cliff = document.getElementById("game-cliff");
  cliff.style.top = startTop - 250 + "px";
  cliff.style.left = (window.innerWidth - 1220) / 2 + 890 + "px";
  cliff.style.width = "325px";
  cliff.style.height = "303px";
})();
