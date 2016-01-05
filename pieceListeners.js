/*
 * Contains logic for piece behaviour
 */
var isCheckingBoard = false;
const ATK = "attack";
const MOVE = "move"; 
 
//FILL METHOD
function fill(ctxHighlight, color, moveType, row, column) {
	if (column > -1 && column < 8) {
		if (!isCheckingBoard) {
			if (isWhiteTurn) { //will need some sort of isAI var
				ctxHighlight.fillStyle = color;
				ctxHighlight.fillRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);
			}
				highlightedTiles.push([moveType, row, column]);		
		} else {
			allHighlightedTiles.push([moveType, row, column]);	
		}
	}
}

//CHECK OPPONENT AND BOUNDS
function validAttack(row,column, colourBool) {
	var toAttack = board.getPiece(row,column);
	if (toAttack!== null) {
		if  (row > 7 || row < 0 || column > 7 || column < 0) { 
			return false;
		} else {
			return board.getPiece(row,column).isWhite === colourBool;
		}		
	}
}

//CHECK IF KING IS IN CHECK
function inCheck() {
	isCheckingBoard = true;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var checkPiece = board.getPiece(i,j);
			if (checkPiece!==null && checkPiece.type !== "King") {
				isWhiteTurn = !isWhiteTurn;
				fakeChessPieceListener(ctxHighlight, ctxPiece, board, j*LENGTH, i*LENGTH);
				isWhiteTurn = !isWhiteTurn;
			} 
			//check if the tiles that get highlightedTiles hits the king in that position
		}	
	}
	allHighlightedTiles.forEach(function(item) {
		var isAttack = item[0] === ATK;
		if (isAttack){ //is it an attack tile
			var isKing = board.getPiece(item[1],item[2]).type === "King";
			if (isKing) { //is it attacking a king
				alert("In check");
				allHighlightedTiles = [];
				isCheckingBoard = false;
				return true;
			}
		}
	});
	allHighlightedTiles = [];
	isCheckingBoard = false;
	return false;
	//if it does he is in check.
}

//PAWN
function pawnListener(ctxHighlight, board, row, column, forwardMoves, colourBool) {
    var attackFlag1 = false;
    var attackFlag2 = false;

    //check direction of pawn travels, same principle can be applied to see what can attack what
    if (!board.getPiece(row,column).isWhite) {
        for (var i = 1; i <= forwardMoves; i++) {
            //tile in front of pawn is empty
			
            // //next two ifs check for attack moves
            if (board.getPiece(row+1,column+1) !== null && validAttack(row+1,column+1, !colourBool) && !attackFlag1) {
                //then check if the highlighted piece is the opposite.
                fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column + 1);
                attackFlag1 = true;
            }
            if (board.getPiece(row+1,column-1) !== null && validAttack(row+1,column-1, !colourBool) && !attackFlag2) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column - 1);
                attackFlag2 = true;
            }
			//move check
            if (board.getPiece(row+i,column) === null) {
                fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
            } else {
                break;
            }
        }
    } else {	// for white pieces
        for (var i = 1; i <= forwardMoves; i++) { 

            if (board.getPiece(row-1,column-1) !== null && validAttack(row-1,column-1, !colourBool) && !attackFlag1) {
                //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
                //then check if the highlighted piece is the opposite.
                fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column - 1);
                attackFlag1 = true;
            }
            if (board.getPiece(row-1,column+1) !== null && validAttack(row-1,column+1, !colourBool) && !attackFlag2) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column + 1);
                attackFlag2 = true;
            }

            if (board.getPiece(row-i,column) === null) {
                fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
            } else {
                break;
            }
        }
    }
}

//ROOK
function rookListener(ctxHighlight, board, row, column) {
    var colourBool = !board.getPiece(row,column).isWhite;
    var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //RIGHT
        if (board.getPiece(row+i,column) === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(row+i,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column);
            }
            rightFlag = true;
        }
        //DOWN
        if (board.getPiece(row,column+i) === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + i);
        } else if (!downFlag) {
            if (validAttack(row,column+i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column + i);
            }
            downFlag = true;
        }
        //LEFT
        if (board.getPiece(row-i,column) === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
        } else if (!leftFlag) {
            if (validAttack(row-i,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column);
            }
            leftFlag = true;
        }
        //UP
        if (board.getPiece(row,column-i) === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - i);
        } else if (!upFlag) {
            if (validAttack(row,column-i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column - i);
            }
            upFlag = true;
        }

        if (upFlag && downFlag && rightFlag && leftFlag) {
            break;
        }
    }
}

//KNIGHT
function knightListener(ctxHighlight, board, row, column) {
    var colourBool = !board.getPiece(row,column).isWhite;
    //note to self row + i is down 
    //DOWNRIGHT
    if (board.getPiece(row+2,column+1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 2, column + 1);
    } else if (validAttack(row + 2, column+1, colourBool)) {
        //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
        //then check if the highlighted piece is the opposite.
        fill(ctxHighlight, LIGHT_RED, ATK, row + 2, column + 1);
    }
    //DOWNLEFT
    if (board.getPiece(row+2,column-1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 2, column - 1);
    } else if (validAttack(row+2, column-1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 2, column - 1);
    }
    //RIGHTDOWN
    if (board.getPiece(row+1,column+2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 1, column + 2);
    } else if (validAttack(row + 1, column + 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column + 2);
    }
    //LEFTDOWN
    if (board.getPiece(row+1,column-2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 1, column - 2);
    } else if (validAttack(row + 1, column - 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column - 2);
    }
    //UPRIGHT
    if (board.getPiece(row-2,column+1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 2, column + 1);
    } else if (validAttack(row-2, column + 1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 2, column + 1);
    }
    //UPLEFT
    if (board.getPiece(row-2,column-1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 2, column - 1);
    } else if (validAttack(row - 2, column-1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 2, column - 1);
    }
    //RIGHTUP
    if (board.getPiece(row-1,column+2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 1, column + 2);
    } else if (validAttack(row - 1, column + 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column + 2);
    }
    //LEFTUP
    if (board.getPiece(row-1,column-2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 1, column - 2);
    } else if (validAttack(row - 1, column-2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column - 2);
    }
}

//BISHOP
function bishopListener(ctxHighlight, board, row, column) {
    var colourBool = !board.getPiece(row,column).isWhite;
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.getPiece(row+i,column+i) === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(row + i, column + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column + i);
            }
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.getPiece(row+i,column-i) === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column - i);
        } else if (!downleftFlag) {
            if (validAttack(row+i, column-i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column - i);
            }
            downleftFlag = true;
        }
        //UPLEFT
        if (board.getPiece(row-i,column-i) === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column - i);
        } else if (!upleftFlag) {
            if (validAttack(row - i, column - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column - i);
            }
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.getPiece(row-i,column+i) === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column + i);
        } else if (!uprightFlag) {
            if (validAttack(row-i,column+i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column + i);
            }
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag) {
            break;
        }
    }
}

//QUEEN
//Note: No special moves as far as I know so it just moves like a bishop + rook.
function queenListener(ctxHighlight, board, row, column) {
    bishopListener(ctxHighlight, board, row, column);
    rookListener(ctxHighlight, board, row, column);
}

//KING
//Note: I left all the methods in the king because he will have to have a lot more conditions added in the futre
function kingListener(ctxHighlight, board, row, column) {
    var colourBool = !board.getPiece(row,column).isWhite;
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;
    var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 1; i++) { //could hard code it, change all i's to 1's
        //RIGHT
        if (board.getPiece(row+i,column) === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(row+i,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column);
            }
            rightFlag = true;
        }
        //DOWN
        if (board.getPiece(row,column+i) === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + i);
        } else if (!downFlag) {
            if (validAttack(row,column+i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column + i);
            }
            downFlag = true;
        }
        //LEFT
        if (board.getPiece(row-i,column) === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
        } else if (!leftFlag) {
            if (validAttack(row-i,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column);
            }
            leftFlag = true;
        }
        //UP
        if (board.getPiece(row,column-i) === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - i);
        } else if (!upFlag) {
            if (validAttack(row,column-i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column - i);
            }
            upFlag = true;
        }
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.getPiece(row+i,column+i) === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(row + i, column + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column + i);
            }
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.getPiece(row+i,column-i) === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column - i);
        } else if (!downleftFlag) {
            if (validAttack(row+i, column-i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column - i);
            }
            downleftFlag = true;
        }
        //UPLEFT
        if (board.getPiece(row-i,column-i) === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column - i);
        } else if (!upleftFlag) {
            if (validAttack(row - i, column - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column - i);
            }
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.getPiece(row-i,column+i) === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column + i);
        } else if (!uprightFlag) {
            if (validAttack(row-i,column+i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column + i);
            }
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag && upFlag && downFlag && leftFlag && rightFlag) {
            break;
        }
    }
}