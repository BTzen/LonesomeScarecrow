var chesspieces = [];

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
	/*
	var c= 9817;
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "70px Arial unicode MS";
	ctx.fillText(String.fromCharCode(c), 0, 70);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "70px Arial unicode MS";
	ctx.fillText(String.fromCharCode(c), 75, 70);
	//*/
}

function init() {
    canvas = document.getElementById("chessboard");
    ctx = canvas.getContext('2d');
    drawBoard(canvas, ctx);
	canvas.addEventListener('click', function(event) {
	alert("clicked!");
	/*
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
            alert('clicked an element');
        }
    });
    */
}, false);
}
window.onload = init;