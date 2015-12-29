//FILL
function fill(ctxHighlight, color, moveType, row, column) {
    ctxHighlight.fillStyle = color;
    ctxHighlight.fillRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);
    highlightedTiles.push([moveType, row, column]);
}

//PAWN
function pawnListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition, forwardMoves) {
    var attackFlag1 = false;
    var attackFlag2 = false;

	//check direction of pawn travels, same principle can be applied to see what can attack what
	if (board.__position__[piecePosition].isWhite) {
		for (var i = 1; i <= forwardMoves; i++) { //alert('p');
        //board represented as 1D array so the row # must be multiplied by the # of tiles in a row
        //tile in front of pawn is empty
        if (board.__position__[piecePosition + (i * 8)] === null) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column);
        }
        // //next two ifs check for attack moves
        if (board.__position__[piecePosition + 9] !== null && !attackFlag1) {
            //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
            //then check if the highlighted piece is the opposite.
            fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column + 1);
            attackFlag1 = true;
        }
        if (board.__position__[piecePosition + 7] !== null && !attackFlag2) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column - 1);
            attackFlag2 = true;
        }
    }
	} else {
		for (var i = 1; i <= forwardMoves; i++) { //alert('p');
        //board represented as 1D array so the row # must be multiplied by the # of tiles in a row
        //tile in front of pawn is empty
        if (board.__position__[piecePosition - (i * 8)] === null) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column);
        }
        // //next two ifs check for attack moves
        if (board.__position__[piecePosition - 9] !== null && !attackFlag1) {
            //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
            //then check if the highlighted piece is the opposite.
            fill(ctxHighlight, LIGHT_RED, "attack", row - 1, column - 1);
            attackFlag1 = true;
        }
        if (board.__position__[piecePosition - 7] !== null && !attackFlag2) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - 1, column + 1);
            attackFlag2 = true;
        }
    }
	}
}

//ROOK
function rookListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //RIGHT
        if (board.__position__[piecePosition + (i * 8)] === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column);
            rightFlag = true;
        }
        //DOWN
        if (board.__position__[piecePosition + i] === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column + i);
        } else if (!downFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column + i);
            downFlag = true;
        }
        //LEFT
        if (board.__position__[piecePosition - (i * 8)] === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column);
        } else if (!leftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column);
            leftFlag = true;
        }
        //UP
        if (board.__position__[piecePosition - i] === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column - i);
        } else if (!upFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column - i);
            upFlag = true;
        }

        if (upFlag && downFlag && rightFlag && leftFlag) {
            break;
        }
    }
}

//KNIGHT
function knightListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    //note to self row + i is down 
    //DOWNRIGHT
    if (board.__position__[piecePosition + (16) + 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row + 2, column + 1);
    } else {
        //somewhere here we should check the team, maybe by passing in the isWhite boolean, 
        //then check if the highlighted piece is the opposite.
        fill(ctxHighlight, LIGHT_RED, "attack", row + 2, column + 1);
    }
    //DOWNLEFT
    if (board.__position__[piecePosition + (16) - 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row + 2, column - 1);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row + 2, column - 1);
    }
    //RIGHTDOWN
    if (board.__position__[piecePosition + (8) + 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row + 1, column + 2);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column + 2);
    }
    //LEFTDOWN
    if (board.__position__[piecePosition + (8) - 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row + 1, column - 2);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column - 2);
    }
    //UPRIGHT
    if (board.__position__[piecePosition - (16) + 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row - 2, column + 1);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row - 2, column + 1);
    }
    //UPLEFT
    if (board.__position__[piecePosition - (16) - 1] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row - 2, column - 1);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row - 2, column - 1);
    }
    //RIGHTUP
    if (board.__position__[piecePosition - (8) + 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row - 1, column + 2);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row - 1, column + 2);
    }
    //LEFTUP
    if (board.__position__[piecePosition - (8) - 2] === null) {
        fill(ctxHighlight, MELLOW_YELLOW, "move", row - 1, column - 2);
    } else {
        fill(ctxHighlight, LIGHT_RED, "attack", row - 1, column - 2);
    }
}

//BISHOP
function bishopListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.__position__[piecePosition + (i * 8) + i] === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column + i);
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.__position__[piecePosition + (i * 8) - i] === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column - i);
        } else if (!downleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column - i);
            downleftFlag = true;
        }
        //UPLEFT
        if (board.__position__[piecePosition - (i * 8) - i] === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column - i);
        } else if (!upleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column - i);
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.__position__[piecePosition - (i * 8) + i] === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row-i, column + i);
        } else if (!uprightFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row-i, column + i);
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag) {
            break;
        }
    }
}

//QUEEN
function queenListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;
	var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 8; i++) {
		//RIGHT
        if (board.__position__[piecePosition + (i * 8)] === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column);
            rightFlag = true;
        }
        //DOWN
        if (board.__position__[piecePosition + i] === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column + i);
        } else if (!downFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column + i);
            downFlag = true;
        }
        //LEFT
        if (board.__position__[piecePosition - (i * 8)] === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column);
        } else if (!leftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column);
            leftFlag = true;
        }
        //UP
        if (board.__position__[piecePosition - i] === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column - i);
        } else if (!upFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column - i);
            upFlag = true;
        }
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.__position__[piecePosition + (i * 8) + i] === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column + i);
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.__position__[piecePosition + (i * 8) - i] === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column - i);
        } else if (!downleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column - i);
            downleftFlag = true;
        }
        //UPLEFT
        if (board.__position__[piecePosition - (i * 8) - i] === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column - i);
        } else if (!upleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column - i);
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.__position__[piecePosition - (i * 8) + i] === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row-i, column + i);
        } else if (!uprightFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row-i, column + i);
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag &&upFlag &&downFlag && leftFlag && rightFlag) {
            break;
        }
    }
}

//KING
function queenListener(ctxHighlight, ctxPiece, board, x, y, row, column, piecePosition) {
    var uprightFlag = false;
    var downleftFlag = false;
    var downrightFlag = false;
    var upleftFlag = false;
	var upFlag = false;
    var downFlag = false;
    var rightFlag = false;
    var leftFlag = false;

    for (var i = 1; i <= 1; i++) {
		//RIGHT
        if (board.__position__[piecePosition + (i * 8)] === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column);
            rightFlag = true;
        }
        //DOWN
        if (board.__position__[piecePosition + i] === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column + i);
        } else if (!downFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column + i);
            downFlag = true;
        }
        //LEFT
        if (board.__position__[piecePosition - (i * 8)] === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column);
        } else if (!leftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column);
            leftFlag = true;
        }
        //UP
        if (board.__position__[piecePosition - i] === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row, column - i);
        } else if (!upFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row, column - i);
            upFlag = true;
        }
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWNRIGHT
        if (board.__position__[piecePosition + (i * 8) + i] === null && !downrightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column + i);
        } else if (!downrightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column + i);
            downrightFlag = true;
        }
        //DOWNLEFT
        if (board.__position__[piecePosition + (i * 8) - i] === null && !downleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column - i);
        } else if (!downleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + i, column - i);
            downleftFlag = true;
        }
        //UPLEFT
        if (board.__position__[piecePosition - (i * 8) - i] === null && !upleftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row - i, column - i);
        } else if (!upleftFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row - i, column - i);
            upleftFlag = true;
        }
        //UPRIGHT
        if (board.__position__[piecePosition - (i * 8) + i] === null && !uprightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row-i, column + i);
        } else if (!uprightFlag) {
            fill(ctxHighlight, LIGHT_RED, "attack", row-i, column + i);
            uprightFlag = true;
        }

        if (uprightFlag && downrightFlag && upleftFlag && downleftFlag &&upFlag &&downFlag && leftFlag && rightFlag) {
            break;
        }
    }
}