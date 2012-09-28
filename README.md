BLOCK MAN
=========

This is just a spin-off of the calculator game "Block Dude." <br><br>
Developed by CrzyMan <br>
using HTML5, Javascript

----
TO PREVIEW

Simply run "main.html" in a canvas element supporting browser to get a working model of the final level of "Block Dude." (currently the last level of Block Dude, but level two of Block Man)

If you want to change between level 1 or 2, type into your browser's console:
- LEVEL=1;reset_levels();draw_level();
- LEVEL=2;reset_levels();draw_level();

----
IMPLEMENTED:
- Accurate to original game movement and physics
- Actual Levels (first and last)
- Different Colors for different kinds of blocks (brick, movable, player, door... and technically air)
- Incorporation of Vector objects.

IN PROGRRESS:
- Request based movement (a.k.a. occupation intents) to reduce superfluous code.
- Level Win recognition.
- Switch level after win (tbd after level win recognition).
- Space saving level storage.

FUTURE PLANS:
- Make a 3D first/third person version of the game.