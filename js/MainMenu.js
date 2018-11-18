var Global = Global || {};

Global.MainMenu = function() {};

Global.MainMenu.prototype = {
	create: function() {
		Global.game.stage.backgroundColor = '#AAAAFF';

		// Particles need to move
		Global.game.physics.arcade.isPaused = false;


		/* Subtitle */
		x = SCREEN_WIDTH / 2;
		y = 60;
		var text = this.add.bitmapText( x, y, 'Pixelade', 'Navy Nightmare', 13 );
		text.anchor.x = 0.5;

		/* Selection menu */
		y += 30;
		this.menuManager = new MenuManager();
		this.setupMenus();
		this.menuManager.createMenu( SCREEN_WIDTH/2, y, this.startMenu );

		this.menuManager.allowInput = false;
		Global.game.time.events.add( 550, function() {
			this.menuManager.allowInput = true;
		}, this );
	},
	update: function() {
		this.menuManager.update();

		if ( Global.game.input.activePointer.isDown )
		{
			this.startGame();
		}
	}
};


Global.MainMenu.prototype.setupMenus = function ()
{
	var play = function() { this.startGame(); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var credits = function() { this.state.start( 'Credits' ); };

	this.startMenu = [
		[ 'play', play.bind(this) ],
		[ 'options', options.bind(this) ],
		[ 'credits', credits.bind(this) ],
	];

	function musicText() { return 'music {0}'.format(Global.music ? 'on' : 'off'); }
	function soundText() { return 'sound {0}'.format(Global.sound ? 'on' : 'off'); }

	var music = function() {
		Global.music = !Global.music;
		createCookie( 'music', Global.music ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = musicText();
		return musicText();
	};
	var sound = function() {
		Global.sound = !Global.sound;
		createCookie( 'sound', Global.sound ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = soundText();
		return soundText();
	};
	var back = function() { this.menuManager.previousMenu(); };

	this.optionsMenu = [
		[ musicText(), music.bind(this) ],
		[ soundText(), sound.bind(this) ],
		[ 'back', back.bind(this) ],
	];
};

Global.MainMenu.prototype.startGame = function ()
{
	if ( this.menuManager.allowInput )
	{
		this.menuManager.allowInput = false;

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 300, function() {
			this.state.start( 'Game' );
		}, this);
	}
};
