var highlightedTiles = [];
var lastSelectedPiece;		// for moving pieces
var lastRow, lastColumn;	//
const LENGTH = 75;
const OFFSET = 5;
const PIECE_FONT = "70px Arial unicode MS";
const BLACK = "rgb(0,0,0)";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.5)";
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
	movePiece : function(piece, x, y) {
		//iterate through board to find which piece we're moving
		var piece;
		var i = 0;
		for (; i < LENGTH * LENGTH; i++) {
			if (piece == board.__position__[i]) {
				piece = board.__position__[i];
				board.__position__[i] = null;	//remove that piece from its old index
			}
		}
		board.__position__[y + x * 8] = piece;	//update array that backs the piece canvas
		var canvasPieces = document.getElementById('chesspieces');
		var ctxPiece = canvasPieces.getContext('2d');
		ctxPiece.clearRect(lastColumn * 75, lastRow * 75, LENGTH, LENGTH); //erase old piece
		ctxPiece.fillText(String.fromCharCode(piece.unicode), y * 75, (x + 1) * 75 - 5);	//draw piece at required spot
	},
	// Find a piece on the board using row, column indices
	getPiece : function(row, column) {
		return this.__position__[column + row * 8];
	},	
	
	/* Find a piece on the board using pixel coordinates on the canvas
	 *x the horizontal component of the 2d coordinate 
	 *y the vertical component of the 2d coordinate
	 */
	getPieceWithCoords : function(x, y) {
		var column = Math.floor(x / 75);
		var row = Math.floor(y / 75);
		//console.log(this.getPiece(rank,file));
		return(this.getPiece(row,column));
	}
};

/**
This method draws the board in a checkered patterns using two shades
of brown.
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
/**
This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById("chessboard");
    canvasPieces = document.getElementById("chesspieces");
    canvasHighlight = document.getElementById("highlight");

    canvasLeft = canvas.offsetLeft;
    canvasTop = canvas.offsetTop;

    ctx = canvas.getContext('2d');
    ctxPiece = canvasPieces.getContext('2d');
    ctxHighlight = canvasHighlight.getContext('2d');

    drawBoard(canvas, ctx);
    ctxPiece.font = PIECE_FONT;

	//board stuff
    board.initializeBoard();
	
    board.placePiece(new Pawn(false), 0, 1);
	board.placePiece(new Pawn(true), 0, 2);
	board.placePiece(new Pawn(false), 2, 1);
    board.placePiece(new Pawn(true), 1, 0);

    //On click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);
        var index = 0;	//index of the board array
        
		var x = event.pageX - canvasLeft,
			y = event.pageY - canvasTop;
			chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
    });
}

/**
for every piece in the array I check if it has been clicked and do the corresponding highlighting
*/

function chessPieceListener(ctxHighlight, ctxPiece, board, x, y) {
    var attackFlag1 = false;
    var attackFlag2 = false;
	
	var column = Math.floor(x/75);
	var row = Math.floor(y/75);
	var isHighlighted = null;	// not null if tile selected is highlighted in someway, ie. can the piece be moved there
	var pieceRow, pieceColumn;	// tracking piece info
	//console.log('row col ' + row + ' ' + column);
	
	//check if selected tile is highlighted
	highlightedTiles.forEach(function (item) {
		if (item[1] == row && item[2] == column)
			isHighlighted = item;
	});
	console.log('prev. coords ' + lastRow + ' ' + lastColumn);
	
	//deal with movement
	if (isHighlighted) {
		//move the piece corresponding to that highlighted pattern to the selected location 
		board.movePiece(lastSelectedPiece, row, column);
		isHighlighted = null;
		lastSelectedPiece.hasMoved = true;
		highlightedTiles = [];	//reset which tiles are hightlighted each time this runs
	}
	//check if player clicked on a piece and highlight the appropriate tiles in response
	else if (lastSelectedPiece = board.getPieceWithCoords(x,y)) { 
		lastRow = row;
		lastColumn = column;
		highlightedTiles = [];	
        
		//if pawn hasn't moved, highlight up to 2 spaces forward
		var forwardMoves = 2;	//how many space the piece can potentially move forward
		if (lastSelectedPiece.hasMoved) { forwardMoves = 1; }
		
		for (var i = 1; i <= forwardMoves; i++) { //alert('p');
			//board represented as 1D array so the row # must be multiplied by the # of tiles in a row
			var piecePosition = (row * 8) + column;
			//tile in front of pawn is empty
			if (board.__position__[piecePosition + (i * 8)] === null) {
				ctxHighlight.fillStyle = MELLOW_YELLOW;
				ctxHighlight.fillRect(column * 75, (row + i) * 75, LENGTH, LENGTH);
				highlightedTiles.push(["move",row + i,column]);
			}
			// //next two ifs check for attack moves
            if (board.__position__[piecePosition + 9] !== null && !attackFlag1) {
                ctxHighlight.fillStyle = LIGHT_RED;
                ctxHighlight.fillRect((column + 1) * 75, (row + 1) * 75, LENGTH, LENGTH);
                attackFlag1 = true;
				highlightedTiles.push(["attack",row + 1, column + 1]);
            }
            if (board.__position__[piecePosition + 7] !== null && !attackFlag2) {
                ctxHighlight.fillStyle = LIGHT_RED;
                ctxHighlight.fillRect((column - 1) * 75, (row + 1) * 75, LENGTH, LENGTH);
                attackFlag2 = true;
				highlightedTiles.push(["attack",row + 1,column - 1]);
            }
		}
		
		//DEBUG
		highlightedTiles.forEach(function (item) {
			console.log(item);
		});

    }
}

window.onload = init;