//Billings, Kurylovich
//Contains logic for piece behaviour, including movement and attack capabilities

/*
 * row row of the object that the listener is being called on; the agent
 * col column of the object that the listener is being called on
 * forward moves the maximum number of moves the piece is allowed to advance forward
 */
function pawnListener(ctxHighlight, board, row, column, forwardMoves, bColour) {	//don't think I need colour
    var attackFlag1 = false;
    var attackFlag2 = false;
	let callingPiece = board.getPiece(row, column);
    //check direction of pawn travels, same principle can be applied to see what can attack what
    
	var sign = 1;	// allows reuse of code for different colours. -ve sign for white and +ve for black
	// causes white pawns moved towards the top of the board and black pawns to move towards the bottom
	if (callingPiece !== null) {
		if (callingPiece.isWhite) { sign *= -1; }
	}
		
	for (var i = 1; i <= forwardMoves; i++) {
		//tile in front of pawn is empty
		
		/* next two ifs check for attack moves
		 * 1st if for attacking right, 2nd for left
		 * condition following OR is for en passant
		 */
		if ((board.getPiece(row + (1 * sign), column + 1) !== null && board.isValidAttack(row + (1 * sign), column + 1, callingPiece) && !attackFlag1) || 
		(board.getPiece(row, column + 1) !== null && pawnTwoSquaresRowCol !== null && pawnTwoSquaresRowCol[0] === row && pawnTwoSquaresRowCol[1] === column + 1))
		{
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + (1 * sign), column + 1));
			attackFlag1 = true;
		}
		if ((board.getPiece(row + (1 * sign), column-1) !== null && board.isValidAttack(row + (1 * sign), column - 1, callingPiece) && !attackFlag2) || 
		(board.getPiece(row, column - 1) !== null && pawnTwoSquaresRowCol !== null && pawnTwoSquaresRowCol[0] === row && pawnTwoSquaresRowCol[1] === column - 1))
		{
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + (1*sign), column - 1));
			attackFlag2 = true;
		}

		// check if pawn can be moved to the desired location
		if (board.getPiece(row+(i*sign),column) === null) {
			fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + (i*sign), column));
		} else {
			break;
		}
	}
}

function rookListener(ctxHighlight, board, row, column) {
    let callingPiece = board.getPiece(row, column);
	//flags are used to 
    let blockedAbove = false, blockedBelow = false, blockedOnRight = false, blockedOnLeft = false;
	

    for (var i = 1; i <= 8; i++) {
        //additional boolean condition is in the if statement because without it, it checks 1 tile too far
        //DOWN
        if (board.getPiece(row+i, column) === null && !blockedBelow) { //and down flag
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + i, column));
        } else if (!blockedBelow) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (board.isValidAttack(row+i,column, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + i, column));
            }
            blockedBelow = true;
        }
        //RIGHT
        if (board.getPiece(row, column+i) === null && !blockedOnRight) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column + i));
        } else if (!blockedOnRight) {
            if (board.isValidAttack(row, column+i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row, column + i));
            }
            blockedOnRight = true;
        }
        //UP
        if (board.getPiece(row-i, column) === null && !blockedAbove) { //&& !upFlag
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - i, column));
        } 
		else if (!blockedAbove) {		// there is a piece on the path
            if (board.isValidAttack(row-i, column, callingPiece)) {	// check to see if the piece is an enemy
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - i, column));
            }
            blockedAbove = true;
        }
        //LEFT
        if (board.getPiece(row, column-i) === null && !blockedOnLeft) { // && !leftFlag
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column - i));
        } else if (!blockedOnLeft) {
            if (board.isValidAttack(row, column-i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row, column - i));
            }
            blockedOnLeft = true;
        }
		// current piece is surrounded on all sides by pieces so stop the loop
        if (blockedAbove && blockedBelow && blockedOnLeft && blockedOnRight) {
            break;
        }
    }
}

function knightListener(ctxHighlight, board, row, column) {
    let callingPiece = board.getPiece(row, column);
    //note to self row + i is down 
    //DOWNRIGHT
    if (board.getPiece(row+2,column+1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 2, column + 1));
    } else if (board.isValidAttack(row + 2, column+1, callingPiece)) {
        // MEMO somewhere here we should check the team, maybe by passing in the isWhite boolean, 
        //then check if the highlighted piece is the opposite.
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 2, column + 1));
    }
    //DOWNLEFT
    if (board.getPiece(row+2,column-1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 2, column - 1));
    } else if (board.isValidAttack(row+2, column-1, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 2, column - 1));
    }
    //LEFTDOWN
    if (board.getPiece(row+1,column-2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 1, column - 2));
    } else if (board.isValidAttack(row + 1, column - 2, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 1, column - 2));
    }
	//LEFTUP
    if (board.getPiece(row-1,column-2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 1, column - 2));
    } else if (board.isValidAttack(row - 1, column-2, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 1, column - 2));
    }
    //UPLEFT
    if (board.getPiece(row-2,column-1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 2, column - 1));
    } else if (board.isValidAttack(row - 2, column-1, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 2, column - 1));
    }
	//UPRIGHT
    if (board.getPiece(row-2,column+1) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 2, column + 1));
    } else if (board.isValidAttack(row-2, column + 1, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 2, column + 1));
    }
    //RIGHTUP
    if (board.getPiece(row-1,column+2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 1, column + 2));
    } else if (board.isValidAttack(row - 1, column + 2, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 1, column + 2));
    }
	//RIGHTDOWN
    if (board.getPiece(row+1,column+2) === null) {
        fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 1, column + 2));
    } else if (board.isValidAttack(row + 1, column + 2, callingPiece)) {
        fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 1, column + 2));
    }
}

function bishopListener(ctxHighlight, board, row, column) {
    var callingPiece = board.getPiece(row,column);
    var blockedNortheast = false, blockedSouthwest = false, blockedSoutheast = false, blockedNorthwest = false;	// prevent movement beyond other pieces where it's not legal

    for (var i = 1; i < 8; i++) {
        if (board.getPiece(row + i, column + i) === null && !blockedSoutheast) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + i, column + i));
        } else if (!blockedSoutheast) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (board.isValidAttack(row + i, column + i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + i, column + i));
            }
            blockedSoutheast = true;
        }
        if (board.getPiece(row+i,column-i) === null && !blockedSouthwest) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + i, column - i));
        } else if (!blockedSouthwest) {
            if (board.isValidAttack(row+i, column-i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + i, column - i));
            }
            blockedSouthwest = true;
        }
        if (board.getPiece(row-i,column-i) === null && !blockedNorthwest) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - i, column - i));
        } else if (!blockedNorthwest) {
            if (board.isValidAttack(row - i, column - i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - i, column - i));
            }
            blockedNorthwest = true;
        }
        if (board.getPiece(row-i,column+i) === null && !blockedNortheast) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - i, column + i));
        } else if (!blockedNortheast) {
            if (board.isValidAttack(row-i,column+i, callingPiece)) {
                fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - i, column + i));
            }
            blockedNortheast = true;
        }

        if (blockedNortheast && blockedSoutheast && blockedNorthwest && blockedSouthwest) {
            break;
        }
    }
}

function queenListener(ctxHighlight, board, row, column) {
    bishopListener(ctxHighlight, board, row, column);
    rookListener(ctxHighlight, board, row, column);
}

function kingListener(ctxHighlight, board, row, column) {
    let callingPiece = board.getPiece(row,column);
    // var blockedNortheast = false;
    // var blockedSouthwest = false;
    // var blockedSoutheast = false;
    // var blockedNorthwest = false;
    // var blockedAbove = false;
    // var blockedBelow = false;
    // var blockedOnRight = false;
    // var blockedOnLeft = false;
    //for (var i = 1; i <= 1; i++) { //could hard code it, change all i's to 1's

	//RIGHT
	//check if king can castle to the right - breaks if no rook, moves rook instead
	if (castlingCheck(7,7)) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column + 2));
		isCastlingRight = true;	//used in listener to move rook
	}
	if (board.getPiece(row,column + 1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column + 1));
	} else {
		//ATTACK HIGHLIGHT, this will need to check isWhite
		if (board.isValidAttack(row,column + 1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row, column + 1));
		}
		// blockedOnRight = true;
	}
	//DOWN
	if (board.getPiece(row + 1,column) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 1, column));
	} else {
		if (board.isValidAttack(row + 1,column, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 1, column));
		}
	}
	//LEFT
	//check if king can castle to the left - breaks if no rook, moves rook instead
	if (castlingCheck(7,0)) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column - 2));
		isCastlingLeft = true;	//used in listener to move rook
	}
	if (board.getPiece(row, column - 1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row, column - 1));
	} else {
		if (board.isValidAttack(row,column - 1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row, column - 1));
		}
	}
	//UP
	if (board.getPiece(row - 1,column) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 1, column));
	} else {
		if (board.isValidAttack(row - 1,column, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 1, column));
		}
	}
	//additional boolean condition is in the if statement because without it, it checks 1 tile too far
	//DOWNRIGHT
	if (board.getPiece(row+1,column+1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 1, column + 1));
	} else {
		//ATTACK HIGHLIGHT, this will need to check isWhite
		if (board.isValidAttack(row + 1, column + 1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 1, column + 1));
		}
	}
	//DOWNLEFT
	if (board.getPiece(row+1,column-1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row + 1, column - 1));
	} else {
		if (board.isValidAttack(row+1, column-1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row + 1, column - 1));
		}
	}
	//UPLEFT
	if (board.getPiece(row-1,column-1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 1, column - 1));
	} else {
		if (board.isValidAttack(row - 1, column - 1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 1, column - 1));
		}
	}
	//UPRIGHT
	if (board.getPiece(row-1,column+1) === null) {
		fill(ctxHighlight, MELLOW_YELLOW, new Action(callingPiece, ActionType.MOVE, row - 1, column + 1));
	} else {
		if (board.isValidAttack(row-1,column+1, callingPiece)) {
			fill(ctxHighlight, LIGHT_RED, new Action(callingPiece, ActionType.ATTACK, row - 1, column + 1));
		}
	}

	// if (blockedNortheast && blockedSoutheast && blockedNorthwest && blockedSouthwest && blockedAbove && blockedBelow && blockedOnLeft && blockedOnRight) {
		// break;
	// }
}
