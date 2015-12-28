var highlightedTiles = []; //ADD
const LENGTH = 75;
const OFFSET = 5;
const PIECE_FONT = "70px Arial unicode MS";
const BLACK = "rgb(0,0,0)";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.5)";
const LIGHT_RED = "rgba(255, 0, 0, 0.25)"

//BOARD
var board = {
	 __position__: [], //NOTE: uses standard file-rank order (ie. column-row) instead of row column, so the first index is the column and the 2nd is the row

	initializeBoard: function() {
		for (var i = 0, rankNum = 64; i < rankNum; i++) {
			this.__position__.push(null);
		}
	},
	/*
	 *row expects row index
	*/
	placePiece: function(piece, row, column) { console.log(row + ' ' + column);
		var x = column * LENGTH;
		var y = (row + 1) * LENGTH - OFFSET;
		var canvasPieces = document.getElementById('chesspieces');
		var ctxPiece = canvasPieces.getContext('2d');
		ctxPiece.fillText(String.fromCharCode(piece.unicode), x, y);
		//console.log('Piece drawn at: ' + x + ' ' + y);

		//add piece to position array
		this.__position__[column + row * 8] = piece;
		console.log('Piece drawn at ' + x + ', ' + y + ' and added at index ' + (column + row * 8));
	},
	
	//get piece at specific index
	getPiece : function(rank, file) {
		return this.__position__[rank + file * 8];
	},	
	/*
	 *x the horizontal component of the 2d coordinate 
	 *y the vertical component of the 2d coordinate
	 */
	hasPiece : function(x, y) {
		var rank = Math.floor(x / 75);
		var file = Math.floor(y / 75);
		
		var tile;
		if (contents = this.getPiece(rank,file) !== null) {
			// console.log(contents);
			return true;
		}
		else 
			return false;
	}
	/*
	 *x horizontal pixel location on canvas
	 *y vertical pixel location on canvas
	 */
	// getRankAndFile : (x, y) {
		// var rank = Math.floor(x / LENGTH);
		// var file = Math.floor(y / LENGTH);
		// return [rank, file];
	// }
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
	
    board.placePiece(new Pawn(true), 0, 1);
	board.placePiece(new Pawn(true), 0, 2);
	board.placePiece(new Pawn(true), 2, 1);
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
	console.log(row + ' ' + column);
    
	if (board.hasPiece(x,y)) {	
        //console.log("youhitme");
		

        //if pawn hasn't move, highlight up to 2 spaces forward
		for (var i = 1; i <= 2; i++) {
			var piecePosition = (row * 8) + column;
			//tile in front of pawn is empty
			if (board.__position__[piecePosition + (i * 8)] === null) {
				ctxHighlight.fillStyle = MELLOW_YELLOW;
				ctxHighlight.fillRect(column * 75, (row + i) * 75, LENGTH, LENGTH);
			}
			// //next two ifs check for attack moves
            if (board.__position__[piecePosition + 9] !== null && !attackFlag1) {
                ctxHighlight.fillStyle = LIGHT_RED;
                ctxHighlight.fillRect((column + 1) * 75, (row + 1) * 75, LENGTH, LENGTH);
                attackFlag1 = true;
            }
            if (board.__position__[piecePosition + 7] !== null && !attackFlag2) {
                ctxHighlight.fillStyle = LIGHT_RED;
                ctxHighlight.fillRect((column - 1) * 75, (row + 1) * 75, LENGTH, LENGTH);
                attackFlag1 = true;
            }
		}
    }
}

//not used
// function getTileInformation() {
    // console.log(piece.unicode.toString() + ", " + piece.left + " " + piece.top);
    // //return true;
// }

window.onload = init;