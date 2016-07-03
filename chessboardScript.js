/* Billings, Kurylovich */
$(document).ready(function() {
	var canvasHighlight = document.getElementById('highlight');
	var ctxHighlight = canvasHighlight.getContext('2d');
	
});

var canvas;
var canvasPieces;
// var canvasHighlight;
var ctx;
var ctxPiece;
// var ctxHighlight;
	
var board = new Board();			// primary board used to play the game
var isWhiteTurn = true;
var isGameRunning = false;
var isCastlingLeft = false;
var isCastlingRight = false;
var isFreeplayTest = false;  		// allows user to move both white and black pieces in freeplay with highlighting for both pieces
var isCheckingBoard = false;		// used to prevent highlighting of tiles when piece actions are being determined;
var isKingInCheck = false; 			// this will get changed to true hopefully once, and after alerting the user, should switch back to false (if they can get out of check)
var highlightedTiles = [];
var allHighlightedTiles = []; 		// for looking ahead at all possible moves in a ply.
var lastSelectedTile; 				// for moving pieces
var lastRow, lastColumn; //
var initialBoardState = [];
var ctxPieces;						// the context that the pieces are drawn on - used EVERYWHERE
var pawnTwoSquaresRowCol = null;	//array to hold pos of last pawn that moved 2 squares after moving
var savedBoard = null;

//from html
var listitemID = 1;					//index used to allow remove button to reference the list element it's attached to for deletion
var occupiedTiles = [];
var isWhiteKingPlaced = false;
var isBlackKingPlaced = false;
var whiteKingData = [];
var blackKingData = [];

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
	//clear tile first
	var x = tile.column * LENGTH;
	var y = (tile.row + 1) * LENGTH - OFFSET;
	canvasPieces = document.getElementById('chesspieceCanvas');
	ctxPiece = canvasPieces.getContext('2d');
	ctxPiece.clearRect(x, y - 65, LENGTH, LENGTH);					//clear tile first; need (y - 65) to adjust the coordinates to properly position vertical pixel
	ctxPiece.fillText(String.fromCharCode(tile.piece.unicode), x, y);	//draws piece on board - coords specify bottom left corner of text
}

function draw(board) {
	ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);					//clear piece images from board
	for (var i = 0; i < board.occupiedTiles.length; i++) {
		drawPiece(board, board.occupiedTiles[i]);
	}
}

/* changes UI and gameRunning bool
 * 
*/
function startAI() {
	isGameRunning = true;
	$('#turn').css('visibility', 'visible');		//display which colour's turn it is to user
	$('.uiSurrender').attr('disabled', false);
	$('.uiStart').attr('disabled', true);
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
        chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
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

function reinit(playerIsWhite) {
	/* account for fact that board may not be positioned in the top left corner of the page
	 * border isn't counted with offset()
	*/
    canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
    canvasTop = $('#board').offset().top;

    ctx = document.getElementById('chessboard').getContext('2d');
    ctxPiece = document.getElementById('chesspieceCanvas').getContext('2d');
	ctxPiece.font = PIECE_FONT;
    ctxHighlight = document.getElementById('highlight').getContext('2d');

    //board stuff
	for (var index = 16; index < 48; index++) {
		   board.__position__[index] = null;
	}
	ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);	// remove piece images from board
    
	//play pieces
	placePiecesForMatch(isWhite);
	
	isWhiteTurn = true;	//white will always move first
	document.$('turn').innerHTML = "Turn: White";
}

/* for every piece in the array I check if it has been clicked and do the corresponding highlighting
 * ctxHighlight
 * ctxPiece
 * board
 * x the horizontal pixel of the selected piece?? NOTE need to check basic accuracy of this statement
 * y the vertical pixel ....
 */
function highlightListener(ctxHighlight, ctxPiece, board, x, y) {
	highlightedTiles = [];				// contains the list of tiles that the piece at [x,y] can end up on through movement or attack
	lastSelectedTile = null;
	chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
}

/* 
 * majority of game logic occurs here
*/
function chessPieceListener(ctxHighlight, ctxPiece, board, x, y) { 
	if (isGameRunning) {
		//lastSelectedTile = getBoardPieceWithCoords(board, x, y);
		var column = Math.floor(x / LENGTH);
		var row = Math.floor(y / LENGTH);
		var isHighlighted = null; // not null if tile selected is highlighted in someway, ie. can the piece be moved there

		//check if selected tile is highlighted
		highlightedTiles.forEach(function(currentElement) {
			if (currentElement.row == row && currentElement.column == column)
				isHighlighted = currentElement;
		});
		//console.log('prev. coords ' + lastRow + ' ' + lastColumn);

		//deal with piece movement (including attacking) - piece selected last turn; time to move!
		if (isHighlighted) {		
			if (isHighlighted.actionType === ActionType.ATTACK) { //DEBUG highlighted
				// if the attack square is empty then en passant must have just occured
				if (board.getPiece(isHighlighted.row, isHighlighted.column) === null)
					board.removePiece(row-1, column);
				else
					ctxPiece.clearRect(isHighlighted.column * LENGTH, isHighlighted.row * LENGTH, LENGTH, LENGTH); //remove old piece image
			}
			//move the piece corresponding to that highlighted pattern to the selected location 
			board.movePiece(lastSelectedTile.row, lastSelectedTile.column, row, column);
			draw(board);
			
			if (pawnTwoSquaresRowCol !== null) pawnTwoSquaresRowCol = null;
			
			// En passant check
			if (lastSelectedTile !== null && lastSelectedTile.piece.type == "Pawn") {
				//check for 2 square move
				if (Math.abs(lastRow - row) === 2) {
					lastSelectedTile.piece.hasMovedTwoSquaresLastTurn = true;	//do we ever clear this variable?
					pawnTwoSquaresRowCol = [row, column];
				}
			}
			
			// Castling check
			if (lastSelectedTile.piece.type === 'King') {
				if (isCastlingLeft) {
					//castle only if the castling square was selected ie. king was moved 2 spaces towards rook
					if (column === 2) {
						var rookToMove = board.getPiece(lastRow, 0);
						board.movePiece(rookToMove, lastRow, 3);
						ctxPiece.clearRect(0, lastRow * LENGTH, LENGTH, LENGTH);	//remove image of old piece from board
						isCastlingLeft = false;
					}
				}
				else if (isCastlingRight) {
					if (column === 6) {
						var rookToMove = board.getPiece(lastRow, 7);
						board.movePiece(rookToMove, lastRow, 5);
						ctxPiece.clearRect(7 * LENGTH, lastRow * LENGTH, LENGTH, LENGTH);	//remove image of old piece from board
						isCastlingRight = false;
					}
				}
			}
			
			// required for en passant and castling
			if (lastSelectedTile.piece.hasOwnProperty('hasMoved')) {
				lastSelectedTile.piece.hasMoved = true;
			}
		
			//update tracking variables
			isHighlighted = null;
			
			//check if it's in a promotion tile ONLY WORKS FOR WHITE
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
			highlightedTiles = []; //reset which tiles are hightlighted each time this runs
			// check whether piece is in check
			inCheck(lastSelectedTile.piece.isWhite);
			
			//AI CALL HERE
			// isWhiteTurn = !isWhiteTurn;
			
			 // if (!isWhiteTurn) { //prevent the AI from thinking it's its turn everytime. isAI will need to come in
				// //This is where you call the AI, after you make your move!
				// console.log("break one");
				// var oldBoard = jQuery.extend(true, {}, board);
				// moveAIPiece(ctxHighlight, ctxPiece, oldBoard);
				// console.log("break");
			 // }
		}
		/* logic used when a piece is first selected - before anything is highlighted for the player
		 * check if player clicked on their own piece and highlight the appropriate tiles in response
		 */
		else if (lastSelectedTile = getBoardTileWithCoords(board, x, y)) {
			// lastRow = row;
			// lastColumn = column;
			highlightedTiles = [];
			
			// only allow interaction with pieces of the correct colour
			if (lastSelectedTile !== undefined)
				var turnCheck = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; // DEBUG: currently lets you select any piece; isWhiteTurn
			//check what kind of highlighting should take place based on the piece type
			if (lastSelectedTile.piece.type === "Pawn" && turnCheck) {
				//if pawn hasn't moved, highlight up to 2 spaces forward
				let forwardMoves = (lastSelectedTile.piece.hasMoved) ? 1 : 2; //how many space the piece can potentially move forward
				pawnListener(ctxHighlight, board, row, column, forwardMoves, lastSelectedTile.piece.isWhite);
			} 
			else if (lastSelectedTile.piece.type === "Rook" && turnCheck) {
				rookListener(ctxHighlight, board, row, column);
			} 
			else if (lastSelectedTile.piece.type === "Knight" && turnCheck) {
				knightListener(ctxHighlight, board, row, column);
			} 
			else if (lastSelectedTile.piece.type === "Bishop" && turnCheck) {
				bishopListener(ctxHighlight, board, row, column);
			}
			else if (lastSelectedTile.piece.type === "Queen" && turnCheck) {
				queenListener(ctxHighlight, board, row, column);
			}
			else if (lastSelectedTile.piece.type === "King" && turnCheck) {
				kingListener(ctxHighlight, board, row, column);
			}
		} 
		else {	// player clicked off the piece
			highlightedTiles = [];
			isHighlighted = false;
		}
	} else {
		//alert("Press the 'Start' button to begin your chess adventure!");
	}
}

// function DEBUG_HIGHLIGHT() {
	// for (var row=0; row<8; row++) {
		// for (var col=0; col<8; col++) {
			// if (board.getPiece(row, col) !== null) {
				// ctxHighlight.fillStyle = "rgb(0,153,0)";
				// ctxHighlight.fillRect(col * LENGTH, row * LENGTH, LENGTH, LENGTH);
			// }
		// }
	// }
// }
window.onload = init;

