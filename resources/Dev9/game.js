/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize( 16, 16 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "scroll to cast line" );

	// Add any other initialization code you need here.
	PS.border(PS.ALL,PS.ALL, 0)
	PS.color(PS.ALL, PS.ALL, 0xaaaaff)
	PS.color(PS.ALL, 15, 0xffffaa)
	PS.color(PS.ALL, 0, PS.COLOR_WHITE)
	PS.color(PS.ALL, 1, PS.COLOR_WHITE)
	PS.color(0,1,0x804000)
	//PS.color(1,1,0x804000)

	PS.glyph(0,14,0x1F420)
	PS.glyph(0,0,0x1FA9D)

	PS.audioLoad("fx_coin2")

	globals.gameLoop = PS.timerStart(1, update);
};

var update = function() {
	if (--globals.fishTimer==0) {
		globals.fishTimer = 5
		PS.glyph(globals.fishX, globals.fishY, globals.fishX==globals.hookX ? (globals.fishY>globals.hookY ? 0 : (globals.fishY<globals.hookY ? '|' : 0x1FA9D)) : 0)
		globals.fishX+=globals.fishDx
		globals.fishY=Math.max(globals.fishY,2)
		PS.glyph(globals.fishX, globals.fishY, 0x1F420)
		if (globals.fishX==15) globals.fishDx=-1
		if (globals.fishX==0) globals.fishDx=1
		if (globals.fishY==globals.hookY && globals.fishX+globals.fishDx==globals.hookX) PS.audioPlay("fx_coin2")
	}
	if (globals.scrollDel>0) {
		globals.scrollTime++
		if (globals.scrollDel==3) {
			if (globals.hookY == 0) {
				PS.glyph(globals.hookX, 0, 0)
				globals.hookX = Math.min(Math.floor((globals.scrollTime + 3) / 2), 15)
				PS.glyph(globals.hookX, 0, 0x1FA9D)
			} else {
				PS.glyph(globals.hookX, globals.hookY, (globals.scrollDir == 1 && globals.hookX == globals.fishX && globals.hookY == globals.fishY) ? 0x1F420 : 0)
				if (globals.scrollDir==-1 && globals.hookY==globals.fishY && globals.hookX==globals.fishX) {
					PS.glyph(globals.fishX, globals.fishY, 0)
					globals.fishY=Math.max(globals.origHookY + Math.floor(((globals.scrollTime+1) * globals.scrollDir) / 2), 1)
					PS.glyph(globals.fishX,globals.fishY, 0x1F420)
					if (globals.fishY==1) globals.fishTimer=300
				}
				globals.hookY = Math.min(Math.max(globals.origHookY + Math.floor(((globals.scrollTime+1) * globals.scrollDir) / 2), 1), 14)
				for (var i=0; i<=14; i++) {
					if (PS.glyph(globals.hookX, i) != 0x1F420) {
						PS.glyph(globals.hookX, i, i<globals.hookY ? '|' : (i>globals.hookY ? 0 : 0x1FA9D))
					}
				}
			}
		}
		globals.scrollDel--
	} else {
		if (globals.hookY==0 && globals.scrollTime) {
			PS.glyph(globals.hookX, 0, '|')
			PS.glyph(globals.hookX, 1, '|')
			globals.hookY = 2
			PS.glyph(globals.hookX, 2, (globals.fishX==globals.hookX && globals.fishY==2) ? 0x1F420 : 0x1FA9D)
			PS.statusText("scroll down/up to lower/raise hook")
		} else if (globals.hookY==1) {
			PS.glyph(globals.hookX, 1, 0)
			PS.glyph(globals.hookX,0,0)
			PS.glyph(0,0,0x1FA9D)
			globals.hookX=0
			globals.hookY=0
			PS.statusText( "scroll to cast line" );
			if (globals.fishY==1) {
				PS.glyph(globals.fishX,1,0)
				PS.glyph(0,0,0x1F3A3)
				PS.statusText("You Win!")
				PS.timerStop(globals.gameLoop)
				PS.audioPlay("fx_tada")
			}
		}
		globals.origHookY = globals.hookY
		globals.scrollTime = 0
	}
}

var globals = {
	fishX: 0,
	fishDx: 1,
	fishY: 14,
	fishTimer: 5,
	hookX: 0,
	hookY: 0,
	origHookY: 0,
	scrollDir: 1,
	scrollDel: 0,
	scrollTime: 0,
	gameLoop: null,
	level: 0
}

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( device, options ) {
	// Uncomment the following code lines to inspect first parameter:

	var wheel = device.wheel; // check for scroll wheel

	if (wheel) {
		if (wheel === PS.WHEEL_FORWARD) {
			globals.scrollDel=3
			if (globals.hookY>0 && globals.scrollDir==1) {
				globals.origHookY=globals.hookY
				globals.scrollTime=0
			}
			globals.scrollDir=1
		}
		if (wheel === PS.WHEEL_BACKWARD) {
			globals.scrollDel=3
			if (globals.hookY>0 && globals.scrollDir==-1) {
				globals.origHookY=globals.hookY
				globals.scrollTime=0
			}
			globals.scrollDir=-1
		}
	}

	// Add code here for when an input event is detected.
};

