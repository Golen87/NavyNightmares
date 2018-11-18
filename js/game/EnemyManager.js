
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

EnemyManager.prototype.addShark = function( x, y, dx, dy, index ) {
	var s = this.addSprite( x, y, Tiles.Shark.pos );

	var frames = Tiles.Shark.pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 2.5, true );
	s.animations.play( 'idle' );

	return s;
};

EnemyManager.prototype.addBlood = function( x, y ) {
	var s = this.addSprite( x, y, Tiles.Blood.pos );

	var frames = Tiles.Blood.pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 1, true );
	s.animations.play( 'idle' );
	s.alpha = 0.8;

	return s;
};

EnemyManager.prototype.addMiss = function( x, y ) {
	var s = this.addSprite( x, y, Tiles.Miss.pos );

	var frames = Tiles.Miss.pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 1, true );
	s.animations.play( 'idle' );
	s.alpha = 0.8;

	return s;
};

EnemyManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Enemy ) ) {
		var s = this.addShark( x, y );
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

EnemyManager.prototype.attack = function ( x, y )
{
	if (this.checkEnemyAt( x, y )) {
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
			}
		}
	}
	else {
		var p = [x,y];
		if ( this.tileMap[p] ) {
			this.tileMap[p] = TileTypes.Blood;
		}
		this.tileMap[p] = TileTypes.Miss;
		var key = x + "," + y;
		this.activeSet.delete(key);
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
		}
	}
};

extend( TileManager, EnemyManager );
