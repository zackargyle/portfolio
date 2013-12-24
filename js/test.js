// A canvas free version

var Platformer = (function() {
	var JUMPING_HEIGHT = -4.2, START_FALL = 0,
		LEFT = 37, RIGHT = 39, UP = 38,
		MOVING_DISTANCE = 400;
	var sprite = {}, keysDown = {}, 
		gamePieces = [], movingBlocks = [], border = {},
		container;

	var gravity = 0.1, velY = 0, 
		speed = 2, blockSpeed = 1;

	var Sprite = function(imageLeft, imageRight, imageJumping) {
		this.element = document.getElementById(imageRight);
		this.imageLeft = imageLeft;
		this.imageRight = imageRight;
		this.imageJumping = imageJumping;
		this.height = this.element.height;
		this.width = this.element.width;
		this.x = this.element.offsetLeft;
		this.y = this.element.offsetTop - 1;
		this.movingRight = true;
		this.jumping = false;
	}

	var setupGame = function(containerId, collisionId) {
		container = document.getElementById(containerId);

		// Register game pieces
		gamePieces = [];
		var elements = document.getElementsByClassName(collisionId);

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			// Register game pieces
			gamePieces.push({
				moves: element.hasAttribute('move'),
				left: element.offsetLeft - sprite.width,
				top: element.offsetTop - sprite.height,
				right: element.offsetLeft + element.offsetWidth,
				bottom: element.offsetTop + element.offsetHeight
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
			left: container.offsetLeft,
			top: container.offsetTop + container.offsetHeight - sprite.height,
			right: container.offsetLeft + container.offsetWidth - sprite.width,
			bottom: container.offsetTop + container.offsetHeight - sprite.height + 10
		});

		// Add left and right borders
		border = {
			left: container.offsetLeft,
			right: container.offsetLeft + container.offsetWidth - sprite.width
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
				gamePiece.left = element.offsetLeft - sprite.width;
				gamePiece.right = element.offsetLeft + element.offsetWidth;
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
					if (velY >= 0) { // Land on object
						sprite.y = gamePiece.top;
						sprite.jumping = false;
					} else { // Hit head on gamePiece
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

	var resetSpriteImages = function(which) {
		document.getElementById(sprite.imageJumping).style.display = 'none';
		document.getElementById(sprite.imageRight).style.display = 'none';
		document.getElementById(sprite.imageLeft).style.display = 'none';
		if (which == 'jump') {
			document.getElementById(sprite.imageJumping).style.display = 'block';
		} else if (which == 'right') {
			document.getElementById(sprite.imageRight).style.display = 'block';
		} else {
			document.getElementById(sprite.imageLeft).style.display = 'block';
		}
	}

	// The main game loop
	var main = function () {

		handleKeydown();
		handleJump();
		handleMovingPieces();

		if (sprite.jumping) {
			if (sprite.element.id != sprite.imageJumping){
				sprite.element = document.getElementById(sprite.imageJumping);
				resetSpriteImages('jump');
			}
		} else if (sprite.movingRight) {
			if (sprite.element.id != sprite.imageRight) {
				sprite.element = document.getElementById(sprite.imageRight);
				resetSpriteImages('right');
			}
		} else if (sprite.element.id != sprite.imageLeft) {
			sprite.element = document.getElementById(sprite.imageLeft);
			resetSpriteImages('left');
		}

		if (sprite.element.offsetLeft != sprite.x) {
			sprite.element.style.left = sprite.x + "px";
		}
		if (sprite.element.offsetTop != sprite.y) {
			sprite.element.style.top = sprite.y + "px";
		}

	};
	
	return {
		setupSprite: function(imageLeft, imageRight, imageJumping) { 
			sprite = new Sprite(imageLeft, imageRight, imageJumping);
		},
		setupGame: function(containerId, collisionId) { 
			if (sprite) {
				setupGame(containerId, collisionId);
			} else {
				console.log("Must register Sprite before Canvas.");
			}
		},
		start: function() { 
			addEventListener("keydown", function (e) {
				keysDown[e.keyCode] = true;
			}, false);

			addEventListener("keyup", function (e) {
				delete keysDown[e.keyCode];
			}, false);

			if (container && sprite) {
				setInterval(main, 1);
			} else {
				console.log("Must register both Sprite and Canvas with Platformer.");
			}
		}
	};

})();
