
// Constructor
function LandManager ()
{
	TileManager.call( this );
}


/* Tile generation */

LandManager.prototype.generateTile = function ( x, y )
{
	if (x >= -1 && x <= 1 && y >= -1 && y <= 1) {
		return TileTypes.Water;
	}

	var value = noise.simplex2(x/8 + this.seed[0], y/8 + this.seed[1]);

	if (value > 0.6 || value < -0.7) {
		return TileTypes.Land;
	}

	return TileTypes.Water;
};

LandManager.prototype.addLand = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Land )) {
		this.addSprite( x, y, Tiles.Land.pos[index] );
	}
};

LandManager.prototype.addLandCorner = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y, TileTypes.Land ) && this.isTile( x, y+dy, TileTypes.Land )) {
		this.addSprite( x, y, Tiles.Land.pos[index] );
	}
};

LandManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Water ) ) {
		this.addLand(x, y, +1, -1, 6);
		this.addLand(x, y, -1, -1, 8);
		this.addLand(x, y, +0, -1, 7);
		this.addLand(x, y, +1, +0, 3);
		this.addLand(x, y, -1, +0, 5);
		this.addLand(x, y, +1, +1, 0);
		this.addLand(x, y, -1, +1, 2);
		this.addLand(x, y, +0, +1, 1);

		this.addLandCorner(x, y, +1, +1, 9);
		this.addLandCorner(x, y, -1, +1, 10);
		this.addLandCorner(x, y, +1, -1, 11);
		this.addLandCorner(x, y, -1, -1, 12);
	}

	if ( this.isTile( x, y, TileTypes.Land ) ) {
		this.addSprite( x, y, Tiles.Land.pos[4] );
	}
};


/* World building */

LandManager.prototype.checkLandAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Land;
};

extend( TileManager, LandManager );
