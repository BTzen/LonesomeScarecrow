var isWhiteTurn = true;
var highlightedTiles = [];
var lastSelectedPiece; // for moving pieces
var lastRow, lastColumn; //
const LENGTH = 75;
const OFFSET = 10;
const PIECE_FONT = "70px Arial unicode MS";
const BLACK = "rgb(0,0,0)";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.7)";
const LIGHT_RED = "rgba(255, 0, 0, 0.25)"

//BOARD
var board = {
    __position__: [], // try not to use this outside that function

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
        ctxPiece.fillText(String.fromCharCode(piece.unicode), x, y);

        //add piece to position array
        this.__position__[column + row * 8] = piece;
        console.log('Piece drawn at ' + x + ', ' + y + ' and added at index ' + (column + row * 8));
    },
    // Move an already placed pieced from one location on the board to another 
    movePiece: function(piece, x, y) {
        //iterate through board to find which piece we're moving
        var piece;
        var i = 0;
        for (; i < LENGTH * LENGTH; i++) {
            if (piece == board.__position__[i]) {
                piece = board.__position__[i];
                board.__position__[i] = null; //remove that piece from its old index
            }
        }
        board.__position__[y + x * 8] = piece; //update array that backs the piece canvas
        var canvasPieces = document.getElementById('chesspieces');
        var ctxPiece = canvasPieces.getContext('2d');
        ctxPiece.clearRect(lastColumn * LENGTH, lastRow * LENGTH, LENGTH, LENGTH); //erase old piece
        ctxPiece.fillText(String.fromCharCode(piece.unicode), y * LENGTH, (x + 1) * LENGTH - OFFSET); //draw piece at required spot
		isWhiteTurn = !isWhiteTurn;
		
		//update turn info on HTML page
		if (isWhiteTurn) { 
			document.getElementById('turn').innerHTML = "Turn: White";}
		else {
			document.getElementById('turn').innerHTML = "Turn: Black";
		}
    },
    // Find a piece on the board using row, column indices
    getPiece: function(row, column) {
        return this.__position__[column + row * 8];
    },

    /* Find a piece on the board using pixel coordinates on the canvas
     *x the horizontal component of the 2d coordinate 
     *y the vertical component of the 2d coordinate
     */
    getPieceWithCoords: function(x, y) {
        var column = Math.floor(x / LENGTH);
        var row = Math.floor(y / LENGTH);
        //console.log(this.getPiece(rank,file));
        return (this.getPiece(row, column));
    }
};

/**
This method draws the board in a checkered patterns using two shades
of brown.

MIGHT WANT TO SEPARTE THIS, PLACEPIECES AND INIT INTO AN INITIALIZE.JS
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
/*
 * Setup board initially
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

/**
This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById("chessboard");
    canvasPieces = document.getElementById("chesspieces");
    canvasHighlight = document.getElementById("highlight");

	/* account for fact that board may not be positioned in the top left corner of the page
	 * body margin is 8px by default and border is 2
	*/
    canvasLeft = parseInt($('body').css('margin')) + parseInt($('#game').css('border-left-width'));
    canvasTop = $('#game').offset().top


    ctx = canvas.getContext('2d');
    ctxPiece = canvasPieces.getContext('2d');
    ctxHighlight = canvasHighlight.getContext('2d');

    drawBoard(canvas, ctx);
    ctxPiece.font = PIECE_FONT;

    //board stuff
    board.initializeBoard();
    placePieces(true);
    //On click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);

        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop; //alert('event.pageY - canvasTop = ' + event.pageY + '-' + canvasTop);
        chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
    });
}

/**
for every piece in the array I check if it has been clicked and do the corresponding highlighting
*/

function chessPieceListener(ctxHighlight, ctxPiece, board, x, y) { console.log(x + ' row col ' + y);
    var column = Math.floor(x / LENGTH);
    var row = Math.floor(y / LENGTH);
    var isHighlighted = null; // not null if tile selected is highlighted in someway, ie. can the piece be moved there
    var pieceRow, pieceColumn; // tracking piece info
    //console.log('row col ' + row + ' ' + column);

    //check if selected tile is highlighted
    highlightedTiles.forEach(function(item) {
        if (item[1] == row && item[2] == column)
            isHighlighted = item;
    });
    //console.log('prev. coords ' + lastRow + ' ' + lastColumn);

    //deal with movement
    if (isHighlighted) {
        
		if (isHighlighted[0] == ATK) {
			//alert(ATK);
			//remove piece at that position
			//board.__position__[isHighlighted[1] * 8 + isHighlighted[2]] = null;
			 ctxPiece.clearRect(isHighlighted[2] * LENGTH, isHighlighted[1] * LENGTH, LENGTH, LENGTH); 
		}
		//move the piece corresponding to that highlighted pattern to the selected location 
		board.movePiece(lastSelectedPiece, row, column);
        
		//update tracking variables
		isHighlighted = null;
		if (lastSelectedPiece.type == "Pawn") {
			lastSelectedPiece.hasMoved = true;
		}
        highlightedTiles = []; //reset which tiles are hightlighted each time this runs
    }
    //check if player clicked on a piece and highlight the appropriate tiles in response
    else if (lastSelectedPiece = board.getPieceWithCoords(x, y)) {
        lastRow = row;
        lastColumn = column;
        highlightedTiles = [];

        var piecePosition = (row * 8) + column;	//convert 2d indices to 1d for backing array
		var turnCheck = board.__position__[piecePosition].isWhite === isWhiteTurn;
        //check what kind of highlighting should take place based on the piece type
        if (board.__position__[piecePosition].type === "Pawn" && turnCheck) {
            //if pawn hasn't moved, highlight up to 2 spaces forward
            var forwardMoves = 2; //how many space the piece can potentially move forward
            if (lastSelectedPiece.hasMoved) {
                forwardMoves = 1;
            }
			//For some reason the rook couldn't define colourBool when passed board.__position__[piecePosition].isWhite, only left it for the pawn atm.
            pawnListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition, forwardMoves, board.__position__[piecePosition].isWhite);
        } else if (board.__position__[piecePosition].type === "Rook" && turnCheck) {
            rookListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
        } else if (board.__position__[piecePosition].type === "Knight" && turnCheck) {
            knightListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
        } else if (board.__position__[piecePosition].type === "Bishop" && turnCheck) {
            bishopListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
        } else if (board.__position__[piecePosition].type === "Queen" && turnCheck) {
            queenListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
        } else if (board.__position__[piecePosition].type === "King" && turnCheck) {
            kingListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
        }

        //DEBUG
        highlightedTiles.forEach(function(item) {
            console.log(item);
        });

    } else {	// player clicked off the piece
		highlightedTiles = [];
		isHighlighted = false;
	}
}

window.onload = init;