
// Constructor
function GuiManager()
{
};

GuiManager.prototype.create = function ()
{
	this.group = Global.game.add.group();


	/* Pause menu */

	this.menuManager = new MenuManager();
	this.setupMenus();
	this.menuManager.allowInput = false;


	/* Life GUI */

	this.lifeGui = this.group.create( 0, 0, 'hud' );
	this.lifeGui.anchor.setTo( 1.0, 1.0 );

	this.lifeSize = 3;
	this.lifePoint = Array( this.lifeSize );
	for ( var i = 0; i < this.lifeSize; i++ )
	{
		this.lifePoint[i] = this.group.create( 0, 0, 'life' );
		this.lifePoint[i].anchor.setTo( 1.0, 1.0 );
	}
};

GuiManager.prototype.update = function ()
{
	this.menuManager.update();

	this.lifeGui.x = Global.game.camera.view.x + SCREEN_WIDTH;
	this.lifeGui.y = Global.game.camera.view.y + SCREEN_HEIGHT;

	for ( var i = 0; i < this.lifeSize; i++ )
	{
		this.lifePoint[i].x = Global.game.camera.view.x + SCREEN_WIDTH - 4 - 22 * ( i );
		this.lifePoint[i].y = Global.game.camera.view.y + SCREEN_HEIGHT - 2;
	}
};


GuiManager.prototype.setupMenus = function ()
{
	var resume = function() { Global.togglePause(); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var quit = function() { this.menuManager.nextMenu( this.confirmationMenu ); };

	this.pauseMenu = [
		[ 'resume', resume.bind(this) ],
		[ 'options', options.bind(this) ],
		[ 'quit', quit.bind(this) ],
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
		//[ musicText(), music.bind(this) ],
		[ soundText(), sound.bind(this) ],
		[ 'back', back.bind(this) ],
	];

	var exit = function() {
		if ( this.menuManager.allowInput )
		{
			this.menuManager.allowInput = false;

			Global.game.camera.fade(0x111111, 700);
			Global.game.time.events.add( 700, function() {
				Global.game.state.start( 'MainMenu' );
			}, this);
		}
	};

	this.confirmationMenu = [
		[ 'quit', exit.bind(this) ],
		[ 'no', back.bind(this) ],
	];

	this.gameoverMenu = [
		[ 'Try again', exit.bind(this) ],
	];
};

GuiManager.prototype.showPauseMenu = function ()
{
	this.menuManager.allowInput = true;

	var c = Global.game.camera.view;

	this.darkBg = Global.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();

	this.darkFg = Global.game.add.graphics( c.x, c.y );
	this.darkFg.beginFill( 0x000000, 0.2 );
	for (var i=0; i<SCREEN_HEIGHT/2; i++)
		this.darkFg.drawRect( 0, i*2, SCREEN_WIDTH, 1 );
	this.darkFg.endFill();

	var x = c.x+SCREEN_WIDTH/2;
	var y = c.y + 32;

	this.choiceTitle = Global.game.add.bitmapText( x, y, 'OldWizard', 'Pause', 16 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	y += 28;
	this.menuItem = Global.game.add.sprite( x, y, 'items', randInt(0,8*9-1) );
	this.menuItem.anchor.set( 0.5 );

	y += 28;
	this.menuManager.createMenu( x, y, this.pauseMenu );

	Global.Audio.play( 'menu', 'open' );
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.menuManager.allowInput = false;

	this.darkBg.clear();
	this.darkFg.clear();
	this.menuItem.kill();
	this.choiceTitle.kill();

	this.menuManager.killMenu();

	Global.Audio.play( 'menu', 'close' );
};


GuiManager.prototype.showGameOver = function ()
{
	var c = Global.game.camera.view;

	var x = c.x + SCREEN_WIDTH/2;
	var y = c.y + SCREEN_HEIGHT/2;

	this.darkBg = Global.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();
	this.darkBg.alpha = 0;
	this.darkBg.blendMode = Phaser.blendModes.OVERLAY;
	Global.game.add.tween( this.darkBg ).to({ alpha: 0.5 }, 1500, Phaser.Easing.Linear.In, true );

	this.choiceTitleBg = Global.game.add.bitmapText( x+1, y+1, 'OldWizard', 'Game Over', 32 );
	this.choiceTitleBg.anchor.setTo( 0.5, 0.5 );
	this.choiceTitleBg.tint = 0x000000;
	this.choiceTitle = Global.game.add.bitmapText( x, y, 'OldWizard', 'Game Over', 32 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	this.choiceTitle.tint = 0xE64A19;

	this.choiceTitle.x -= 16;
	this.choiceTitle.alpha = 0;
	this.choiceTitleBg.x += 16;
	this.choiceTitleBg.alpha = 0;
	Global.game.add.tween( this.choiceTitle ).to({ x: x, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );
	Global.game.add.tween( this.choiceTitleBg ).to({ x: x+1, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );

	Global.game.time.events.add( 2000, function() {
		var x = c.x + SCREEN_WIDTH/2;
		var y = c.y + SCREEN_HEIGHT - 20;
		this.menuManager.allowInput = true;
		this.menuManager.createMenu( x, y, this.gameoverMenu );
	}, this );
};
