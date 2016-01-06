var score;
var nodeCount = -1;
var currentScore = 0;
var previousBoard;

var currentRow = 0;
var currentColumn = 0;
var nextRow = 0;
var nextColumn = 0;

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

function maxi(alpha, beta, depth, board) {
    var board = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = evaluate(board);
        //console.log("Depth: " + depth + " || Max: " + currentScore);
        return [currentScore, board, currentRow, currentColumn, nextRow, nextColumn];
    }
    //var max = Number.NEGATIVE_INFINITY;
    for (var row = 0; row < 8; row++) { //for each possible move
        for (var column = 0; column < 8; column++) {
            var toMove = board.getPiece(row, column);
            if (toMove !== null && !toMove.isWhite) { //Maximize black
                //get the highlights for this piece & try the board at each highlights
                chessPieceListener(ctxHighlight, ctxPiece, board, column * LENGTH, row * LENGTH);
                highlightedTiles.forEach(function(item) {
                    nextRow = item[1];
                    nextColumn = item[2];
					//move to one of the highlights
                    board.movePiece(toMove, nextRow, nextColumn);
					//Check the mini depth
                    score = mini(alpha, beta, depth - 1, board)[0];
					//Reset to return the proper next move
					nextRow = item[1];
                    nextColumn = item[2];
					currentRow = row;
					currentColumn = column;
					//I NEED TO DO UNDO ATTACK
					board.movePiece(toMove, currentRow, currentColumn); //I need to move back from where I came
					//board.print(); //DEBUG
                    if (score >= beta) {
                        return [beta, board, currentRow, currentColumn, nextRow, nextColumn];
                    }
                    if (score > alpha) {
                        alpha = score;
                    }
                });
            }
        }
    }
    //console.log("Depth: " + depth + " || Max: " + alpha);
    return [alpha, board, currentRow, currentColumn, nextRow, nextColumn];
}

function mini(alpha, beta, depth, board) {
    var board = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = -evaluate(board);
        //console.log("Depth: " + depth + " || Min: " + currentScore);
        return [currentScore, board, currentRow, currentColumn, nextRow, nextColumn];
    }
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var toMove = board.getPiece(i, j);
            if (toMove !== null && toMove.isWhite) {
                chessPieceListener(ctxHighlight, ctxPiece, board, j * LENGTH, i * LENGTH);
                highlightedTiles.forEach(function(item) {
                    nextRow = item[1];
                    nextColumn = item[2];
					//move to one of the highlights
                    board.movePiece(toMove, nextRow, nextColumn);
                    //might have to switch turns, doesn't look like it
                    score = maxi(alpha, beta, depth - 1, board)[0];
					nextRow = item[1];
                    nextColumn = item[2];
					currentRow = i;
					currentColumn = j;
					board.movePiece(toMove, currentRow, currentColumn); //I need to move back from where I came
					//board.print(); //DEBUG
                    if (score <= alpha) {
                        return [alpha, board, currentRow, currentColumn, nextRow, nextColumn];
                    }
                    if (score < beta) {
                        beta = score;
                    }
                });
            }
        }
    }
    //console.log("Depth: " + depth + " || Min: " + beta);
    return [beta, board, currentRow, currentColumn, nextRow, nextColumn];
}