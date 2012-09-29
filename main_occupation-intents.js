/*
*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var LEVEL = 1;
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

			// check if still carrying
			if (nbp.x != npp.x && nbp.y!= npp.y-1){
				player.carrying = false;
			}
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
	
	// if not, return substitute position, drop if nothing beneath
	if (!curr_lev[current.y+1][current.x]){
		while (!curr_lev[current.y+1][current.x]) {current.y++;}
	}
	return current;
};

function compress_level(l){
	var key = ['a','b','p','m','g'];
	var ina = 0, last = 1, str = "";
	for (var row in l){
		for (var col=0; col<l[row].length; col++){
			if (l[row][col] == last){
				ina++;
			} else {
				if (ina >1) str+= ina;
				str+=key[last];
				last = l[row][col], ina = 1;
			}
			if (col == l[row].length-1){
				if (ina >1) str+= ina;
				str+=key[last];
			}
		}
		last = 1, ina = 0, str+=":";
	}
	str = str.slice(0,str.length-1);
	return str;
}

function decompress_level(l){
	var key = {'b': 1, 'm': 3, 'a': 0, 'p': 2, 'g': 4};
	var myLevel = [];
	var post_levels = l.toString().split(':');
	for(var r in post_levels){
		var myar = [];
		var mystr = post_levels[r];
		while (mystr.search(/[a-z]/)!=-1){
			var s = mystr.search(/[a-z]/)+1;
			myar.push(mystr.slice(0,s));
			mystr = mystr.slice(s);
		}
		post_levels[r] = myar;
	}

	
	for (var row=0; row<post_levels.length; row++){
		myLevel.push([])
		for (var col=0; col<post_levels[row].length; col++){

			var str = post_levels[row][col];
			var len = str.length;
			var bl = key[str[len - 1]];
			var num = parseInt(str.slice(0,len -1)) || 1;

			for (var i = 0; i < num; i++){
				myLevel[row].push(bl);
			}
		}
	}
	return myLevel;
}

var levels = [];
var levels_comp;
reset_levels();
function reset_levels(){
	
	levels_comp = [
		// b = 1 brick, m = 1 movable, a = 1 air, p = 1 layer, g = 1 goal, 20b = 20 bricks etc.
		/* level 1 */
		"20b:b18ab:b18ab:b3ab8ab5ab:bg2ab4abamabamp2ab:20b",

		/* level 2 */
		"29b:b2ab3ab20ab:b5amb2m12a5bab:bm3a3bam2b5am2a2b2agabab:b2m4a3b3ap2am7ababab:3b2a2mb5abam7am2abab:b3a4b6ab2a3b3m3b2ab:bm12abab6ab2amab:b2m7a3bababm4ab2a4b:4bam3a3b2aba2bm2abamab2ab:b11ama3b2amb3ab3ab:b3am5a2mab3a4b7ab:b4a9b8a5bab:29b",

		/* level 3 */
		"b10ab:b5a2b3ab:bp2am6ag:12b"

		/* */
	];

	levels = [
		/* level one *
		[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		 [1,4,0,0,1,0,0,0,0,1,0,3,0,1,0,3,2,0,0,1],
		 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
		/* */

		/* level two *
		[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		 [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,0,3,1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
		 [1,3,0,0,0,1,1,1,0,3,1,1,0,0,0,0,0,3,0,0,1,1,0,0,4,0,1,0,1],
		 [1,3,3,0,0,0,3,1,1,1,0,0,0,2,0,0,3,0,0,0,0,0,0,0,1,0,1,0,1],
		 [1,1,1,0,0,3,3,1,0,0,0,0,0,1,0,3,0,0,0,0,0,0,0,3,0,0,1,0,1],
		 [1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,3,3,3,1,1,1,0,0,1],
		 [1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,3,0,1],
		 [1,3,3,0,0,0,0,0,0,0,1,1,1,0,1,0,1,3,0,0,0,0,1,0,0,1,1,1,1],
		 [1,1,1,1,0,3,0,0,0,1,1,1,0,0,1,0,1,1,3,0,0,1,0,3,0,1,0,0,1],
		 [1,0,0,0,0,0,0,0,0,0,0,0,3,0,1,1,1,0,0,3,1,0,0,0,1,0,0,0,1],
		 [1,0,0,0,3,0,0,0,0,0,3,3,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
		 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
		/* */

		/* level 3 *
		[[1,0,0,0,0,0,0,0,0,0,0,1],
		 [1,0,0,0,0,0,1,1,0,0,0,1],
		 [1,2,0,0,3,0,0,0,0,0,0,2],
		 [1,1,1,1,1,1,1,1,1,1,1,1]]
        /* */
	];
	

	for (var lev=0; lev<levels_comp.length; lev++){

		levels.push(decompress_level(levels_comp[lev]));
	}

	

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

draw_level();
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