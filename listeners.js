/* Billings, M., Kurylovich, A. */

// assign listeners
$(document).ready(function() {	// use to be window.load - delete this comment if everything still works fine
	document.getElementById('uiNext').addEventListener('click', nextProblemListener);
	document.getElementById('uiReset').addEventListener('click', resetListener);
	document.getElementById('uiUndo').addEventListener('click', undoListener);
});

$(window).load(function() {
	canvasPieces.addEventListener('click', function(event) {
        var canvasLeft, canvasTop;
		var x, y;
		
		// click spam bug fix (see if this var can be removed from some places)
		if (gameLoopIsRunning)
			return false;
		
		ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);			// remove all visible highlighting on the board
		
		/* accounts for fact that board may not be positioned in the top left corner of the page
		 * border isn't counted with offset()
		 */
		canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
		canvasTop = $('#board').offset().top;
	
		x = event.pageX - canvasLeft;
        y = event.pageY - canvasTop;	
		// DEBUG console.log('event.pageX - canvasLeft = ' + event.pageX + '-' + canvasLeft);
        gameLoop(x, y);
    });
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
	draw(board);
}

// Caribou
/* reset the board to its initial state
 *
 */
function resetListener() {
	var turnsRemaining;
	
	if (!gameIsRunning)
		gameIsRunning = true;
	
	isWhiteTurn = true;
	highlightedTiles = [];
	
	// reset and draw board
	currentComposition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
	if (currentComposition !== null) {
		board = new Board(currentComposition.initialState);
		currentComposition.states = [];								// reset array
		switch (currentComposition) {
			
		}
	}
	else {
		throw ('currentComposition is null');
	}
	draw(board);
	
	ctxHighlight.clearRect(0,0, LENGTH * 8, LENGTH * 8);			// remove any visible highlighting
	$('#actionListBody').empty();									// clear action log
	outputText('Turn: White');
	$('#uiUndo').attr('disabled', true);
	$('#uiStart').attr('disabled', true);
	
	// accounts for mate in 2, 3, and 4 moves as is
	if (compositions.currentCompositionGroupID == 2 || compositions.currentCompositionGroupID == 3 || compositions.currentCompositionGroupID == 4) {
		turnsRemaining = compositions.currentCompositionGroupID;
	}
	document.getElementById('turnsRemaining').innerHTML = turnsRemaining;
}

/* undo the last turn. Returns player to the state before their last move, rolling back the most recent actions of the player and CPU.  Caribou contests
 * does not set gameIsRunning back to true if the user solved the composition
 * user cannot undo the last move if the move resulted in a terminal state
 */
function undoListener() {
	var previousState;
	var composition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
	
	isWhiteTurn = true;
	
	// restart the game if the last move ended it
	if (!gameIsRunning)
		gameIsRunning = true;
	
	if (composition.states.length >= 1) {
		if (JSON.stringify(composition.states[composition.states.length - 1]) === JSON.stringify(board)) {
			composition.states.splice(-1, 1);
		}
		
		if (composition.states.length > 0) {
			previousState = composition.states[composition.states.length - 1];
			
			if (previousState !== undefined) {		// pop used on empty array
				board = new Board(previousState);
			}
			document.getElementById('turnsRemaining').innerHTML = parseInt(document.getElementById('turnsRemaining').innerHTML) + 1;
		}
		else {
			resetListener();
		}
	}
	else {
		resetListener();
	}
	
	draw(board);
	
	// revert UI elements
	outputText('Turn: White');
	
}

/* Generate a new, currently unsolved problem in the same class as the currently selected problem type
 *
 */
function nextProblemListener() {
	var composition; 
	
	gameIsRunning = true;
	isWhiteTurn = true;
	highlightedTiles = [];										// prevent the selection of a highlighted tile as an action if the player selects a piece and then uses the next problem widget
	ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);		// remove visual presence of highlight
	
	// reset states
	if (compositions.currentCompositionID !== null) {
		composition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
		if (composition !== null)
			composition.states = [];
	}

	loadRandomComposition();
	
	// update UI elements
	outputText('Turn: White');
	$('#turn').css('visibility', 'visible');					// display which colour's turn it is to user
	$('.uiReset').attr('disabled', false);
	$('#uiUndo').attr('disabled', true);
}