var isWhiteTurn = true;
var isGameRunning = false;
var isCastlingLeft = false;
var isCastlingRight = false;
var isFreeplayTest = false;		//allows user to move both white and black pieces in freeplay with highlighting for both pieces
var isCheckingBoard = false;
var highlightedTiles = [];
var allHighlightedTiles = []; //for looking ahead at all possible moves in a ply.
var lastSelectedPiece; // for moving pieces
var lastRow, lastColumn; //
var initialBoardState = [];
var ctxPieces;// = document.getElementById('chesspieces').getContext('2d');	//the context that the pieces are drawn on - used EVERYWHERE
var pawnTwoSquaresRowCol = null;	//array to hold pos of last pawn that moved 2 squares after moving

const LENGTH = 75;
const OFFSET = 10;
const PIECE_FONT = "70px Arial unicode MS";
const BLACK = "rgb(0,0,0)";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.7)";
const LIGHT_RED = "rgba(255, 0, 0, 0.25)"
const ATK = "attack";
const MOVE = "move"; 

//BOARD
var board = {
    __position__: [], // try not to use this outside of board functions

    initializeBoard: function() {
        for (var i = 0, rankNum = 64; i < rankNum; i++) {
            this.__position__.push(null);
        }
    },

    /* Put a piece in its initial position on the board
     *row expects row index
     */
    placePiece: function(piece, row, column) {
        var x = column * LENGTH;
        var y = (row + 1) * LENGTH - OFFSET;
        var canvasPieces = document.getElementById('chesspieces');
        var ctxPiece = canvasPieces.getContext('2d');
        ctxPiece.fillText(String.fromCharCode(piece.unicode), x, y);	//draws piece on board
		
        //add piece to position array
        this.__position__[column + row * 8] = piece;
        //console.log('Piece drawn at ' + x + ', ' + y + ' and added at index ' + (column + row * 8));
    },
    // Move an already placed pieced from one location on the board to another 
    movePiece: function(piece, row, column) {
        //iterate through board to find which piece we're moving
        var temp;
        var i = 0;
        for (; i < 64; i++) {
            if (piece == this.__position__[i]) {
                temp = this.__position__[i];
                this.__position__[i] = null; //remove that piece from its old index
				break;
            }
        }
        this.__position__[column + row * 8] = piece; //update array that backs the piece canvas
			var canvasPieces = document.getElementById('chesspieces');
			var ctxPiece = canvasPieces.getContext('2d');
			ctxPiece.clearRect(lastColumn * LENGTH, lastRow * LENGTH, LENGTH, LENGTH); //erase old piece
			ctxPiece.fillText(String.fromCharCode(piece.unicode), column * LENGTH, (row + 1) * LENGTH - OFFSET); //draw piece at required spot
<<<<<<< .merge_file_a01384
		    if (!isFreeplayTest)
				isWhiteTurn = !isWhiteTurn;
=======
// <<<<<<< HEAD
		    isWhiteTurn = !isWhiteTurn;
// =======
			// isWhiteTurn = !isWhiteTurn;
// >>>>>>> b9717ff764dbd192ddf16adedcc65f68e223c969
		}
>>>>>>> .merge_file_a05716
		
		//update turn info on HTML page
		if (isWhiteTurn) { 
			document.getElementById('turn').innerHTML = "Turn: White";}
		else {
			document.getElementById('turn').innerHTML = "Turn: Black";
		}
    },
	
	/* Convenience method to remove the image and update the array on piece removal
	*/
	removePiece(row, column) {
		//ctxPiece = document.getElementById('chesspieces').getContext('2d');
		this.__position__[column + row * 8] = null;	//remove from data structure
		ctxPiece.clearRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);	//remove image
	},
	
	clear(initialRow, initialColumn, row, column) {
		document.getElementById('chesspieces').getContext('2d').clearRect(initialColumn * LENGTH, initialRow * LENGTH, column * LENGTH, row * LENGTH);
		//remove list items
		$('#freeplayPieces ol').empty();
		//clean the backing data structure
		for (var i = 0; i < 64; i++) {
			this.__position__[i] = null;
		}
	},
    // Find a piece on the board using row, column indices
    getPiece: function(row, column) {
		if (row > -1 && row < 8 && column > -1 && column < 0) {
			//console.log("getPiece(): arguments exceed bounds of board");
			return null;
		}
		else {
			return this.__position__[column + row * 8];
		}
    },

    /* Find a piece on the board using pixel coordinates on the canvas
     *x the horizontal component of the 2d coordinate 
     *y the vertical component of the 2d coordinate
     */
    getPieceWithCoords: function(x, y) {
        var column = Math.floor(x / LENGTH);
        var row = Math.floor(y / LENGTH);
        return (this.__position__[column + row * 8]);
    },
	
	/*
	print: function() {
		for (var i = 0; i < 64; i++){
<<<<<<< HEAD
<<<<<<< 6dd444307fed0977f66ff8d2888a58e65a696667
			if (this.__position__[i] !== null && board.__position__[i].type === "Rook") {
				console.log(board.__position__[i]);
=======
			if (this.__position__[i] !== null && this.__position__[i].type === "Rook") {
				console.log(this.__position__[i]);
>>>>>>> minor tweaks
=======
			if (this.__position__[i] !== null && this.__position__[i].type === "Rook") {
				console.log(this.__position__[i]);
>>>>>>> b9717ff764dbd192ddf16adedcc65f68e223c969
			}
		}
	}
	*/
};

/* Draws the actual representation of the physical board
This method draws the board in a checkered patterns using two shades
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

/* Adds all the pieces to the board
*/
function placePieces(playerIsWhite) {
    if (playerIsWhite) {
		// WHITE
		board.placePiece(new Rook(true), 7, 0);
		board.placePiece(new Knight(true), 7, 1);
		board.placePiece(new Bishop(true), 7, 2);
		board.placePiece(new Queen(true), 7, 3);
		board.placePiece(new King(true), 7, 4);
		board.placePiece(new Bishop(true), 7, 5);
		board.placePiece(new Knight(true), 7, 6);
		board.placePiece(new Rook(true), 7, 7);
		board.placePiece(new Pawn(true), 6, 0);
		board.placePiece(new Pawn(true), 6, 1);
		board.placePiece(new Pawn(true), 6, 2);
		board.placePiece(new Pawn(true), 6, 3);
		board.placePiece(new Pawn(true), 6, 4);
		board.placePiece(new Pawn(true), 6, 5);
		board.placePiece(new Pawn(true), 6, 6);
		board.placePiece(new Pawn(true), 6, 7);
		
		// BLACK
		board.placePiece(new Rook(false), 0, 0);
		board.placePiece(new Knight(false), 0, 1);
		board.placePiece(new Bishop(false), 0, 2);
		board.placePiece(new Queen(false), 0, 3);
		board.placePiece(new King(false), 0, 4);
		board.placePiece(new Bishop(false), 0, 5);
		board.placePiece(new Knight(false), 0, 6);
		board.placePiece(new Rook(false), 0, 7);
		board.placePiece(new Pawn(false), 1, 0);
		board.placePiece(new Pawn(false), 1, 1);
		board.placePiece(new Pawn(false), 1, 2);
		board.placePiece(new Pawn(false), 1, 3);
		board.placePiece(new Pawn(false), 1, 4);
		board.placePiece(new Pawn(false), 1, 5);
		board.placePiece(new Pawn(false), 1, 6);
		board.placePiece(new Pawn(false), 1, 7);
	}
}

/* This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById("chessboard");
    canvasPieces = document.getElementById("chesspieces");
    canvasHighlight = document.getElementById("highlight");

	/* account for fact that board may not be positioned in the top left corner of the page
	 * border isn't counted with offset()
	*/
    canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
    canvasTop = $('#board').offset().top;

    ctx = canvas.getContext('2d');
    ctxPiece = canvasPieces.getContext('2d');
	ctxPiece.font = PIECE_FONT;
    ctxHighlight = canvasHighlight.getContext('2d');

    drawBoard(canvas, ctx);

    //board stuff
    board.initializeBoard();
    
    //On click event will check what piece has been clicked
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

    ctx = document.getElementById("chessboard").getContext('2d');
    ctxPiece = document.getElementById("chesspieces").getContext('2d');
	ctxPiece.font = PIECE_FONT;
    ctxHighlight = document.getElementById("highlight").getContext('2d');

    //board stuff
	for (var index = 16; index < 48; index++) {
		   board.__position__[index] = null;
	}
	ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);	// remove piece images from board
    placePieces(playerIsWhite);
	
	isWhiteTurn = true;	//white will always move first
	document.getElementById('turn').innerHTML = "Turn: White";
}
/**
for every piece in the array I check if it has been clicked and do the corresponding highlighting
*/
function fakeChessPieceListener(ctxHighlight, ctxPiece, board, x, y) {
	highlightedTiles = [];//reset
	lastSelectedPiece = null;
	chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
}

function chessPieceListener(ctxHighlight, ctxPiece, board, x, y) { 
	DEBUG_HIGHLIGHT();
	//console.log(x + ' row col ' + y); //debug
	if (isGameRunning) {
		var column = Math.floor(x / LENGTH);
		var row = Math.floor(y / LENGTH);
		var isHighlighted = null; // not null if tile selected is highlighted in someway, ie. can the piece be moved there

		//check if selected tile is highlighted
		highlightedTiles.forEach(function(item) {
			if (item[1] == row && item[2] == column)
				isHighlighted = item;
		});
		//console.log('prev. coords ' + lastRow + ' ' + lastColumn);

		//deal with movement - piece selected last turn; time to move!
		if (isHighlighted) {		
			if (isHighlighted[0] == ATK) {
				// if the attack square is empty then en passant must have just occured
				if (board.getPiece(isHighlighted[1], isHighlighted[2]) === null)
					board.removePiece(row-1, column);
				else
					ctxPiece.clearRect(isHighlighted[2] * LENGTH, isHighlighted[1] * LENGTH, LENGTH, LENGTH); //remove old piece image
			}
			//move the piece corresponding to that highlighted pattern to the selected location 
			board.movePiece(lastSelectedPiece, row, column);
			
			if (pawnTwoSquaresRowCol !== null) pawnTwoSquaresRowCol = null;
			// en passant check
			if (lastSelectedPiece !== null && lastSelectedPiece.type == "Pawn") {
				//check for 2 square move
				if (Math.abs(lastRow - row) === 2) {
					lastSelectedPiece.hasMovedTwoSquaresLastTurn = true;
					pawnTwoSquaresRowCol = [row, column];
				}
			}
			
			// Castling check
			if (lastSelectedPiece.type === "King") {
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
			
			//works for rooks at least
			if (lastSelectedPiece.type === "Pawn" || lastSelectedPiece.type === "Rook" || lastSelectedPiece.type === "King") {
				lastSelectedPiece.hasMoved = true;
			}
			
			//update tracking variables
			isHighlighted = null;
			if (lastSelectedPiece.type === "Pawn") {
				lastSelectedPiece.hasMoved = true;
				
				//check if it's in a promotion tile ONLY WORKS FOR WHITE
				if (lastSelectedPiece.isWhite) {
					if (row == 0) {
					//call promotion fn
						$('#promotion')
							.data( {isWhite: true, row: row, column: column} )	//2nd 'row' is the variable
							.dialog({
							modal: true,
							title: "Promote piece"
						});
					}
				}
			}
			highlightedTiles = []; //reset which tiles are hightlighted each time this runs
			//CHECK INCHECK HERE
			inCheck(lastSelectedPiece.isWhite);
			//AI CALL HERE
<<<<<<< .merge_file_a01384
=======
// <<<<<<< HEAD
			 if (!isWhiteTurn) { //prevent the AI from thinking it's its turn everytime. isAI will need to come in
				// //This is where you call the AI, after you make your move!
				 console.log("break one");
				 var oldBoard = jQuery.extend(true, {}, board);
				 moveAIPiece(ctxHighlight, ctxPiece, oldBoard);
				 console.log("break");
			 }
// =======
			// if (!isWhiteTurn) { //prevent the AI from thinking it's its turn everytime. isAI will need to come in
				// //This is where you call the AI, after you make your move!
				// moveAIPiece(ctxHighlight, ctxPiece, board);
			// }
// >>>>>>> b9717ff764dbd192ddf16adedcc65f68e223c969
>>>>>>> .merge_file_a05716
		}
		//check if player clicked on a piece and highlight the appropriate tiles in response
		else if (lastSelectedPiece = board.getPieceWithCoords(x, y)) {
			lastRow = row;
			lastColumn = column;
			highlightedTiles = [];
			
			var turnCheck = lastSelectedPiece.isWhite === isWhiteTurn;
			//check what kind of highlighting should take place based on the piece type
			if (lastSelectedPiece.type === "Pawn" && turnCheck) {
				//if pawn hasn't moved, highlight up to 2 spaces forward
				var forwardMoves = 2; //how many space the piece can potentially move forward
				if (lastSelectedPiece.hasMoved) {
					forwardMoves = 1;
				}
				pawnListener(ctxHighlight, board, row, column, forwardMoves, lastSelectedPiece.isWhite);
			} else if (lastSelectedPiece.type === "Rook" && turnCheck) {
				rookListener(ctxHighlight, board, row, column);
			} else if (lastSelectedPiece.type === "Knight" && turnCheck) {
				knightListener(ctxHighlight, board, row, column);
			} else if (lastSelectedPiece.type === "Bishop" && turnCheck) {
				bishopListener(ctxHighlight, board, row, column);
			} else if (lastSelectedPiece.type === "Queen" && turnCheck) {
				queenListener(ctxHighlight, board, row, column);
			} else if (lastSelectedPiece.type === "King" && turnCheck) {
				kingListener(ctxHighlight, board, row, column);
			}

			//DEBUG
			/*
			highlightedTiles.forEach(function(item) {
				console.log(item);
			});
*/
		} else {	// player clicked off the piece
			highlightedTiles = [];
			isHighlighted = false;
		}
	} else {
		alert("Press the 'Start' button to begin your chess adventure!");
	}
}

function DEBUG_HIGHLIGHT() {
	for (var row=0; row<8; row++) {
		for (var col=0; col<8; col++) {
			if (board.getPiece(row, col) !== null) {
				ctxHighlight.fillStyle = "rgb(0,153,0)";
				ctxHighlight.fillRect(col * LENGTH, row * LENGTH, LENGTH, LENGTH);
			}
		}
	}
}
window.onload = init;