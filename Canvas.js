/* if this method is not just checking the board it will display
 * the possible tiles a piece can move to, otherwise it will push the possible moves to the highlightedTiles
 * if isCheckingBoard is true the tiles will be added to an array rather than highlighted
 * bHighlightTiles boolean used to determine whether the tiles are visibly highlighted.  If set to false the potential moves are pushed to an array to be used for purposes of rule enforcement and board state evaluation
 */
 function fill(ctxHighlight, color, atActionType, row, column) {
	if (column > -1 && column < 8 && row > -1 && row < 8) {
		//
		if (!isCheckingBoard) {
			ctxHighlight.fillStyle = color;
			ctxHighlight.fillRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);
			highlightedTiles.push(new Move(atActionType, row, column)); // ([moveType, row, column]);		
		} else {
			allHighlightedTiles.push(new Move(atActionType, row, column));	
		}
	}
}