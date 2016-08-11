/* Billings, M., Kurylovich, A. */

// assign listeners
$(window).load(function() {
	document.getElementById('uiNext').addEventListener('click', nextProblemListener);
	document.getElementById('uiStart').addEventListener('click', startMatchListener);
	document.getElementById('uiReset').addEventListener('click', resetListener);
	document.getElementById('uiUndo').addEventListener('click', undoListener);
});

/* show promotion dialog when pawn reaches opposite side of board
 *
 */
function acceptPromotionListener() {
	var newPiece;
	var isWhite = $('#promotion').data('isWhite');
	var row = $('#promotion').data('row');
	var col = $('#promotion').data('column');
	//alert($('#promotion').data('isWhite') + ' ' + $('#promotion').data('row') + ' ' + $('#promotion').data('column'));
	switch ($('input[name=promotionPick]:checked').val()) {
		case "Queen":
			newPiece = new Queen(isWhite);
			break;
		case "Rook":
			newPiece = new Rook(isWhite);
			newPiece.hasMoved = true;
			break;
		case "Bishop":
			newPiece = new Bishop(isWhite);
			break;
		case "Knight":
			newPiece = new Knight(isWhite);
			break;
	}
	
	board.addPiece(newPiece, row, col);
	$('#promotion').dialog("close");	//close dialog
	draw(board);
}

/* randomly select from the given problem type
 *
*/
function startMatchListener() {
	gameIsRunning = true;
	document.getElementById('turn').innerHTML = 'Turn: White';
	$('#turn').css('visibility', 'visible');					// display which colour's turn it is to user
	$('.uiReset').attr('disabled', false);			
	$('.uiStart').attr('disabled', true);			

	loadRandomComposition();
	// draw(board);				// draw pieces on the canvas
}
// Caribou
/* reset the board to its initial state
 *
 */
function resetListener() {
	if (!gameIsRunning)
		gameIsRunning = true;
	
	isWhiteTurn = true;
	
	// reset and draw board
	currentComposition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
	if (currentComposition !== null) {
		board = new Board(currentComposition.initialState);
		currentComposition.states = [];					// reset array
	}
	else {
		throw ('currentComposition is null');
	}
	
	draw(board);
	
	ctxHighlight.clearRect(0,0, LENGTH * 8, LENGTH * 8);			// remove any visible highlighting
	$('#actionListBody').empty();									// clear action log
	document.getElementById('turn').innerHTML = 'Turn: White';
	$('#uiUndo').attr('disabled', true);
	$('#uiStart').attr('disabled', true);
}

/* undo the last turn. Returns player to the state before their last move, rolling back the most recent actions of the player and CPU.  Caribou contests
 * does not set gameIsRunning back to true if the user solved the composition
 * user cannot undo the last move if the move resulted in a terminal state
 */
function undoListener() {
	var previousState;
	var composition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
	
	if (composition.states.length > 1) {
		composition.states.splice(-1, 1);					// delete last element
		previousState = composition.states.pop();
		
		if (previousState !== undefined) {		// pop used on empty array
			board = previousState;
		}
	}
	else {
		resetListener();
	}
	
	draw(board);
	
	// revert UI elements
	document.getElementById('turn').innerHTML = 'Turn: White';
}

/* Generate a new, currently unsolved problem in the same class as the currently selected problem type
 *
 */
function nextProblemListener() {
	loadRandomComposition();
}