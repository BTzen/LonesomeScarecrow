var chesspieces = [];
var highlightedTiles = [];	//ADD
var moveFlag = false;
const LENGTH = 75;
const OFFSET = 5;
const PIECE_FONT = "70px Arial unicode MS";
const BLACK = "rgb(0,0,0)";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.5)";


var board;
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
This method creates the chess pieces needed
pushes a chesspiece object with the position
stored
*/
function pushPieces(ctx) {
    chesspieces.push({
        unicode: 9817,
        left: 0,
        top: 145,
    });

    // chesspieces.push({
        // unicode: 9817,
        // left: 75,
        // top: 220,
    // });

    chesspieces.push({
        unicode: 9817,
        left: 0,
        top: 295,
    });

    chesspieces.forEach(function(piece) {
        var unicode = piece.unicode;
        ctx.fillStyle = BLACK;
        ctx.font = PIECE_FONT;
        ctx.fillText(String.fromCharCode(unicode), piece.left, piece.top);
    });
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
    pushPieces(ctxPiece);


    //On click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;
        chessPieceListener(ctxHighlight, ctxPiece, x, y);
		//console.log(getRankAndFile(x,y));
    }, false);
	
	// STARTS HERE
	
	board = { 
		__position__ : [],	//NOTE: uses standard file-rank order (ie. column-row) instead of row column, so the first index is the column and the 2nd is the row
		
		initializeBoard : function() {
			for (var i = 0, rankNum = 64; i < rankNum; i++) {
					this.__position__.push(null);
				}
		},
		
		placePiece : function(piece, rank, file) {
			var x = rank * LENGTH;
			var y = (file + 1) * LENGTH - OFFSET;
			var canvasPieces = document.getElementById('chesspieces');
			var ctxPiece = canvasPieces.getContext('2d');
			ctxPiece.fillText(String.fromCharCode(piece.unicode), x, y);
			console.log(x + ' ' + y);
			
			//add piece to position array
			this.__position__[rank + file * 8] = piece;
			console.log(rank + file * 8);
		},
		
		getPiece: function(rank, file) {
			return this.__position__[rank + file * 8];
		}
	};
	board.initializeBoard();
	window.addEventListener('load', board.placePiece(new Pawn(true), 1, 2));
}

/**
for every piece in the array I check if it has been clicked and do the corresponding highlighting
*/
function chessPieceListener(ctxHighlight, ctxPiece, x, y) {
    //chesspieces.forEach(function(piece) {
	for (var i = 0; i < chesspieces.length; i++) {
		var piece = chesspieces[i];
        if (y > piece.top - LENGTH + OFFSET && y < piece.top + OFFSET && x > piece.left && x < piece.left + LENGTH) {
            //-70 because text draws from the bottom and then up, unlike rectnagles which draw down and right
            //alert(piece.unicode.toString()); //we want to get an is white property
            if (!moveFlag) {
				//if pawn hasn't move, highlight up to 2 spaces forward
                for (var i = 0; i < 2; i++) {
                    if (checkTile(piece.left, piece.top + (i * LENGTH + OFFSET), ctxPiece)) {
                        ctxHighlight.fillStyle = MELLOW_YELLOW;
                        //+5 is the offset to make the position of the piece look more natural (aka doesn't touch bottom)
                        ctxHighlight.fillRect(piece.left, piece.top + (i * LENGTH + OFFSET), LENGTH, LENGTH);
						moveFlag = true;
						
						highlightedTiles.push();	//push the tile at those coords into the list
                    } 
                }
            }
			break;
        } else {
            //150 for now, needs to be changed to some variabled linked to the number in tyhe for loop above
            ctxHighlight.clearRect(piece.left, piece.top + OFFSET, LENGTH, 150);
            moveFlag = false;
        }
	}
    //});
}

/**
This will check an area of a LENGTHxLENGTH pixels to see if an object is there or not.
if something is in that area return false
*/
function checkTile(x, y, context) {
    //width and height = LENGTH
    var imgd = context.getImageData(x, y, LENGTH, LENGTH);
    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i++) {
        var test = pix[i];
        if (test != 0) {
            return false;
        }
    }
    return true;
}
// 27/12 MATT

//create 8x8 board
// for (var i = 0, rankNum = 8; i < rankNum; rankNum++) {
	// for (var j = 0, fileNum = 8; j < fileNum; fileNum++) {
		// board.push[i][j] = null;
	// }
// }

/*
 *x horizontal pixel location on canvas
 *y vertical pixel location on canvas
*/
function getRankAndFile(x,y) {
	var rank = Math.floor(x / LENGTH); 
	var file = Math.floor(y / LENGTH);
	return [rank, file];
}

window.onload = init;