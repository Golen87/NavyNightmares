var Global = Global || {};
Global.Preload = function() {};

Global.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#AAAAFF';
		this.oceanBg = Global.game.add.tileSprite( -16, -16, (ROOM_WIDTH+2) * 16, (ROOM_HEIGHT+2) * 16, 'tileset', posToIndex( 'tileset', Tiles.Water.pos) );

		// Load game assets
		
		//this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		//this.load.bitmapFont( 'AdventurerFancy', 'assets/fonts/Adventurer/font_fancy.png', 'assets/fonts/Adventurer/font_fancy.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		//this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		//this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16
		this.load.bitmapFont( 'TinyUnicode', 'assets/fonts/TinyUnicode/font.png', 'assets/fonts/TinyUnicode/font.fnt' ); // 16
		//this.load.bitmapFont( 'OldWizard', 'assets/fonts/OldWizard/font.png', 'assets/fonts/OldWizard/font.fnt' ); // 16
		//this.load.bitmapFont( 'Peepo', 'assets/fonts/Peepo/font.png', 'assets/fonts/Peepo/font.fnt' ); // 9
		//this.load.bitmapFont( 'Superscript', 'assets/fonts/Superscript/font.png', 'assets/fonts/Superscript/font.fnt' ); // 10
		this.load.bitmapFont( '04b24', 'assets/fonts/04b24/font.png', 'assets/fonts/04b24/font.fnt' ); // 8

		this.load.image( 'glow', 'assets/sprites/glow.png' );
		this.load.image( 'torchlight', 'assets/sprites/torchlight.png' );
		this.load.image( 'hud', 'assets/sprites/hud.png' );
		this.load.image( 'corner', 'assets/sprites/corner.png' );
		this.load.image( 'bubble', 'assets/sprites/bubble.png' );
		this.load.image( 'life', 'assets/sprites/lifebuoy.png' );
		this.load.image( 'harpoon-icon', 'assets/sprites/harpoon-icon.png' );
		this.load.image( 'small-hud', 'assets/sprites/small-hud.png' );

		//this.load.spritesheet( 'tileset', 'assets/sprites/tileset.png', 16, 16 );
		this.load.spritesheet( 'monsters', 'assets/sprites/monsters.png', 16, 16 );
		this.load.spritesheet( 'player', 'assets/sprites/player.png', 32, 32 );
		this.load.spritesheet( 'harpoon', 'assets/sprites/harpoon.png', 64, 64 );
		this.load.spritesheet( 'menubg', 'assets/sprites/menubg.png', 192, 192 );

		this.load.spritesheet( 'smoke', 'assets/sprites/smoke.png', 9, 9 );
		this.load.spritesheet( 'sparkle', 'assets/sprites/sparkle.png', 9, 9 );
		this.load.spritesheet( 'rubble', 'assets/sprites/rubble.png', 5, 5 );
		this.load.spritesheet( 'fire', 'assets/sprites/fire.png', 16, 16 );

		this.load.audio( 'footsteps', 'assets/sounds/footsteps.ogg' );
		this.load.audio( 'eating', 'assets/sounds/eating.ogg' );
		this.load.audio( 'swing', 'assets/sounds/swing.ogg' );
		this.load.audio( 'chop', 'assets/sounds/chop.ogg' );
		this.load.audio( 'hurt', 'assets/sounds/hurt.ogg' );
		this.load.audio( 'death', 'assets/sounds/death.ogg' );

		this.load.audio( 'break', 'assets/sounds/break.ogg' );
		this.load.audio( 'boxPush', 'assets/sounds/boxPush.ogg' );
		this.load.audio( 'blockPush', 'assets/sounds/blockPush.ogg' );
		this.load.audio( 'crystal', 'assets/sounds/crystal.ogg' );
		this.load.audio( 'spikes', 'assets/sounds/spikes.ogg' );
		this.load.audio( 'open', 'assets/sounds/open.ogg' );
		this.load.audio( 'pressureplate', 'assets/sounds/pressureplate.ogg' );

		this.load.audio( 'rat', 'assets/sounds/monsters/rat.ogg' );
		this.load.audio( 'mouse', 'assets/sounds/monsters/mouse.ogg' );
		this.load.audio( 'rhino', 'assets/sounds/monsters/rhino.ogg' );
		this.load.audio( 'spider', 'assets/sounds/monsters/spider.ogg' );
		this.load.audio( 'slime', 'assets/sounds/monsters/slime.ogg' );
		//this.load.audio( 'creature', 'assets/sounds/monsters/creature.ogg' );
		//this.load.audio( 'monsterroom-spawn', 'assets/sounds/monsters/monsterroom-spawn.ogg' );

		this.load.audio( 'menu', 'assets/sounds/menu.ogg' );
		this.load.audio( 'waves', 'assets/sounds/waves.wav' );


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

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 210, function() {
			this.state.start( 'MainMenu' );
		}, this);
	},
	fileComplete: function ( progress, cacheKey, success, totalLoaded, totalFiles ) {}
};
