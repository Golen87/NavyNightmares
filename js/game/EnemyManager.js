
// Constructor
function EnemyManager ()
{
	TileManager.call( this );
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
	return this.addSprite( x, y, Tiles.Shark.pos );
};

EnemyManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Enemy ) ) {
		this.addShark( x, y );
	}
};


/* World building */

EnemyManager.prototype.checkEnemyAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Enemy;
};

EnemyManager.prototype.attack = function ( x, y )
{
	var p = [x,y];
	console.log("Attack", p, this.tileMap[p]);
	if ( this.tileMap[p] ) {
		console.log("NUKE tilemap");
		this.tileMap[p] = Tiles.None;
	}

	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.key == [x,y] )
		{
			console.log("FOUND the fucker");
			s.tint = 0xff0000;
			s.kill();
			this.activeSet.delete(s.key);
		}
	}
};

extend( TileManager, EnemyManager );
