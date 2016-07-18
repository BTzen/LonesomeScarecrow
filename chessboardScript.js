/* Billings, Kurylovich */
$(document).ready(function() {
	var canvasHighlight = document.getElementById('highlight');
	var canvasPieces = document.getElementById('chesspieceCanvas');
	var ctxHighlight = canvasHighlight.getContext('2d');
	var ctxPiece = canvasPieces.getContext('2d');				// the context that the pieces are drawn on - used EVERYWHERE
});

var canvas;
// var canvasPieces;
var ctx;
// var ctxPiece;
	
var board = new Board();			// primary board used to play the game
var isWhiteTurn = true;			// change back to TRUE; changed to FALSE for debugging minimax
var gameIsRunning = false;			// true when the player is playing a game
var isCheckingBoard = false;		// used to prevent highlighting of tiles when piece actions are being determined;
var highlightedTiles = [];
var lastSelectedTile; 				// for moving pieces
var lastRowSelected, lastColumnSelected; //
var pawnThatMovedTwoLastTurn = null;	// pawn that moved two tiles on the last turn		

/* Find a piece on the board using pixel coordinates on the canvas
 * x the horizontal component of the 2d coordinate 
 * y the vertical component of the 2d coordinate
*/
function getBoardTileWithCoords(board, x, y) {
	let col = Math.floor(x / LENGTH);
	let row = Math.floor(y / LENGTH);
	let result = board.getTile(row, col);
	console.log(result);
	return result;
}
	
/* Draws the visual representation of the physical board in a checkered patterns using two shades
of brown.

MIGHT WANT TO SEPARATE THIS, PLACEPIECES AND INIT INTO AN INITIALIZE.JS
*/
function drawBoard(canvas, ctx) {
    var white = true;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (!white) {
                ctx.fillStyle = "rgb(160,82,45)";
                ctx.fillRect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
                white = true;
            } else {
                ctx.fillStyle = "rgb(245,222,179)";
                ctx.fillRect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
                white = false;
            }
        }
        white = !white;
    }
}

/* Draws a piece from the backing data structure to the board
 * board the desired board to pull from
 * row expects row index (ie. 0-7)
 */
function drawPiece(board, tile) {
	var x = tile.column * LENGTH;
	var y = (tile.row + 1) * LENGTH - OFFSET;
	ctxPiece.clearRect(x, y - 65, LENGTH, LENGTH);						//clear tile first; need (y - 65) to adjust the coordinates to properly position vertical pixel
	ctxPiece.fillText(String.fromCharCode(tile.piece.unicode), x, y);	//draws piece on board - coords specify bottom left corner of text
}

/* Draws pieces on the board in the positions reflected by the backing data structure
 *
 */
function draw(board) {
	ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);					//clear piece images from board
	for (var i = 0; i < board.occupiedTiles.length; i++) {
		drawPiece(board, board.occupiedTiles[i]);
	}
}

/* This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById('chessboard');
    canvasPieces = document.getElementById('chesspieceCanvas');
    canvasHighlight = document.getElementById('highlight');
	ctx = canvas.getContext('2d');
    ctxPiece = canvasPieces.getContext('2d');
	ctxPiece.font = PIECE_FONT;
    ctxHighlight = canvasHighlight.getContext('2d');

	/* accounts for fact that board may not be positioned in the top left corner of the page
	 * border isn't counted with offset()
	*/
    var canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
    var canvasTop = $('#board').offset().top;

    drawBoard(canvas, ctx);
	
	// click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);

        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop; //alert('event.pageX - canvasLeft = ' + event.pageX + '-' + canvasLeft);
        gameLoop(x, y);
    });
}

/* Promote a piece to another
 * created outside of board because it doesn't feel like the board stuff should contain the rules (ie. encapsulation)
*/
function promotePiece(piece) {
	//display promotion choice to user
	$('#promotionWindow').css('display', 'initial');
	//replace existing piece with a piece of that type
}

//freeplay?
// function reinit(playerIsWhite) {
	// /* account for fact that board may not be positioned in the top left corner of the page
	 // * border isn't counted with offset()
	// */
    // canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
    // canvasTop = $('#board').offset().top;

    // ctx = document.getElementById('chessboard').getContext('2d');
    // ctxPiece = document.getElementById('chesspieceCanvas').getContext('2d');
	// ctxPiece.font = PIECE_FONT;
    // ctxHighlight = document.getElementById('highlight').getContext('2d');

    // //board stuff
	// for (var index = 16; index < 48; index++) {
		   // board.__position__[index] = null;
	// }
	// ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);	// remove piece images from board
    
	// //play pieces
	// // placePiecesForMatch(isWhite);
	
	// isWhiteTurn = true;	//white will always move first
	// document.$('turn').innerHTML = "Turn: White";
// }

/* Responsible for creating 'highlighted tiles' which contain all legal moves for a given piece. Logic for displaying this information to the user is handled separately from this method.
 * ctxHighlight
 * ctxPiece
 * board
 * x the horizontal pixel of the selected piece?? NOTE need to check basic accuracy of this statement
 * y the vertical pixel ....
 */
function highlightListener(ctxHighlight, ctxPiece, board, x, y) {
	highlightedTiles = [];				// will contain the list of tiles that the piece found using coordinates (x,y) can end up on through movement or attack
	lastSelectedTile = null;
	gameLoop(x, y);
}

/* 
 * x the x coordinate of the user's click
 * y the y coordinate of the user's click
*/
function gameLoop(x, y) { 
	if (gameIsRunning) {
		playerTurn(x, y);
		
		if (!isWhiteTurn) {
			setTimeout(function() {		//setTimeout is necessary to draw the player move before drawing the CPUs move
				//if (!isWhiteTurn) 
				CPUTurn(x, y);
			}, 20);
		}
	}
	// game is over
	if (!gameIsRunning) {
		board.initialize(WHITE);
	}
}

/* code supporting the player's interaction with the game
 *
 */
function playerTurn(x, y) {
	var column = Math.floor(x / LENGTH);		// find out the intersection of the row and column using the coordinates of where the player clicked
	var row = Math.floor(y / LENGTH);
	var highlightedTile = null; // not null if tile selected is highlighted in someway, ie. can the piece be moved there

	//check if selected tile is highlighted
	highlightedTiles.forEach(function(currentTile) {
		if (currentTile.row == row && currentTile.column == column)
			highlightedTile = currentTile;
	});
	//console.log('prev. coords ' + lastRowSelected + ' ' + lastColumnSelected);

	//deal with piece movement (including attacking) - piece selected last turn; time to move!
	if (highlightedTile) {		
		if (highlightedTile.actionType === ActionType.ATTACK) { 
			// if the attack square is empty then en passant must have just occured
			// NOTE only works for white
			if (board.getPiece(highlightedTile.row, highlightedTile.column) === null)
				board.removePiece(row + 1, column);
			else
				ctxPiece.clearRect(highlightedTile.column * LENGTH, highlightedTile.row * LENGTH, LENGTH, LENGTH); //remove old piece image
		}
		
		
		if (pawnThatMovedTwoLastTurn !== null) pawnThatMovedTwoLastTurn = null;
		
		// En passant check
		if (lastSelectedTile !== null && lastSelectedTile.piece.type == "Pawn") {
			//check for 2 square move
			if (Math.abs(lastSelectedTile.row - row) == 2) {
				pawnThatMovedTwoLastTurn = lastSelectedTile.piece;
			}
		}
		
		// castling logic
		if (lastSelectedTile.piece.type == 'King') {
			//move the rook to the appropriate position
			if (Math.abs(lastSelectedTile.column - highlightedTile.column) == 2) {
				let rookTile = null;
				if (lastSelectedTile.column < highlightedTile.column) {		// castle right
					rookTile = board.getPiece(lastSelectedTile.row, 7);
					board.movePiece(lastSelectedTile.row, 7, lastSelectedTile.row, highlightedTile.column - 1);
				}
				else {
					rookTile = board.getPiece(lastSelectedTile.row, 0);		// castle left
					board.movePiece(lastSelectedTile.row, 0, lastSelectedTile.row, highlightedTile.column + 1);
				}
			}
		}
		
		//move the piece corresponding to that highlighted pattern to the selected location 
		board.movePiece(lastSelectedTile.row, lastSelectedTile.column, row, column);
		draw(board);
		
		// required for en passant and castling
		if (lastSelectedTile.piece.hasOwnProperty('hasMoved') && lastSelectedTile.piece.hasMoved == false) {
			lastSelectedTile.piece.hasMoved = true;
		}
	
		//update tracking variables
		highlightedTile = null;
		
		//check if it's in a promotion tile; only works for white pieces
		if (lastSelectedTile.piece.isWhite && lastSelectedTile.piece.type === 'Pawn') {
			if (row == 0) {
				//call promotion fn
				$('#promotion')
					.data( {isWhite: true, row: row, column: column} )	// 2nd 'row' is the variable
					.dialog({
						dialogClass: "no-close",						// remove close button
						modal: true,
						title: "Promote piece"
					});
			}
		}
		// }
		highlightedTiles = []; 						//reset which tiles are hightlighted each time this runs
		toggleTurn();
	}
	/* logic used when a piece is first selected - before anything is highlighted for the player
	 * check if player clicked on their own piece and highlight the appropriate tiles in response
	 */
	else if (lastSelectedTile = getBoardTileWithCoords(board, x, y)) {
		var lastSelectedPiece = lastSelectedTile.piece;
		highlightedTiles = [];
		
		// only allow interaction with pieces of the correct colour
		if (lastSelectedTile !== undefined)
			var isPlayerTurn = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; // DEBUG: currently lets you select any piece
		
		
		// only allow King to be selected if King is in check
		if (lastSelectedPiece.isWhite == true && inCheck(whiteKingTile)) {	// TODO remove isWhite condition once testing is done
			if (lastSelectedPiece.type == 'King') {
				lastSelectedPiece.getStandardMoves(board, true, lastSelectedTile.row, lastSelectedTile.column);
			}
		} 
		else {	// highlight the appropriate tiles
			lastSelectedPiece.getStandardMoves(board, true, lastSelectedTile.row, lastSelectedTile.column); 
			
			if (lastSelectedPiece.type == 'Pawn')
				lastSelectedPiece.getSpecialMoves(board, true, lastSelectedTile.row, lastSelectedTile.column);
			// check for castling options
			else if (lastSelectedPiece.type == 'King') {
				// check right
				let castlingRookTile = board.getTile(lastSelectedTile.row, 7);
				if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile))		
					fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column + 2));	
				// check left
				castlingRookTile = board.getTile(lastSelectedTile.row, 0);
				if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile))		
					fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column - 2));	
			}
		}
	} 
	else {	// player clicked off the piece
		highlightedTiles = [];
		highlightedTile = false;
	}
}

/* code controlling AI action
 * TODO support 
 */
function CPUTurn(x, y) {
	var nextAIAction = minimax(board, BLACK);
	if (nextAIAction !== null) {
		var agentTile = board.getPositionOfPiece(nextAIAction.agent);
		board.movePiece(agentTile.row, agentTile.column, nextAIAction.row, nextAIAction.column);
		draw(board);
	}
	// AI caught in checkmate
	else {
		alert("Success! You won!");
		gameIsRunning = false;
		
	}
	toggleTurn();
	// DEBUG
	// console.log('next move will move ' + nextAIAction.agent + ' from [' + agentTile.row + ', ' + agentTile.column + '] to ['
		// + nextAIAction.row + ', ' + nextAIAction.column + ']'); 
}

/* resets DS to initial state and draws it to the argument board
 * board the board which will be drawn to the canvas
 */
function resetBoard(board) {
	board.initialize();
	draw(board);
}

function toggleTurn() {
	isWhiteTurn = !isWhiteTurn;
	var turnText = (isWhiteTurn) ? 'Turn: White' : 'Turn: Black';
	document.getElementById('turn').innerHTML = turnText;
}
window.onload = init;