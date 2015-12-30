/*
 * Contains logic for piece behaviour
 */
const ATK = "attack";
const MOVE = "move"; 
 
//FILL METHOD
function fill(ctxHighlight, color, moveType, row, column) {
	if (column > -1 && column < 8) {
		ctxHighlight.fillStyle = color;
		ctxHighlight.fillRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);
		highlightedTiles.push([moveType, row, column]);
	}
}

//CHECK OPPONENT AND BOUNDS
/*
 * row 
 * column 
*/
function validAttack(index, colourBool) {
    if  (index > 63 || index < 0) { 
        return false;
    } else {
        return board.__position__[index].isWhite !== colourBool;
    }
}

//PAWN
function pawnListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition, forwardMoves, colourBool) {
    var attackFlag1 = false;
    var attackFlag2 = false;

    //check direction of pawn travels, same principle can be applied to see what can attack what
    if (board.__position__[piecePosition].isWhite) {
        for (var i = 1; i <= forwardMoves; i++) { //alert('p');
            //board represented as 1D array so the row # must be multiplied by the # of tiles in a row
            //tile in front of pawn is empty
			
            // //next two ifs check for attack moves
            if (board.__position__[piecePosition + 9] !== null && validAttack(piecePosition + 9, colourBool) && !attackFlag1) {
                //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
                //then check if the highlighted piece is the opposite.
                fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column + 1);
                attackFlag1 = true;
            }
            if (board.__position__[piecePosition + 7] !== null && validAttack(piecePosition + 7, colourBool) && !attackFlag2) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column - 1);
                attackFlag2 = true;
            }
			//move check
            if (board.__position__[piecePosition + (i * 8)] === null) {
                fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
            } else {
                break;
            }
        }
    } else {
        for (var i = 1; i <= forwardMoves; i++) { 

            if (board.__position__[piecePosition - 9] !== null && validAttack(piecePosition - 9, colourBool) && !attackFlag1) {
                //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
                //then check if the highlighted piece is the opposite.
                fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column - 1);
                attackFlag1 = true;
            }
            if (board.__position__[piecePosition - 7] !== null && validAttack(piecePosition - 7, colourBool) && !attackFlag2) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column + 1);
                attackFlag2 = true;
            }

            if (board.__position__[piecePosition - (i * 8)] === null) {
                fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
            } else {
                break;
            }
        }
    }
}

//ROOK
function rookListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var colourBool = board.__position__[piecePosition].isWhite;
    var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //RIGHT
        if (board.__position__[piecePosition + (i * 8)] === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(piecePosition + (i * 8), colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column);
            }
            rightFlag = true;
        }
        //DOWN
        if (board.__position__[piecePosition + i] === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + i);
        } else if (!downFlag) {
            if (validAttack(piecePosition + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column + i);
            }
            downFlag = true;
        }
        //LEFT
        if (board.__position__[piecePosition - (i * 8)] === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
        } else if (!leftFlag) {
            if (validAttack(piecePosition - (i * 8), colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column);
            }
            leftFlag = true;
        }
        //UP
        if (board.__position__[piecePosition - i] === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - i);
        } else if (!upFlag) {
            if (validAttack(piecePosition - i, colourBool)) {
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
function knightListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var colourBool = board.__position__[piecePosition].isWhite;
    //note to self row + i is down 
    //DOWNRIGHT
    if (board.__position__[piecePosition + (16) + 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 2, column + 1);
    } else if (validAttack(piecePosition + (16) + 1, colourBool)) {
        //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
        //then check if the highlighted piece is the opposite.
        fill(ctxHighlight, LIGHT_RED, ATK, row + 2, column + 1);
    }
    //DOWNLEFT
    if (board.__position__[piecePosition + (16) - 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 2, column - 1);
    } else if (validAttack(piecePosition + (16) - 1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 2, column - 1);
    }
    //RIGHTDOWN
    if (board.__position__[piecePosition + (8) + 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 1, column + 2);
    } else if (validAttack(piecePosition + (8) + 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column + 2);
    }
    //LEFTDOWN
    if (board.__position__[piecePosition + (8) - 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 1, column - 2);
    } else if (validAttack(piecePosition + (8) - 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column - 2);
    }
    //UPRIGHT
    if (board.__position__[piecePosition - (16) + 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 2, column + 1);
    } else if (validAttack(piecePosition - (16) + 1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 2, column + 1);
    }
    //UPLEFT
    if (board.__position__[piecePosition - (16) - 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 2, column - 1);
    } else if (validAttack(piecePosition - (16) - 1, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 2, column - 1);
    }
    //RIGHTUP
    if (board.__position__[piecePosition - (8) + 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 1, column + 2);
    } else if (validAttack(piecePosition - (8) + 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column + 2);
    }
    //LEFTUP
    if (board.__position__[piecePosition - (8) - 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 1, column - 2);
    } else if (validAttack(piecePosition - (8) - 2, colourBool)) {
        fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column - 2);
    }
}

//BISHOP
function bishopListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var colourBool = board.__position__[piecePosition].isWhite;
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.__position__[piecePosition + (i * 8) + i] === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(piecePosition + (i * 8) + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column + i);
            }
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.__position__[piecePosition + (i * 8) - i] === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column - i);
        } else if (!downleftFlag) {
            if (validAttack(piecePosition + (i * 8) - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column - i);
            }
            downleftFlag = true;
        }
        //UPLEFT
        if (board.__position__[piecePosition - (i * 8) - i] === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column - i);
        } else if (!upleftFlag) {
            if (validAttack(piecePosition - (i * 8) - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column - i);
            }
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.__position__[piecePosition - (i * 8) + i] === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column + i);
        } else if (!uprightFlag) {
            if (validAttack(piecePosition - (i * 8) + i, colourBool)) {
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
function queenListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    bishopListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
    rookListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition);
}

//KING
//Note: I left all the methods in the king because he will have to have a lot more conditions added in the futre
function kingListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var colourBool = board.__position__[piecePosition].isWhite;
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
        if (board.__position__[piecePosition + (i * 8)] === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(piecePosition + (i * 8), colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column);
            }
            rightFlag = true;
        }
        //DOWN
        if (board.__position__[piecePosition + i] === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + i);
        } else if (!downFlag) {
            if (validAttack(piecePosition + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column + i);
            }
            downFlag = true;
        }
        //LEFT
        if (board.__position__[piecePosition - (i * 8)] === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column);
        } else if (!leftFlag) {
            if (validAttack(piecePosition - (i * 8), colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column);
            }
            leftFlag = true;
        }
        //UP
        if (board.__position__[piecePosition - i] === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - i);
        } else if (!upFlag) {
            if (validAttack(piecePosition - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column - i);
            }
            upFlag = true;
        }
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.__position__[piecePosition + (i * 8) + i] === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(piecePosition + (i * 8) + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column + i);
            }
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.__position__[piecePosition + (i * 8) - i] === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + i, column - i);
        } else if (!downleftFlag) {
            if (validAttack(piecePosition + (i * 8) - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + i, column - i);
            }
            downleftFlag = true;
        }
        //UPLEFT
        if (board.__position__[piecePosition - (i * 8) - i] === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column - i);
        } else if (!upleftFlag) {
            if (validAttack(piecePosition - (i * 8) - i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column - i);
            }
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.__position__[piecePosition - (i * 8) + i] === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - i, column + i);
        } else if (!uprightFlag) {
            if (validAttack(piecePosition - (i * 8) + i, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - i, column + i);
            }
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag && upFlag && downFlag && leftFlag && rightFlag) {
            break;
        }
    }
}