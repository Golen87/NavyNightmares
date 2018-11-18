var Global = Global || {};

//loading the game assets
Global.Preload = function() {};

Global.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#AAAAFF';

		// Load game assets
		
		this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		//this.load.bitmapFont( 'AdventurerFancy', 'assets/fonts/Adventurer/font_fancy.png', 'assets/fonts/Adventurer/font_fancy.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		//this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16
		this.load.bitmapFont( 'TinyUnicode', 'assets/fonts/TinyUnicode/font.png', 'assets/fonts/TinyUnicode/font.fnt' ); // 16
		this.load.bitmapFont( 'OldWizard', 'assets/fonts/OldWizard/font.png', 'assets/fonts/OldWizard/font.fnt' ); // 16
		//this.load.bitmapFont( 'Peepo', 'assets/fonts/Peepo/font.png', 'assets/fonts/Peepo/font.fnt' ); // 9
		//this.load.bitmapFont( 'Superscript', 'assets/fonts/Superscript/font.png', 'assets/fonts/Superscript/font.fnt' ); // 10
		//this.load.bitmapFont( '04b24', 'assets/fonts/04b24/font.png', 'assets/fonts/04b24/font.fnt' ); // 8

		this.load.image( 'glow', 'assets/sprites/glow.png' );
		this.load.image( 'torchlight', 'assets/sprites/torchlight.png' );
		this.load.image( 'hud', 'assets/sprites/hud.png' );
		this.load.image( 'corner', 'assets/sprites/corner.png' );
		this.load.image( 'bubble', 'assets/sprites/bubble.png' );
		this.load.image( 'life', 'assets/sprites/lifebuoy.png' );

		this.load.spritesheet( 'tileset', 'assets/sprites/tileset.png', 16, 16 );
		this.load.spritesheet( 'player', 'assets/sprites/player.png', 32, 32 );
		this.load.spritesheet( 'harpoon', 'assets/sprites/harpoon.png', 64, 64 );
		this.load.spritesheet( 'smoke', 'assets/sprites/smoke.png', 9, 9 );
		this.load.spritesheet( 'sparkle', 'assets/sprites/sparkle.png', 9, 9 );
		this.load.spritesheet( 'rubble', 'assets/sprites/rubble.png', 5, 5 );
		this.load.spritesheet( 'fire', 'assets/sprites/fire.png', 16, 16 );

		this.load.audio( 'menu', 'assets/sounds/menu.ogg' );


		// Loading progress bar
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
		progressBg.tint = 0x7777BB;
		progressBg.anchor.setTo( 0, 0.5 );
		progressFg.anchor.setTo( 0, 0.5 );
		this.game.load.setPreloadSprite( progressFg );
		this.game.load.onFileComplete.add( this.fileComplete, this );
	},
	setup: function () {
		Global.Audio = new AudioManager();
		Global.Light = new LightManager();
		Global.Gui = new GuiManager();
		Global.Particle = new ParticleManager();
	},
	create: function () {
		this.setup();

		//this.state.start( 'MainMenu' );
		this.state.start( 'Game' );
	},
	fileComplete: function ( progress, cacheKey, success, totalLoaded, totalFiles ) {}
};
