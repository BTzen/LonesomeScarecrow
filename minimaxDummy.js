var score;
var nodeCount = -1;
var currentScore = 0;

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

//WEIGHT AND DIFFERENCE WILL BE SUMMED UP
/*
function evaluate(board) {
	var whitePawns = countPieces(board, "Pawn", true);
	var blackPawns = countPieces(board, "Pawn", false);
	return whitePawns - blackPawns;
}
*/

function evaluate() {
	nodeCount++;
	return Math.floor(Math.random() * (20 - 1 + 1)) + 1;
}

function maxi(alpha, beta, depth) {
    if (depth === 0) {
        currentScore = evaluate();
        console.log("Depth: " + depth + " || Max: " + currentScore);
        return currentScore;
    }
    //var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < 3; i++) { //set all moves = 3 for dummy tree
        score = mini(alpha, beta, depth - 1);
        if (score >= beta) {
            return beta;
        }
        if (score > alpha) {
            alpha = score;
        }
    }
    console.log("Depth: " + depth + " || Max: " + alpha);
    return alpha;
}

function mini(alpha, beta, depth) {
    if (depth === 0) {
        currentScore = evaluate();
        console.log("Depth: " + depth + " || Min: " + currentScore);
        return currentScore;
    }
    //var min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < 3; i++) {
        score = maxi(alpha, beta, depth - 1);
        if (score <= alpha) {
            return alpha;
        }
        if (score < beta) {
            beta = score;
        }
    }
    console.log("Depth: " + depth + " || Min: " + beta);
    return beta;
}