
// Constructor
function CloudManager ()
{
	TileManager.call( this );
}


/* Tile generation */

CloudManager.prototype.generateTile = function ( x, y )
{
	if (x >= -1 && x <= 1 && y >= -1 && y <= 1) {
		return TileTypes.None;
	}

	var value = noise.simplex2(x + this.seed[0], y + this.seed[1]);

	return TileTypes.None;
	if (value > -0.6 && value < 0.6) {
		return TileTypes.Cloud;
	}

	return TileTypes.None;
};

CloudManager.prototype.addCloud = function( x, y, dx, dy, index ) {
	return this.addSprite( x, y, Tiles.Cloud.pos );
};

CloudManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Cloud ) ) {
		var index = 0;
		index += 8 * this.isTile( x, y-1, TileTypes.Cloud ); // Up
		index += 4 * this.isTile( x+1, y, TileTypes.Cloud ); // Right
		index += 2 * this.isTile( x, y+1, TileTypes.Cloud ); // Down
		index += 1 * this.isTile( x-1, y, TileTypes.Cloud ); // Left

		this.addSprite( x, y, Tiles.Cloud.pos[index] );
	}
};


/* World building */

CloudManager.prototype.checkCloudAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Enemy;
};

extend( TileManager, CloudManager );
