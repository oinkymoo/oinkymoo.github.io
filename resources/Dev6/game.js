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

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "arrows or WASD to move" );

	// Add any other initialization code you need here.
	loadMap()
	PS.audioLoad("fx_tada")
};

var globals = {
	playerX: 0,
	playerY: 0,
	mapNum: 0,
	levels: [
		height: 6,
		map: [[0,0,0,0,0],
			  [0,1,3,1,0],
			  [0,2,2,2,0],
			  [0,1,1,1,0],
			  [0,0,4,0,0],
			  [0,0,0,0,0]],
		pX: 2,
		pY: 1},
		{width: 5,
		{width: 10,
		height: 15,
		map: [[0,0,0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,1,0,0,0,0],
			  [0,1,0,0,0,1,0,0,0,0],
			  [0,1,0,0,0,1,0,0,0,0],
			  [0,1,0,0,0,1,0,0,0,0],
			  [0,2,2,2,2,2,4,0,0,0],
			  [0,2,2,2,2,2,1,1,1,0],
			  [0,2,2,2,2,2,0,0,0,0],
			  [0,2,2,2,2,2,0,0,0,0],
			  [0,3,2,2,2,2,0,0,0,0],
			  [0,2,2,2,2,2,1,1,1,0],
			  [0,0,1,1,0,0,0,0,0,0],
			  [0,0,0,1,0,0,0,0,0,0],
			  [0,0,0,1,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0,0,0]],
		pX: 1,
		pY: 9},
		{width:13,
		height:11,
		map: [[0,0,0,0,0,0,0,0,0,0,0,0,0],
			  [0,1,0,1,0,0,1,0,0,1,0,1,0],
			  [0,1,0,1,0,1,0,1,0,1,0,1,0],
			  [0,0,1,0,0,1,0,1,0,1,0,1,0],
			  [0,0,1,0,0,0,1,0,0,0,1,0,0],
			  [0,0,0,0,0,0,0,0,0,0,0,0,0],
			  [0,1,0,1,0,1,0,1,0,1,1,0,0],
			  [0,1,0,1,0,1,0,1,0,1,0,1,0],
			  [0,1,0,1,0,1,0,1,0,1,0,1,0],
			  [0,0,1,0,1,0,0,1,0,1,0,1,0],
			  [0,0,0,0,0,0,0,0,0,0,0,0,0]],
		pX: 4,
		pY: 5}
	]
}

function loadMap() {
	var cols = [PS.COLOR_BLACK,PS.COLOR_WHITE,PS.COLOR_YELLOW,PS.COLOR_BLUE,PS.COLOR_GREEN]

	var lvl = globals.levels[globals.mapNum]
	PS.gridSize(lvl.width,lvl.height)
	var map = lvl.map
	for (var row=0; row<lvl.height; row++) {
		for (var col=0; col<lvl.width; col++) {
			PS.color(col,row,cols[map[row][col]])
		}
	}
	globals.playerX = lvl.pX
	globals.playerY = lvl.pY
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
	switch ( key ) {
		case PS.KEY_ARROW_UP:
		case 119:
		case 87: {
			move(0,-1)
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83: {
			move(0,1)
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65: {
			move(-1,0)
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68: {
			move(1,0)
			break;
		}
		case 114:
		case 82: {
			loadMap()
			break;
		}
	}
};

function move(dx, dy) {
	if(push(globals.playerX+dx,globals.playerY+dy,dx,dy)) {
		PS.color(globals.playerX,globals.playerY,PS.COLOR_WHITE);
		globals.playerX+=dx;
		globals.playerY+=dy;
		if (PS.color(globals.playerX,globals.playerY)==PS.COLOR_GREEN) {
			PS.audioPlay("fx_tada")
			globals.mapNum++
			loadMap()
		} else {
			PS.color(globals.playerX, globals.playerY, PS.COLOR_BLUE);
		}
	}
}

function push(px, py, dx, dy) {
	switch (PS.color(px,py)) {
		case PS.COLOR_BLACK: {
			return false
		}
		case PS.COLOR_WHITE:
		case PS.COLOR_GREEN: {
			return true
		}
		case PS.COLOR_YELLOW: {
			if (push(px+dx,py+dy,dx,dy)) {
				PS.color(px+dx,py+dy,PS.COLOR_YELLOW)
				return true
			}
			return false
		}
	}
}

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

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

