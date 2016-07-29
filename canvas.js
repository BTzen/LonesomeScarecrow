/* TODO consider getting rid of this method or moving it somewhere else
 * if this method is not just checking the board it will display the possible tiles a piece can move to, otherwise it will push the possible moves to the highlightedTiles
 * bHighlightTiles boolean used to determine whether the tiles are visibly highlighted.  If set to false the potential moves are pushed to an array to be used for purposes of rule enforcement and board state evaluation
 */
 function fill(ctxHighlight, color, action) {
	if (action.column > -1 && action.column < 8 && action.row > -1 && action.row < 8) {
		ctxHighlight.fillStyle = color;
		ctxHighlight.fillRect(action.column * LENGTH, action.row * LENGTH, LENGTH, LENGTH);
		highlightedTiles.push(action); 
	}
}