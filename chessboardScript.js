var chesspieces = [];
var currentPossibleMove;
var previousLeft;
var previousTop;
var rectangleWidth;
var rectangleTop;
var moveFlag = false;

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
                ctx.fillRect(j * 75, i * 75, 75, 75);
                white = true;
            } else {
                ctx.fillStyle = "rgb(245,222,179)";
                ctx.fillRect(j * 75, i * 75, 75, 75);
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
        //colour can always be set to black
        colour: "rgb(0,0,0)",
        //font can be hardcoded
        font: "70px Arial unicode MS",
        left: 0,
        top: 145,
        //make width and height static, since each one takes up the square
        width: 75,
        height: 75,
    });
	
	chesspieces.push({
        unicode: 9817,
        //colour can always be set to black
        colour: "rgb(0,0,0)",
        //font can be hardcoded
        font: "70px Arial unicode MS",
        left: 75,
        top: 220,
        //make width and height static, since each one takes up the square
        width: 75,
        height: 75,
    });
	
	    chesspieces.push({
        unicode: 9817,
        //colour can always be set to black
        colour: "rgb(0,0,0)",
        //font can be hardcoded
        font: "70px Arial unicode MS",
        left: 0,
        top: 295,
        //make width and height static, since each one takes up the square
        width: 75,
        height: 75,
    });

    chesspieces.forEach(function(piece) {
        var unicode = piece.unicode;
        ctx.fillStyle = piece.colour;
        ctx.font = piece.font;
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
    ctxGame = canvasPieces.getContext('2d');
	ctxHighlight = canvasHighlight.getContext('2d');
    drawBoard(canvas, ctx);
    pushPieces(ctxGame);

    //On click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;
        chesspieces.forEach(function(piece) {
            if (y > piece.top - 70 && y < piece.top - 70 + piece.height && x > piece.left && x < piece.left + piece.width) {
                //-70 because text draws from the bottom and then up, unlike rectnagles which draw down and right
                alert(piece.unicode.toString()); //maybe change this to an id, but the unicode should tell you about their movement
                if (!moveFlag) {
                    for (var i = 0; i < 2; i++) {
                        if (checkTile(piece.left, piece.top +(i*75+5), ctxGame)) {
                            ctxHighlight.fillStyle = "rgba(255, 255, 102, 0.5)";
                            ctxHighlight.fillRect(piece.left, piece.top +(i*75+5), 75, 75);
                            moveFlag = true;
                        } else {
                            break;
                        }
                    }
                }

            } else {
                ctxHighlight.clearRect(piece.left, piece.top + 5, 75, 150);
                moveFlag = false;
            }
        });

    }, false);
}

/**
This will check an area of a 75x75 pixels to see if an object is there or not.
if something is in that area return false
*/
function checkTile(x, y, context) {
	//width and height = 75
	var imgd = context.getImageData(x, y, 75,75);
	var pix = imgd.data;
	for (var i = 0, n = pix.length; i < n; i ++) {
       var test = pix[i];
	   if (test!=0) {
		   return false;
	   }
    }
    return true;
}
window.onload = init;