
// Constructor
function World ()
{
	this.Player = new Player();
}


World.prototype.create = function ()
{
	Global.game.world.setBounds( -Infinity, -Infinity, Infinity, Infinity );

	this.oceanBg = Global.game.add.tileSprite( -16, -16, (ROOM_WIDTH+2) * 16, (ROOM_HEIGHT+2) * 16, 'tileset', posToIndex( 'tileset', Tiles.Water.pos) );
	//this.gridBg = Global.game.add.tileSprite( 0, 0, ROOM_WIDTH * 16, ROOM_HEIGHT * 16, 'tileset', posToIndex( 'tileset', [0,6] ) );
	//this.gridBg.alpha = 0.08;

	this.entities = Global.game.add.group();

	this.Player.create(
		0,
		0,
		this.entities
	);

	this.landManager = new LandManager();
	this.enemyManager = new EnemyManager();
	this.cloudManager = new CloudManager();

	this.camGoal = new Phaser.Point();
	this.camGoal.x = 0;
	this.camGoal.y = 0;
	this.camPos = new Phaser.Point();
	this.camPos.x = this.camGoal.x;
	this.camPos.y = this.camGoal.y;
	this.prevCamPos = new Phaser.Point();
	this.prevCamPos.x = this.camGoal.x;
	this.prevCamPos.y = this.camGoal.y;
	Global.game.camera.x = this.camGoal.x;
	Global.game.camera.y = this.camGoal.y;

	Global.game.world.bringToTop( this.landManager.group );
	Global.game.world.bringToTop( this.enemyManager.group );
	Global.game.world.bringToTop( this.entities );
	Global.game.world.bringToTop( Global.Light.lightGroup );
	Global.game.world.bringToTop( this.cloudManager.group );
	Global.game.world.bringToTop( Global.Gui.group );

	Global.game.camera.y = Math.round( this.camPos.y );
	this.shake = 0;
	this.prevShakeDir = [0,0];

	Global.game.camera.x = Math.round( this.camPos.x );

	this.landManager.loadArea( this.camGoal.x, this.camGoal.y );
	this.enemyManager.loadArea( this.camGoal.x, this.camGoal.y );
	this.cloudManager.loadArea( this.camGoal.x, this.camGoal.y );

	this.Player.createBubble();
};

World.prototype.update = function ()
{
	this.Player.update();

	this.entities.sort( 'y', Phaser.Group.SORT_ASCENDING );


	/* Camera */

	//var fac = 1 - Math.pow( 0.75, Global.game.time.elapsed * 0.06 );
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ) * fac;
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ) * fac;

	this.camPos.x = this.Player.sprite.position.x - SCREEN_WIDTH/2;
	this.camPos.y = this.Player.sprite.position.y - SCREEN_HEIGHT/2;

	var d = this.camPos.distance( this.camGoal );
	if ( d < 1 && d != 0 )
	{
		this.camPos.x = this.camGoal.x;
		this.camPos.y = this.camGoal.y;
	}
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ).clamp(-2,2);
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ).clamp(-2,2);

	Global.game.camera.x = Math.round( this.camPos.x );
	Global.game.camera.y = Math.round( this.camPos.y );

	if (!this.prevCamPos.equals(this.camPos)) {
		this.landManager.loadArea( this.camGoal.x, this.camGoal.y );
		this.enemyManager.loadArea( this.camGoal.x, this.camGoal.y );
		this.cloudManager.loadArea( this.camGoal.x, this.camGoal.y );
	}

	this.prevCamPos.x = this.camPos.x;
	this.prevCamPos.y = this.camPos.y;


	this.oceanBg.x = 16 * Math.round(this.camPos.x / 16) - 16;
	this.oceanBg.y = 16 * Math.round(this.camPos.y / 16) - 16;
	this.oceanBg.x += 1.1 * Math.sin( 0.7 * Global.game.time.totalElapsedSeconds() * Math.PI );


	if ( this.shake > 0 )
	{
		do
		{
			var dir = Math.random() * 2 * Math.PI;
			var sx = Math.round( Math.sin(dir) * Math.ceil( this.shake/4 ) );
			var sy = Math.round( Math.cos(dir) * Math.ceil( this.shake/4 ) );
		}
		while ( this.prevShakeDir[0] == sx && this.prevShakeDir[1] == sy )
		this.prevShakeDir = [sx, sy];

		Global.game.camera.x += sx;
		Global.game.camera.y += sy;

		this.shake -= 1;
	}
};

World.prototype.pause = function ( isPaused )
{
	this.Player.sprite.animations.paused = isPaused;
}


World.prototype.checkLandAt = function ( x, y )
{
	return this.landManager.checkLandAt( x, y );
};

World.prototype.checkLandNearby = function ( x, y )
{
	for ( var dx = -1; dx < 2; dx++ ) {
		for ( var dy = -1; dy < 2; dy++ ) {
			if ( this.landManager.checkLandAt( x + dx, y + dy ) ) {
				return true;
			}
		}
	}
	return false;
};

World.prototype.checkEnemyAt = function ( x, y )
{
	return this.enemyManager.checkEnemyAt( x, y );
};

World.prototype.checkCloudAt = function ( x, y )
{
	return this.cloudManager.checkCloudAt( x, y );
};

World.prototype.attackTile = function ( x, y )
{
	this.enemyManager.attack( x, y );
	this.enemyManager.loadArea( this.camGoal.x, this.camGoal.y );
};

World.prototype.revealTile = function ( x, y )
{
	if (this.cloudManager.checkCloudAt( x, y )) {
		this.cloudManager.reveal( x, y );
		if (this.enemyManager.checkEnemyAt( x, y )) {
			this.enemyManager.reveal( x, y );
		}
		this.cloudManager.loadArea( this.camGoal.x, this.camGoal.y );
	}
};

World.prototype.cameraShake = function ( value )
{
	this.shake = Math.max( Math.round(value), this.shake );
};
