function Player () {}

Player.prototype.create = function ( x, y, playerGroup, bubbleGroup )
{
	this.health = 3;
	this.speed = 10;
	this.prevGridPos = new Phaser.Point(0, 0);
	this.gridPos = new Phaser.Point(0, 0);

	this.score = 0;
	this.harpoonCount = 10;
	this.killCount = 0;

	this.allowInput = true;

	this.sprite = playerGroup.create( x, y, 'player', 0 );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize( 10, 8, 3, 6 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	this.sprite.goalX = 0;
	this.sprite.goalY = 0;

	this.sprite.x = this.sprite.goalX + 8;
	this.sprite.y = this.sprite.goalY + 8;


	/* Bubble */

	this.bubble = bubbleGroup.create( x, y, 'bubble' );
	this.bubble.anchor.set( 0.5 );

	this.bubbleText = Global.game.add.bitmapText( 0, 0, 'TinyUnicode', "9", 16, bubbleGroup );
	this.bubbleText.anchor.x = Math.round(this.bubbleText.textWidth / 2) / this.bubbleText.textWidth;
	this.bubbleText.anchor.y = Math.round(this.bubbleText.textHeight / 2) / this.bubbleText.textHeight;
	this.bubbleText.tint = 0xFF0000;


	/* Harpoon */

	this.harpoon = bubbleGroup.create( x, y, 'harpoon' );
	this.harpoon.anchor.set( 0.5 );
	this.harpoon.kill();

	this.setupInput();
	this.setupAnimation();
};

Player.prototype.setupAnimation = function ()
{
	var len = 6;
	var idle = [0,1,2,3,4,5];
	this.sprite.animations.add( 'idle_up', idle, 8, true );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_right', idle, 8, true );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_left', idle, 8, true );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_down', idle, 8, true );

	this.state = 'idle';
	this.direction = 'right';
	this.sprite.animations.play( 'idle_right' );


	var len = 6;
	var fire = [0,1,2,3,4];
	this.harpoon.animations.add( 'fire_up', fire, 8, true );
	fire = fire.map( n => n + len );
	this.harpoon.animations.add( 'fire_right', fire, 8, true );
	fire = fire.map( n => n + len );
	this.harpoon.animations.add( 'fire_left', fire, 8, true );
	fire = fire.map( n => n + len );
	this.harpoon.animations.add( 'fire_down', fire, 8, true );
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	if ( this.damageState == 'dead' )
		return;

	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};

Player.prototype.setupInput = function ()
{
	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );

	this.input = { "up": {}, "left": {}, "down": {}, "right": {}, "space": {} };
	this.resetInput();
};

Player.prototype.handleInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = this.input[key].isDown;
	}

	this.input.up.isDown = this.keys.up.isDown || this.keys.w.isDown;
	this.input.left.isDown = this.keys.left.isDown || this.keys.a.isDown;
	this.input.down.isDown = this.keys.down.isDown || this.keys.s.isDown;
	this.input.right.isDown = this.keys.right.isDown || this.keys.d.isDown;
	this.input.space.isDown = this.keys.space.isDown;

	for (var key in this.input) {
		this.input[key].justDown = ( this.input[key].isDown && !this.input[key].wasDown );
		this.input[key].holdTimer = this.input[key].isDown ? this.input[key].holdTimer + 1 : 0;
	}
};

Player.prototype.resetInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = true;
		this.input[key].isDown = true;
		this.input[key].justDown = false;
		this.input[key].holdTimer = 0;
	}

	Global.game.input.reset();
};

Player.prototype.update = function ()
{
	var gridX = Math.round( ( this.sprite.goalX ) / 16 );
	var gridY = Math.round( ( this.sprite.goalY ) / 16 );
	var dx = (this.direction == 'right') - (this.direction == 'left');
	var dy = (this.direction == 'down') - (this.direction == 'up');

	/* Walking input */

	this.handleInput();

	var inputDir = new Phaser.Point( 0, 0 );
	if ( this.allowInput )
	{
		if ( this.input.up.justDown )
			inputDir.y -= 1;
		else if ( this.input.down.justDown )
			inputDir.y += 1;
		else if ( this.input.left.justDown )
			inputDir.x -= 1;
		else if ( this.input.right.justDown )
			inputDir.x += 1;
	}

	var direction = this.direction;
	if ( inputDir.getMagnitude() > 0 ) {
		if ( Math.abs( inputDir.x ) >= Math.abs( inputDir.y ) )
			direction = inputDir.x > 0 ? 'right' : 'left';
		else
			direction = inputDir.y > 0 ? 'down' : 'up';

		this.setAnimation( 'idle', direction );
	}

	var obstacle = ( Global.World.checkCloudAt( gridX + dx, gridY + dy ) ||
					 Global.World.checkEnemyAt( gridX + dx, gridY + dy ) );

	if ( this.allowInput && this.input[this.direction].holdTimer == 3+6*obstacle ) {
		this.input[this.direction].holdTimer -= 24;

		if ( !Global.World.checkLandAt( gridX + dx, gridY + dy ) ) {
			if ( !Global.World.checkEnemyAt( gridX + dx, gridY + dy ) ) {
				this.sprite.goalX += dx * 16;
				this.sprite.goalY += dy * 16;
				Global.Audio.play( 'boxPush' );
				this.updateCount();
			}
			else
			{
				this.damage();
			}
			Global.World.revealTile( gridX + dx, gridY + dy );
		}
	}


	var fac = 1 - Math.pow( 0.8, Global.game.time.elapsed * 0.06 );
	this.sprite.x += ( this.sprite.goalX + 8 - this.sprite.x ) * fac;
	this.sprite.y += ( this.sprite.goalY + 8 - this.sprite.y ) * fac;

	this.sprite.anchor.y = 0.5 - this.input[this.direction].isDown / 32;


	/* Bubble */

	this.bubble.x = this.sprite.x + 9;
	this.bubble.y = this.sprite.y - 12;

	this.bubbleText.x = this.sprite.x + 11;
	this.bubbleText.y = this.sprite.y - 13;


	/* Harpoon */

	if ( this.allowInput ) {
		if ( this.input.space.justDown && !this.harpoon.exists && this.harpoonCount > 0 ) {

			this.fireHarpoon();
			this.harpoon.x = this.sprite.x;
			this.harpoon.y = this.sprite.y;

			Global.Audio.play( 'swing' );

			this.allowInput = false;
			Global.game.time.events.add( Phaser.Timer.SECOND * 1 / 16, function() {

				var dx = (this.direction == 'right') - (this.direction == 'left');
				var dy = (this.direction == 'down') - (this.direction == 'up');
				Global.World.revealTile( gridX+dx, gridY+dy );

			}, this );

			Global.game.time.events.add( Phaser.Timer.SECOND * 5 / 16, function() {

				function reviveInput( success ) {
					if ( success ) {
						this.awardScore( 5 );
						this.killCount += 1;
						if ( this.killCount % 10 == 0 ) {
							Global.Audio.play( 'spikes' );
							this.updateAmmoCount( +1 );
						}
					}
					else
						this.updateAmmoCount( -1 );

					this.updateCount();
					this.resetInput();

					if ( this.damageState != 'dead' )
						this.allowInput = true;
				}

				var dx = (this.direction == 'right') - (this.direction == 'left');
				var dy = (this.direction == 'down') - (this.direction == 'up');
				Global.World.attackTile( gridX+dx, gridY+dy, reviveInput.bind(this) );
				Global.World.revealTile( gridX+dx, gridY+dy );

			}, this );
		}
	}
};


Player.prototype.fireHarpoon = function ()
{
	this.harpoon.reset();

	var name = '{0}_{1}'.format( 'fire', this.direction );
	this.harpoon.animations.play( name, 16, false, true );
};

Player.prototype.updateAmmoCount = function ( rel )
{
	if (rel) {
		this.harpoonCount += rel;
		this.harpoonCount = this.harpoonCount.clamp(0, 10);

		if ( this.harpoonCount <= 0 ) {
			this.defeat();

			// Move please
			Global.Audio.play( 'chop' );
			Global.World.cameraShake( 15 );
		}
	}

	Global.Gui.ammoCount.setText( this.harpoonCount );
	Global.Gui.ammoCount.tint = ( this.harpoonCount > 1 ) ? 0xFFFFFF : 0xFF0000;
	Global.Gui.ammoCount.alpha = 0;
	Global.game.add.tween( Global.Gui.ammoCount ).to({ alpha: 1.0 }, 500, Phaser.Easing.Linear.In, true );
};

Player.prototype.updateCount = function ()
{
	var gridX = Math.round( ( this.sprite.goalX ) / 16 );
	var gridY = Math.round( ( this.sprite.goalY ) / 16 );

	var count = Global.World.checkEnemyCount( gridX, gridY );

	this.bubbleText.setText( count.toString() );
	this.bubbleText.anchor.x = Math.round(this.bubbleText.textWidth / 2) / this.bubbleText.textWidth;
	this.bubbleText.anchor.y = Math.round(this.bubbleText.textHeight / 2) / this.bubbleText.textHeight;
};

Player.prototype.awardScore = function ( rel )
{
	if (rel) {
		this.score += rel;
	}

	var highscore = readCookie( "highscore" ) || 0;
	if ( this.score > highscore ) {
		highscore = this.score;
		createCookie( "highscore", highscore, 3650 );
		Global.Gui.highscoreCount.tint = 0xFFFF00;
	}

	Global.Gui.scoreCount.setText( "Score: " + addDots( this.score ) );
	Global.Gui.highscoreCount.setText( "Highscore: " + addDots( highscore ) );
};



Player.prototype.damage = function ()
{
	this.allowInput = false;

	this.health -= 1;
	if ( this.health >= 0 )
		Global.Gui.lifePoint[this.health].tint = 0x444444;


	this.damageTimer = 0;

	// Move please
	Global.Audio.play( 'chop' );
	Global.World.cameraShake( 15 );


	if ( this.health <= 0 )
	{
		this.defeat();
	}
	else
	{
		this.hurt();
	}
};

Player.prototype.hurt = function ()
{
	this.damageState = 'hurt';
	this.setAnimation( 'hurt', this.direction );

	Global.game.time.events.add( Phaser.Timer.SECOND * 0.5, this.damageOver, this );

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}
};

Player.prototype.defeat = function ()
{
	this.allowInput = false;

	this.setAnimation( 'hurt', this.direction );
	this.damageState = 'dead';
	Global.World.cameraShake( 16 );
	Global.cinematic = true;

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}

	Global.game.time.events.add( Phaser.Timer.SECOND * 1.0, this.gameOver, this );
};

Player.prototype.damageStep = function ()
{
	if ( this.damageState == 'hurt' || this.damageState == 'dead' )
	{
		this.sprite.alpha = 1.5 - this.sprite.alpha; // Toggles between 1 and 0.5
		this.sprite.tint = this.sprite.alpha == 1.0 ? 0xff7777 : 0xffffff;

		Global.game.time.events.add( Phaser.Timer.SECOND * 0.05, this.damageStep, this );
	}
	else
	{
		this.damageStepActive = false;
	}
};

Player.prototype.damageOver = function ()
{
	this.damageState = 'idle';
	this.sprite.alpha = 1.0;
	this.sprite.tint = 0xffffff;

	this.allowInput = true;
	this.resetInput();
};

Player.prototype.gameOver = function ()
{
	this.bubble.kill();
	this.bubbleText.kill();
	Global.Audio.play( 'death' );

	Global.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill();

	Global.game.time.events.add( Phaser.Timer.SECOND * 1.0, function() {Global.Gui.showGameOver();}, this );
};
