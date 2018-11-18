
// Constructor
function EnemyManager ()
{
	TileManager.call( this, 'monsters' );
}


/* Tile generation */

EnemyManager.prototype.generateTile = function ( x, y )
{
	if (x >= -1 && x <= 1 && y >= -1 && y <= 1)
		return TileTypes.None;

	var value = noise.simplex2(x + this.seed[0], y + this.seed[1]);

	if (value > -0.3 && value < 0.3) {
		if ( !Global.World.checkLandAt( x, y ) ) {
			return TileTypes.Enemy;
		}
	}

	return TileTypes.None;
};

EnemyManager.prototype.addEnemy = function( x, y, enemy, sound ) {
	var pos = enemy.pos.choice();
	var s = this.addSprite( x, y, 0 );

	var frames = pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 2.5, true );
	s.animations.play( 'idle' );
	s.blood = false;
	s.sound = sound;

	return s;
};

EnemyManager.prototype.addBlood = function( x, y ) {
	var s = this.addSprite( x, y, 0 );

	var frames = Tiles.Blood.pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 1, true );
	s.animations.play( 'idle' );
	s.alpha = 0.8;
	s.blood = true;

	return s;
};

EnemyManager.prototype.addMiss = function( x, y ) {
	var s = this.addSprite( x, y, Tiles.Miss.pos[2] );

	if ( !Global.World.checkLandAt( x, y ) ) {
		var frames = [Tiles.Miss.pos[0], Tiles.Miss.pos[1]].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );
		s.alpha = 0.8;
	}

	return s;
};

EnemyManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Enemy ) ) {
		var monsters = [
			[Tiles.Shark, 'mouse'],
			[Tiles.Serpent, 'rat'],
			[Tiles.Squid, 'spider'],
			[Tiles.Tantacle, 'slime'],
			[Tiles.Whale, 'rhino']
		];
		var pair = monsters.choice();
		var s = this.addEnemy( x, y, pair[0], pair[1] );

		s.visible = !Global.World.checkCloudAt( x, y );
	}

	if ( this.isTile( x, y, TileTypes.Blood ) ) {
		var s = this.addBlood( x, y );
	}

	if ( this.isTile( x, y, TileTypes.Miss ) ) {
		var s = this.addMiss( x, y );
	}
};


/* World building */

EnemyManager.prototype.checkEnemyAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Enemy;
};

EnemyManager.prototype.attack = function ( x, y, callback )
{
	if (this.checkEnemyAt( x, y )) {
		
		for ( var i = 0; i < this.group.children.length; i++ )
		{
			var s = this.group.children[i];
			if ( s.exists && s.key == [x,y] )
			{

				function blink() {
					if ( !this.blood )
					{
						this.alpha = 1.5 - this.alpha;
						this.tint = this.alpha == 1.0 ? 0xff7777 : 0xffffff;

						Global.game.time.events.add( Phaser.Timer.SECOND * 0.05, blink, this );
					}
				};
				blink.call( s );

			}
		}

		Global.game.time.events.add( Phaser.Timer.SECOND * 0.5, function() {
			s.blood = true;
			this.kill( x, y );
			callback();
		}, this );
	}
	else {
		var p = [x,y];
		if ( this.tileMap[p] != TileTypes.Miss ) {
			this.tileMap[p] = TileTypes.Miss;
			var key = x + "," + y;
			this.activeSet.delete(key);
		}
		callback();
	}
};

EnemyManager.prototype.kill = function ( x, y ) {
	var p = [x,y];
	if ( this.tileMap[p] ) {
		this.tileMap[p] = TileTypes.Blood;
	}

	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.key == [x,y] )
		{
			s.kill();
			this.activeSet.delete(s.key);
			Global.Audio.play( s.sound, 'hurt' );
		}
	}
};

EnemyManager.prototype.reveal = function ( x, y )
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.key == [x,y] )
		{
			s.visible = true;
			Global.Audio.play( s.sound, 'cry' );
		}
	}
};

extend( TileManager, EnemyManager );
