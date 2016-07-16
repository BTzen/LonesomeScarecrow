/* Billings, Kurylovich */

$(window).load(function() {
	document.getElementById('uiStart').addEventListener('click', startMatchListener);
	document.getElementById('uiSurrender').addEventListener('click', surrenderListener);
	

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
	// carry out necessary logic to begin playing
	isGameRunning = true;
	$('#turn').css('visibility', 'visible');		//display which colour's turn it is to user
	$('.uiSurrender').attr('disabled', false);		//
	$('.uiStart').attr('disabled', true);			//
	
	board.initialize(WHITE);	// initalize backing data structure
	draw(board);				// draw pieces on the canvas
}

function surrenderListener() {
	if (isGameRunning) {
		//reset board to initial state
		isGameRunning = false;
		$('#uiPly').attr('disabled', false);
		$('.uiSurrender').attr('disabled', true);
		$('.uiStart').attr('disabled', false);
		
		document.getElementById('highlight').getContext('2d').clearRect(0,0, LENGTH * 8, LENGTH * 8);
	}
	else {
		alert("You can't give up if you haven't even started yet!");
	}
}