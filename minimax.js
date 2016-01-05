var score;
var nodeCount = -1;
var currentScore = 0;
var previousBoard;
var nextRow;
var nextColumn;
var currentRow;
var currentColumn;

/*
//THE REAL FUNCTIONS ARE COMMENTED OUT FOR NOW
//COUNTS THE NUMBER OF A PIECE ON THE BOARD
function countPieces (board, pieceName, isWhite) {
	var count = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var toCheck = board.getPiece(i,j);
			if (toCheck !== null) {
				if (toCheck.type === pieceName && toCheck.isWhite == isWhite) {
					count++;
				}
			}
		}
	}
}
*/

//WEIGHT AND DIFFERENCE WILL BE SUMMED UP
function evaluate(board) {
    return Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    /*
    var whitePawns = countPieces(board, "Pawn", true);
    var blackPawns = countPieces(board, "Pawn", false);
    return whitePawns - blackPawns;
    */
}
//I WANT TO RETURN nextRow nextColumn AND NEXTnextRow AND NEXTnextColumn
function maxi(alpha, beta, depth, board) {
    var board = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = evaluate(board);
        //console.log("Depth: " + depth + " || Max: " + currentScore);
        return [currentScore, board];
    }
    //var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < 8; i++) { //set all moves = 3 for dummy tree, this will be for each possible move
        for (var j = 0; j < 8; j++) {
            var toMove = board.getPiece(i, j);
			if (i === 0 && j ===0) {
				console.log(toMove);
			}
            if (toMove !== null) {
                //get the highlights for this piece
                //try the board at each highlights
                chessPieceListener(ctxHighlight, ctxPiece, board, i * LENGTH, j * LENGTH);
                highlightedTiles.forEach(function(item) {
                    nextRow = item[1] * LENGTH;
                    nextColumn = item[2] * LENGTH;
					//move to one of the highlights
                    board.movePiece(toMove, nextRow, nextColumn);
                    //switch turns next depth maybe
                    score = mini(alpha, beta, depth - 1, board)[0];
					board.movePiece(toMove, i, j); //I need to move back from where I came
                    if (score >= beta) {
                        return [beta, board];
                    }
                    if (score > alpha) {
                        alpha = score;
                    }
                });
            }
        }
    }
    return [alpha, board];
}

function mini(alpha, beta, depth, board) {
    var board = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = evaluate(board);
        //console.log("Depth: " + depth + " || Min: " + currentScore);
        return [currentScore, board];
    }
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var toMove = board.getPiece(i, j);
			if (i === 0 && j ===0) {
				console.log(toMove);
			}
            if (toMove !== null) {
                chessPieceListener(ctxHighlight, ctxPiece, board, i * LENGTH, j * LENGTH);
                highlightedTiles.forEach(function(item) {
                    nextRow = item[1] * LENGTH;
                    nextColumn = item[2] * LENGTH;
                    board.movePiece(toMove, nextRow, nextColumn);
                    //might have to switch turns, doesn't look like it
                    score = maxi(alpha, beta, depth - 1, board)[0];
					board.movePiece(toMove, i, j);
                    if (score <= alpha) {
                        return [alpha, board];
                    }
                    if (score < beta) {
                        beta = score;
                    }
                });
            }
        }
    }
    //console.log("Depth: " + depth + " || Min: " + beta);
    return [beta, board];
}