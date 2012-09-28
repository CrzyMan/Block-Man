/*
*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var LEVEL = 2;
var curr_lev;

canvas.height = 440;
canvas.width = 600;

var player = {
	pos: new Vector2d(),
	carrying: false,
	direction: 1,
	lateral: function(d){
		player.direction=d
		
		// reset player and block, if carrying
		curr_lev[player.pos.y][player.pos.x] = 0;
		if (player.carrying)
			curr_lev[player.pos.y-1][player.pos.x] = 0

		// new player pos (npp) to requested position (rp) and store last position
		var lp = player.pos;
		var rp = player.pos.add(player.direction,0);
		var npp = request_position(player.pos, rp);

		//check if win
		if (curr_lev[npp.y][npp.x]==4){
			// YOU WIN
			curr_lev[player.pos.y][player.pos.x] = 0;
			player.pos = npp;
			draw_level();
			alert("YOU WIN!");

			LEVEL =  1 + LEVEL%levels.length;
			reset_levels();
			draw_level();

			return;
		}

		curr_lev[npp.y][npp.x] = 2;


		// carrying clause
		if (player.carrying){
			// request new position where it would be if moved to the side
			// will drop if the player goes down, or will stay then dropped if can't move to the side
			// request position above new player position at level the block used to be at
			var nbp = request_position(lp.add(0,-1), new Vector2d(npp.x,lp.y-1))
			curr_lev[nbp.y][nbp.x] = 3;
		}

		// update player
		player.pos = npp;
		
		draw_level();
	},
	up: function(){
		
		var rp = player.pos.add(player.direction,-1);

		// can move up, carrying restriction and handling updates
		if (curr_lev[player.pos.y][player.pos.x+player.direction]!=0 && curr_lev[player.pos.y-1][player.pos.x]!=1 &&
			!(curr_lev[player.pos.y-2][player.pos.x+player.direction] && player.carrying)){

			if (player.carrying)
				curr_lev[player.pos.y-1][player.pos.x] = 0;

			curr_lev[player.pos.y][player.pos.x] = 0;

			player.pos = request_position(player.pos, rp);
			if (player.carrying){
				curr_lev[player.pos.y-1][player.pos.x] = 3;
			}

			// check if win
			if (curr_lev[player.pos.y][player.pos.x]==4){
				// YOU WIN
				draw_level();
				alert("YOU WIN!");

				LEVEL = 1 + LEVEL%levels.length;
				reset_levels();
				draw_level();

			return;
		}


			curr_lev[player.pos.y][player.pos.x] = 2;
			
		}
		draw_level();

	},
	down: function(){
		if (player.carrying){
			//place the block
			curr_lev[player.pos.y-1][player.pos.x] = 0;
			var nbp = request_position(player.pos.add(player.direction,-1), player.pos.add(player.direction,-1));
			curr_lev[nbp.y][nbp.x] = 3;
			player.carrying = false;

		} else {
			// not carrying
			// if a block to pick up 
			if (curr_lev[player.pos.y][player.pos.x+player.direction]==3 &&
			    !curr_lev[player.pos.y-1][player.pos.x+player.direction] &&
			    !curr_lev[player.pos.y-1][player.pos.x]){
				curr_lev[player.pos.y][player.pos.x+player.direction] = 0;
				curr_lev[player.pos.y-1][player.pos.x] = 3;
				player.carrying = true;
			}
		}
		draw_level();
	}
};

function request_position(current, requested){
	// determine if requested position is currently occupyable
	if (curr_lev[requested.y][requested.x]==0 || curr_lev[requested.y][requested.x]==4){
		//check if need to drop down
		if (!curr_lev[requested.y+1][requested.x]){
			while (!curr_lev[requested.y+1][requested.x]) {requested.y++;}
		}
		return requested;
	}
	
	// if not, return substitute position
	return current;
};

var levels;
reset_levels();
function reset_levels(){
	levels = [
		//level one
		[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		 [1,4,0,0,1,0,0,0,0,1,0,3,0,1,0,3,2,0,0,1],
		 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],

		//level two
		[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		 [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,0,3,1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
		 [1,3,0,0,0,1,1,1,0,3,1,1,0,0,0,0,0,3,0,0,1,1,0,0,4,0,1,0,1],
		 [1,3,3,0,0,0,0,1,1,1,0,0,0,2,0,0,3,0,0,0,0,0,0,0,1,0,1,0,1],
		 [1,1,1,0,0,3,3,1,0,0,0,0,0,1,0,3,0,0,0,0,0,0,0,3,0,0,1,0,1],
		 [1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,3,3,3,1,1,1,0,0,1],
		 [1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,3,0,1],
		 [1,3,3,0,0,0,0,0,0,0,1,1,1,0,1,0,1,3,0,0,0,0,1,0,0,1,1,1,1],
		 [1,1,1,1,0,3,0,0,0,1,1,1,0,0,1,0,1,1,3,0,0,1,0,3,0,1,0,0,1],
		 [1,0,0,0,0,0,0,0,0,0,0,0,3,0,1,1,1,0,0,3,1,0,0,0,1,0,0,0,1],
		 [1,0,0,0,3,0,0,0,0,0,3,3,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
		 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
	];

	player.pos = find_start_pos();

}

function find_start_pos(l){
	if (l==null)l=LEVEL;
	l--;
	for (var r = 0; r < levels[l].length; r++){
		for (var c = 0; c < levels[l][r].length; c++){
			if (levels[l][r][c]==2) return new Vector2d(c,r);
		}
	}
	return new Vector2d();
}

draw_level(2);
function draw_level(l){
	if (l==undefined) l=LEVEL;

	ctx.clearRect(0,0,canvas.width, canvas.height);
	l--;
	curr_lev = levels[l];

	// move screen
	ctx.save()
	var offsetx = 280-(40*player.pos.x),
	    offsety = 200-(40*player.pos.y);
	if (player.pos.x > curr_lev[0].length-8){
		offsetx = 280-(40*(curr_lev[0].length-8));
	} else if (player.pos.x < 7){
		offsetx = 280-(40*7);
	}

	ctx.translate(offsetx, offsety);

	for (var row=0; row<curr_lev.length; row++){
		for (var col=0; col<curr_lev[row].length; col++){
			if (curr_lev[row][col]){
				switch (curr_lev[row][col]){
					//brick
					case 1:
						ctx.fillStyle = "red";
						break;

					// player
					case 2:
						ctx.fillStyle = "blue";
						break;

					// block
					case 3:
						ctx.fillStyle = "grey";
						break;

					// goal
					case 4:
						ctx.fillStyle = "green";
						break;
				}
				ctx.fillRect(40*col, 40*row, 40,40);
				ctx.strokeRect(40*col, 40*row, 40,40);
				if (curr_lev[row][col]==2){
					ctx.strokeRect(40*col + 35*(player.direction==1), 40*row + 15, 5,5);
				}
			}
		}
	}

	// move canvas back
	ctx.restore();

}

// Key Binding Functions //
var binded_keys = {};
// bind( code, func, *args)
function bind(){
	code = arguments[0];
	func = arguments[1];
	args = [];
	for (var i = 2; i<arguments.length; i++){
		args.push(arguments[i]);
	}
	binded_keys[code] = [func,args];
}

document.onkeydown = check_bindings;
function check_bindings(e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	
	try {
		binded_keys[keycode][0].apply(this, binded_keys[keycode][1]);
	} catch (e){}
}
//**//

//left arrow
bind(37, player.lateral, -1);
//up arrow
bind(38, player.up);
//right arrow
bind(39, player.lateral, 1);
//down arrow
bind(40, player.down);