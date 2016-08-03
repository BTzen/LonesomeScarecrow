/* Billings, M., Kurylovich, A. */

// assign listeners
$(window).load(function() {
	document.getElementById('uiStart').addEventListener('click', startMatchListener);
	document.getElementById('uiReset').addEventListener('click', resetListener);
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

/* begin a match against AI on "Start" button click
 *
*/
function startMatchListener() {
	gameIsRunning = true;
	document.getElementById('turn').innerHTML = 'Turn: White';
	$('#turn').css('visibility', 'visible');					// display which colour's turn it is to user
	$('.uiReset').attr('disabled', false);			
	$('.uiStart').attr('disabled', true);			

	board.initialize();			// initalize backing data structure
	draw(board);				// draw pieces on the canvas
}

/* reset the board to its initial state
 *
 */
function resetListener() {
	if (gameIsRunning) {
		gameIsRunning = false;
	}
	
	isWhiteTurn = true;
	board.initialize();
	draw(board);
	ctxHighlight.clearRect(0,0, LENGTH * 8, LENGTH * 8);
	$('#actionListBody').empty();							// clear action log
	$('#uiPly').attr('disabled', false);
	$('.uiReset').attr('disabled', true);
	$('.uiStart').attr('disabled', false);
	$('#turn').css({'visibility':'hidden'});
}