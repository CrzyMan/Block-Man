var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var LEVEL = 2;
var curr_lev;

canvas.height = 440;
canvas.width = 600;

var player = {
	pos: {
		x: 0,
		y: 0
	},
	carrying: false,
	direction: 1,
	right: function(){
		var oldx = player.pos.x, oldy = player.pos.y;
		player.direction = 1;
		// trying to move to empty block
		if (!curr_lev[player.pos.y][player.pos.x+1]){
			curr_lev[player.pos.y][player.pos.x]=0;
			player.pos.x++;
			// if no floor
			if (!curr_lev[player.pos.y+1][player.pos.x]){
				while (!curr_lev[player.pos.y+1][player.pos.x]){
					player.pos.y++;
				}
			}
			curr_lev[player.pos.y][player.pos.x]=2;
		}
		//handle if carrying
		if (player.carrying){
			curr_lev[oldy-1][oldx] = 0;
			//went under a ledge
			if (curr_lev[player.pos.y-1][player.pos.x]){
				player.carrying = false;
				curr_lev[oldy][oldx]=3;
			} // otherwise still on top
			else {
				curr_lev[player.pos.y-1][player.pos.x]=3;
			}
		}
		draw_level(LEVEL);
	},
	left: function(){
		var oldx = player.pos.x, oldy = player.pos.y;
		player.direction = -1;
		// trying to move to empty block
		if (!curr_lev[player.pos.y][player.pos.x-1]){
			curr_lev[player.pos.y][player.pos.x]=0;
			player.pos.x--;
			// if no floor
			if (!curr_lev[player.pos.y+1][player.pos.x]){
				while (!curr_lev[player.pos.y+1][player.pos.x]){
					player.pos.y++;
				}
			}
			curr_lev[player.pos.y][player.pos.x]=2;
		}

		//handle if carrying
		if (player.carrying){
			curr_lev[oldy-1][oldx] = 0;
			//went under a ledge
			if (curr_lev[player.pos.y-1][player.pos.x]){
				player.carrying = false;
				curr_lev[oldy][oldx]=3;
			} // otherwise still on top
			else {
				curr_lev[player.pos.y-1][player.pos.x]=3;
			}
		}

		draw_level(LEVEL);
	},
	up: function(){
		// can go up onto ablock
		if (!curr_lev[player.pos.y-1][player.pos.x+player.direction] && curr_lev[player.pos.y][player.pos.x+player.direction] && (!curr_lev[player.pos.y-1][player.pos.x] || curr_lev[player.pos.y-1][player.pos.x]==3)){

			// if not carrying, or can carry up a block
			if (!player.carrying || player.carrying && !curr_lev[player.pos.y-2][player.pos.x+player.direction]){

				curr_lev[player.pos.y][player.pos.x]=0;
				player.pos.x+=player.direction;
				player.pos.y--;
				curr_lev[player.pos.y][player.pos.x]=2;

				if (player.carrying){
					curr_lev[player.pos.y][player.pos.x-player.direction]=0;
					curr_lev[player.pos.y-1][player.pos.x]=3;
				}

				draw_level(LEVEL);
			}
		}
	},
	down: function(){
		// if not carrying
		if (!player.carrying){
			// if can pick up the block
			if (curr_lev[player.pos.y][player.pos.x+player.direction]==3 &&
			    !curr_lev[player.pos.y-1][player.pos.x+player.direction] &&
			    !curr_lev[player.pos.y-1][player.pos.x]){

				curr_lev[player.pos.y][player.pos.x+player.direction]=0;
				curr_lev[player.pos.y-1][player.pos.x]=3;
				player.carrying = true;
			}
		} else {
			//drop the block if you can
			if (!curr_lev[player.pos.y][player.pos.x+player.direction]){
				//curr_lev[player.pos.y][player.pos.x+player.direction]=3;
				curr_lev[player.pos.y-1][player.pos.x]=0;
				player.carrying = false;

				// if need to drop the box down
				boxy = player.pos.y;
				if (!curr_lev[player.pos.y+1][player.pos.x+player.direction]){
					while (!curr_lev[boxy][player.pos.x+player.direction]){
						boxy++;
					}
					boxy--;
				}
				curr_lev[boxy][player.pos.x+player.direction]=3;


			} // if there is a block, but you can place it above it
			 else if (!curr_lev[player.pos.y-1][player.pos.x+player.direction]){
			 	curr_lev[player.pos.y-1][player.pos.x+player.direction]=3;
				curr_lev[player.pos.y-1][player.pos.x]=0;
				player.carrying = false;
			 }
		}
		draw_level(LEVEL);
	}
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
		 [1,1,1,0,0,3,3,1,0,0,0,0,0,1,0,3,0,0,0,0,0,0,0,0,0,0,1,0,1],
		 [1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1],
		 [1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,3,0,1],
		 [1,3,3,0,0,0,0,0,0,0,1,1,1,0,1,0,1,3,0,0,0,0,1,0,0,1,1,1,1],
		 [1,1,1,1,0,3,0,0,0,1,1,1,0,0,1,0,1,1,3,0,0,1,0,3,0,1,0,0,1],
		 [1,0,0,0,0,0,0,0,0,0,0,0,3,0,1,1,1,0,0,3,1,0,0,0,1,0,0,0,1],
		 [1,0,0,0,3,0,0,0,0,0,3,3,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1]]
	];

	player.pos = find_start_pos();

}

function find_start_pos(l){
	if (l==null)l=LEVEL;
	l--;
	for (var r = 0; r < levels[l].length; r++){
		for (var c = 0; c < levels[l][r].length; c++){
			if (levels[l][r][c]==2) return {x: c, y: r};
		}
	}
	return {x: 0, y:0};
}

draw_level(2);
function draw_level(l){
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
function bind(code, func){
	binded_keys[code] = func;
}

document.onkeydown = check_bindings;
function check_bindings(e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	
	if (binded_keys[keycode]) binded_keys[keycode]();
}
//**//

//left arrow
bind(37, player.left);
//up arrow
bind(38, player.up);
//right arrow
bind(39, player.right);
//down arrow
bind(40, player.down);
