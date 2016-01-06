var score;
var nextRow = 0;
var nextColumn = 0;
var nodeCount = -1;
var currentScore = 0;

//COUNTS THE NUMBER OF A PIECE ON THE BOARD
function countPieces(board, pieceName, isWhite) {
    var count = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var toCheck = board.getPiece(i, j);
            if (toCheck !== null) {
                if (toCheck.type === pieceName && toCheck.isWhite == isWhite) {
                    count++;
                }
            }
        }
    }
	return count;
}

//WEIGHT AND DIFFERENCE WILL BE SUMMED UP

function evaluate(board) {
	var whitePawns = countPieces(board, "Pawn", true);
	var blackPawns = countPieces(board, "Pawn", false);
	var whiteRooks = countPieces(board, "Rook", true);
	var blackRooks = countPieces(board, "Rook", false);
	var whiteKnights = countPieces(board, "Knight", true);
	var blackKnights = countPieces(board, "Knight", false);
	var whiteBishop = countPieces(board, "Bishop", true);
	var blackBishop = countPieces(board, "Bishop", false);
	var whiteQueen = countPieces(board, "Queen", true);
	var blackQueen = countPieces(board, "Queen", false);
	var whiteKing = countPieces(board, "King", true);
	var blackKing = countPieces(board, "King", false);
	
	//Weight sums, pawns = 1, bishops = knights = 3, queen = 9, king = close to infinite
	var value = 1*(blackPawns - whitePawns) + 3*(blackKnights - whiteKnights) 
	+ 3*(blackBishop-whiteBishop) + 5*(blackRooks-whiteRooks) 
	+ 9*(blackQueen-whiteQueen) + 1000000000*(blackKing-whiteKing);
	return value;
}

/*
function evaluate() {
    nodeCount++;
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
*/
function maxi(alpha, beta, depth, board) {
    var newBoard = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = evaluate(newBoard);
        console.log("Depth: " + depth + " || Max: " + currentScore);
        return [currentScore,row,column,nextRow,nextColumn];
    }
    //var max = Number.NEGATIVE_INFINITY;
// <<<<<<< 6dd444307fed0977f66ff8d2888a58e65a696667
	//for each possible move
    for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
            var toMove = newBoard.getPiece(column, row);
            if (toMove !== null && !toMove.isWhite) {
                chessPieceListener(ctxHighlight, ctxPiece, newBoard, column * LENGTH, row * LENGTH);
// =======
    // for (var row = 0; row < 8; row++) { //for each possible move
        // for (var column = 0; column < 8; column++) {
            // var toMove = board.getPiece(row, column);
            // if (toMove !== null && !toMove.isWhite) { //Maximize black
                // //get the highlights for this piece & try the board at each highlights
                // chessPieceListener(ctxHighlight, ctxPiece, board, column * LENGTH, row * LENGTH);
// >>>>>>> minor tweaks
                highlightedTiles.forEach(function(item) {
					nextRow = item[1];
                    nextColumn = item[2];
// <<<<<<< 6dd444307fed0977f66ff8d2888a58e65a696667
					//move to one of the highlights
                    newBoard.movePiece(toMove, nextRow, nextColumn);
					//get the score with that board
                    score = mini(alpha, beta, depth - 1, newBoard)[0];
					newBoard = jQuery.extend(true, {}, board);
// =======
					// currentRow = row;
					// currentColumn = column;
					// //I NEED TO DO UNDO ATTACK
					// board.movePiece(toMove, currentRow, currentColumn); //I need to move back from where I came
					// //board.print(); //DEBUG
// >>>>>>> minor tweaks
                    if (score >= beta) {
                        return [beta,row,column,nextRow,nextColumn];
                    }
                    if (score > alpha) {
                        alpha = score;
                    }
                });
            }
        }
    }
    console.log("Depth: " + depth + " || Max: " + alpha);
    return [alpha,row,column,nextRow,nextColumn];
}

function mini(alpha, beta, depth, board) {
    var newBoard = jQuery.extend(true, {}, board);
    if (depth === 0) {
        currentScore = evaluate(newBoard);
        console.log("Depth: " + depth + " || Min: " + currentScore);
        return [currentScore,row,column,nextRow,nextColumn];
    }
    //var min = Number.POSITIVE_INFINITY;
    for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
            var toMove = newBoard.getPiece(column, row);
            if (toMove !== null && toMove.isWhite) {
                chessPieceListener(ctxHighlight, ctxPiece, newBoard, column * LENGTH, row * LENGTH);
                highlightedTiles.forEach(function(item) {
                    nextRow = item[1];
                    nextColumn = item[2];
					//move to one of the highlights
                    newBoard.movePiece(toMove, nextRow, nextColumn);
                    score = maxi(alpha, beta, depth - 1, newBoard)[0];
					newBoard = jQuery.extend(true, {}, board);
                    if (score <= alpha) {
                        return [alpha,row,column,nextRow,nextColumn];
                    }
                    if (score < beta) {
                        beta = score;
                    }
                });
            }
        }
    }
    console.log("Depth: " + depth + " || Min: " + beta);
    return [beta,row,column,nextRow,nextColumn];
}