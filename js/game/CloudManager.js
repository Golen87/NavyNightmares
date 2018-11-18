
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

	if (value < -0.05 || value > 0.05) {
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

		/*
		if (index == 15) {
			var corners = 0;
			corners += this.isTile( x-1, y-1, TileTypes.None );
			corners += this.isTile( x+1, y-1, TileTypes.None );
			corners += this.isTile( x-1, y+1, TileTypes.None );
			corners += this.isTile( x+1, y+1, TileTypes.None );
			if (corners > 0) {
				if (this.isTile( x-1, y-1, TileTypes.Cloud ))
					this.addSprite( x, y, Tiles.Cloud.pos[19] );
				if (this.isTile( x+1, y-1, TileTypes.Cloud ))
					this.addSprite( x, y, Tiles.Cloud.pos[18] );
				if (this.isTile( x-1, y+1, TileTypes.Cloud ))
					this.addSprite( x, y, Tiles.Cloud.pos[17] );
				if (this.isTile( x+1, y+1, TileTypes.Cloud ))
					this.addSprite( x, y, Tiles.Cloud.pos[16] );
			}
			else {
				this.addSprite( x, y, Tiles.Cloud.pos[index] );
			}
		}*/
		this.addSprite( x, y, Tiles.Cloud.pos[index] );
	}
};


/* World building */

CloudManager.prototype.checkCloudAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Cloud;
};

CloudManager.prototype.reveal = function ( x, y )
{
	var p = [x,y];
	if ( this.tileMap[p] ) {
		this.tileMap[p] = TileTypes.None;
	}

	var neigh = [];
	for (var dx = -1; dx < 2; dx++) {
		for (var dy = -1; dy < 2; dy++) {
			neigh.push( (x+dx) + "," + (y+dy) );
		}
	}

	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && neigh.contains(s.key) )
		{
			s.kill();
			this.activeSet.delete(s.key);
		}
	}
};

extend( TileManager, CloudManager );
