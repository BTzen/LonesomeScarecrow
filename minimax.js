var score;
var nodeCount = -1;
var currentScore = 0;
var previousBoard;

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
                //var row = 0;
                //var column = 0;
				//console.log(highlightedTiles.length);
                highlightedTiles.forEach(function(item) {
                    var row = item[1] * LENGTH;
                    var column = item[2] * LENGTH;
					//move to one of the highlights
                    board.movePiece(toMove, row, column);
                    //switch turns next depth maybe
                    score = mini(alpha, beta, depth - 1, board)[0];
					board.movePiece(toMove, i, j); //I need to move back from where I came
					//board.print(); //DEBUG
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
    //console.log("Depth: " + depth + " || Max: " + alpha);
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
                //var row = 0;
                //var column = 0;
                highlightedTiles.forEach(function(item) {
                    var row = item[1] * LENGTH;
                    var column = item[2] * LENGTH;
                    board.movePiece(toMove, row, column);
                    //might have to switch turns, doesn't look like it
                    score = maxi(alpha, beta, depth - 1, board)[0];
					board.movePiece(toMove, i, j);
					//board.print(); //DEBUG
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




//Hardcoded example eval
/*
function evaluate() {
    nodeCount++;
    switch (nodeCount) {
        case 0:
            currentScore = 3;
            return currentScore;
            break;
        case 1:
            currentScore = 12;
            return currentScore;
            break;
        case 2:
            currentScore = 8;
            return currentScore;
            break;
        case 3:
            currentScore = 2;
            return currentScore;
            break;
		/*
        case 4:
		//these get pruned
            currentScore = 4;
            return currentScore;
            break;
        case 5:
            currentScore = 6;
            return currentScore;
            break;
		*/
/*
        case 4:
            currentScore = 14;
            return currentScore;
            break;
        case 5:
            currentScore = 5;
            return currentScore;
            break;
        case 6:
            currentScore = 2;
            return currentScore;
            break;
        default:
            break;
    }

    return 1337;
}
*/


/*
var max; //alpha best explored option along path to root for max
var min; //beta best explored option along path to root for min
var ply = 2;	//tree depth + 1
var isMaxTurn = true;
var whitePieces = { //hold all the white pieces on the board (should maybe be set upt in chessboardScript when game is initialized)
	pawns: 8,
	rooks: 2,
	knights: 2,
	bishops: 2,
	queens: 1,
	kings: 1
};
var blackPieces = {
	pawns: 6,
	rooks: 2,
	knights: 2,
	bishops: 2,
	queens: 1,
	kings: 1
};

/*each node has children, a worst-case value (max starts at -infinity), and an alpha and beta value, ply

*/
/*max = player who's turn it is
//generate all possible states from current states
//use heuristic to assign each child state a value

// score the gamestate
/*
function heuristic(playerIsWhite) {
	var val;	//summation of [pieceValue * (your pawns - their pawns)] for each piece type
	var yourPieces = (playerIsWhite) ? whitePieces : blackPieces;
	var theirPieces;
	val = Pawn.prototype.value * (yourPieces["pawns"]);
	//alert(val);
}	

function successor() { //generate valid moves from current moves
}

function utility() {  //maps end-game state (ie. win/loss/draw) to a score
}
*/
//test if game is finished