
// Constructor
function Player ()
{
	this.health = 3;
	this.speed = 10;
	this.prevGridPos = new Phaser.Point(0, 0);
	this.gridPos = new Phaser.Point(0, 0);

	this.harpoonCount = 10;

	this.allowInput = true;
}

Player.prototype.create = function ( x, y, group )
{
	this.sprite = group.create( x, y, 'player', 0 );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize( 10, 8, 3, 6 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	this.sprite.goalX = 0;
	this.sprite.goalY = 0;

	this.sprite.x = this.sprite.goalX + 8;
	this.sprite.y = this.sprite.goalY + 8;


	/* Bubble */

	this.bubble = Global.Gui.group.create( x, y, 'bubble' );
	this.bubble.anchor.set( 0.5 );


	/* Harpoon */

	this.harpoon = Global.Gui.group.create( x, y, 'harpoon' );
	this.harpoon.anchor.set( 0.5 );
	this.harpoon.kill();


	/* Input */

	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );


	this.setupAnimation();
};

Player.prototype.createBubble = function() {
	this.bubbleText = Global.game.add.bitmapText( 0, 0, 'TinyUnicode', "9", 16 );
	this.bubbleText.anchor.x = Math.round(this.bubbleText.textWidth / 2) / this.bubbleText.textWidth;
	this.bubbleText.anchor.y = Math.round(this.bubbleText.textHeight / 2) / this.bubbleText.textHeight;
	this.updateCount();
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

Player.prototype.update = function ()
{
	var gridX = Math.round( ( this.sprite.goalX ) / 16 );
	var gridY = Math.round( ( this.sprite.goalY ) / 16 );


	/* Walking input */

	var inputDir = new Phaser.Point( 0, 0 );
	if ( this.allowInput )
	{
		if ( this.keys.up.justDown || this.keys.w.justDown )
			inputDir.y -= 1;
		else if ( this.keys.down.justDown || this.keys.s.justDown )
			inputDir.y += 1;
		else if ( this.keys.left.justDown || this.keys.a.justDown )
			inputDir.x -= 1;
		else if ( this.keys.right.justDown || this.keys.d.justDown )
			inputDir.x += 1;
	}

	var direction = this.direction;
	if ( inputDir.getMagnitude() > 0 ) {
		if ( Math.abs( inputDir.x ) >= Math.abs( inputDir.y ) )
			direction = inputDir.x > 0 ? 'right' : 'left';
		else
			direction = inputDir.y > 0 ? 'down' : 'up';

		var facingForward = (this.direction == direction);
		this.setAnimation( 'idle', direction );

		if ( facingForward ) {
			if ( !Global.World.checkLandAt( gridX + inputDir.x, gridY + inputDir.y ) ) {
				if ( !Global.World.checkEnemyAt( gridX + inputDir.x, gridY + inputDir.y ) ) {
					this.sprite.goalX += inputDir.x * 16;
					this.sprite.goalY += inputDir.y * 16;
					Global.Audio.play( 'boxPush' );
					this.updateCount();
				}
				else
				{
					this.damage();
				}
				Global.World.revealTile( gridX + inputDir.x, gridY + inputDir.y );
			}
		}
	}

	var fac = 1 - Math.pow( 0.8, Global.game.time.elapsed * 0.06 );
	this.sprite.x += ( this.sprite.goalX + 8 - this.sprite.x ) * fac;
	this.sprite.y += ( this.sprite.goalY + 8 - this.sprite.y ) * fac;


	/* Bobbing */

	var bob = 0; //Math.sin( Global.game.time.totalElapsedSeconds() * Math.PI ) > 0;
	//this.sprite.anchor.y = 0.29 + bob/32;


	/* Bubble */

	this.bubble.x = this.sprite.x + 9;
	this.bubble.y = this.sprite.y - 12 - bob;

	this.bubbleText.x = this.sprite.x + 11;
	this.bubbleText.y = this.sprite.y - 13 - bob;

	this.bubbleText.tint = 0xFF0000;


	/* Harpoon */

	if ( this.allowInput ) {
		if ( this.keys.space.justDown && !this.harpoon.exists ) {

			this.fireHarpoon();
			this.harpoon.x = this.sprite.x;
			this.harpoon.y = this.sprite.y;

			Global.Audio.play( 'swing' );

			this.allowInput = false;
			Global.game.time.events.add( Phaser.Timer.SECOND * 2 / 16, function() {

				var dx = (this.direction == 'right') - (this.direction == 'left');
				var dy = (this.direction == 'down') - (this.direction == 'up');
				Global.World.revealTile( gridX+dx, gridY+dy );

			}, this );

			Global.game.time.events.add( Phaser.Timer.SECOND * 5 / 16, function() {

				function reviveInput() {
					this.allowInput = true;
					Global.game.input.reset();
				}

				var dx = (this.direction == 'right') - (this.direction == 'left');
				var dy = (this.direction == 'down') - (this.direction == 'up');
				Global.World.attackTile( gridX+dx, gridY+dy, reviveInput.bind(this) );
				Global.World.revealTile( gridX+dx, gridY+dy );
				this.updateCount();

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

Player.prototype.updateCount = function ()
{
	var gridX = Math.round( ( this.sprite.goalX ) / 16 );
	var gridY = Math.round( ( this.sprite.goalY ) / 16 );

	var count = 0;
	for ( var dx = -1; dx < 2; dx++ ) {
		for ( var dy = -1; dy < 2; dy++ ) {
			if ( Global.World.checkEnemyAt( gridX + dx, gridY + dy ) ) {
				count += 1;
			}
		}
	}

	this.bubbleText.setText(count.toString());
	this.bubbleText.anchor.x = Math.round(this.bubbleText.textWidth / 2) / this.bubbleText.textWidth;
	this.bubbleText.anchor.y = Math.round(this.bubbleText.textHeight / 2) / this.bubbleText.textHeight;
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

	Global.game.time.events.add( Phaser.Timer.SECOND * 0.3, this.damageOver, this );

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}
};

Player.prototype.defeat = function ()
{
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
	Global.game.input.reset();
};

Player.prototype.gameOver = function ()
{
	this.bubble.kill();
	Global.Audio.play( 'death' );

	Global.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill();

	Global.game.time.events.add( Phaser.Timer.SECOND * 1.0, function() {Global.Gui.showGameOver();}, this );
};
