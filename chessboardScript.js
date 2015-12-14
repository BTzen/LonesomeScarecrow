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
                ctx.fillStyle = "rgb(245,222,179)";
                ctx.fillRect(j * 75, i * 75, 75, 75);
                white = true;
            } else {
                ctx.fillStyle = "rgb(160,82,45)";
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
        c: 9817,
        colour: "rgb(0,0,0)",
        font: "70px Arial unicode MS",
        left: 0,
        top: 145,
        width: 75,
        height: 75,
    });

    chesspieces.forEach(function(piece) {
        var c = piece.c;
        ctx.fillStyle = piece.colour;
        ctx.font = piece.font;
        ctx.fillText(String.fromCharCode(c), piece.left, piece.top);
    });
}

/**
This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById("chessboard");
    canvasGame = document.getElementById("topChessboard");
    canvasLeft = canvas.offsetLeft,
        canvasTop = canvas.offsetTop,
        ctx = canvas.getContext('2d');
    ctxGame = canvasGame.getContext('2d');
    drawBoard(canvas, ctx);
    pushPieces(ctxGame);

    //On click event will check what piece has been clicked
    canvasGame.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;
        chesspieces.forEach(function(piece) {
            if (y > piece.top - 70 && y < piece.top - 70 + piece.height && x > piece.left && x < piece.left + piece.width) {
                //-70 because text draws from the bottom and then up, unlike rectnagles which draw down and right
                //alert(piece.c.toString()); //maybe change this to an id, but the unicode should tell you about their movement
                if (!moveFlag) {
                    ctxGame.fillStyle = "rgba(255, 255, 102, 0.5)";
                    ctxGame.fillRect(piece.left, piece.top + 5, 75, 150);
                    moveFlag = true;
                }

            } else {
                ctxGame.clearRect(piece.left, piece.top + 5, 75, 150);
                moveFlag = false;
            }
        });

    }, false);
}
window.onload = init;