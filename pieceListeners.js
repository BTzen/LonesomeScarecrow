<<<<<<< HEAD
//Billings, Kurylovich
=======
/* Billings, Kurylovich */
>>>>>>> 1763609f383faa8b04341bcf111ed274b044e937
//Contains logic for piece behaviour

<<<<<<< HEAD
/*
 *
*/
function fill(ctxHighlight, color, moveType, row, column) {
=======
/* if this method is not just cheking the board it will display
 * the tiles with your possible moves, otherwise it will push the possible moves
 * to the highlighted tiles 
 */
 function fill(ctxHighlight, color, moveType, row, column) {
>>>>>>> 024e0b85f9bacd6d5cb15683c57ea377116dc91c
	if (column > -1 && column < 8 && row > -1 && row < 8) {
		if (!isCheckingBoard) {
			ctxHighlight.fillStyle = color;
			ctxHighlight.fillRect(column * LENGTH, row * LENGTH, LENGTH, LENGTH);
			highlightedTiles.push([moveType, row, column]);		
		} else {
			allHighlightedTiles.push([moveType, row, column]);	
		}
	}
}

<<<<<<< HEAD
/* check for opponent and board boundaries
 *
*/
=======
/*this will check if there is a possible attack to be made.
 */
>>>>>>> 024e0b85f9bacd6d5cb15683c57ea377116dc91c
function validAttack(row, column, colourBool) {
	var toAttack = board.getPiece(row,column);
	if (toAttack !== null) {
		if  (row > 7 || row < 0 || column > 7 || column < 0) { 
			return false;
		} else {
			return board.getPiece(row,column).isWhite === colourBool;  //Uncaught TypeError: Cannot read property 'isWhite' of undefined
		}		
	}
}

<<<<<<< HEAD
/* checks if king is in check
=======
/* new Method that will check if a piece is attacking a King.
>>>>>>> 024e0b85f9bacd6d5cb15683c57ea377116dc91c
 *
 */
function isAttackingKing (row, column, colourBool) {
	if (validAttack(row, column, colourBool) && board.getPiece(row,column).type === "King") {
		return true;
	}
}

/* CHECK IF KING IS IN CHECK
 * I think this will have to be called inside each listener.
 * Meaning after a piece is moved it will automatically check the condition
 * Once the turn is over it should output some sort of message.
 * Should require a global variable
 */
function inCheck(row, column, colourBool) {
	//REDO THIS METHOD
	/* 
	Go through each piece.
	Check the highlighted tiles.
	see if it is attacking the king.
	if the king is being under attack then he is in check.
	-----------------------------------------------------
	Now we want to check where the king can move.
	We also need to see if by moving one of our pieces will save the king.
	If neither of these types of moves are possible then we are in checkmate.
	*/
	
	// check if every piece is attacking or not? might not use this logic.
	// may delgate this to validAttack
	for (var checkRow = 0; checkRow < 64; checkRow++) {
		for (var checkCol = 0; checkCol < 64; checkCol++) {
			if (isAttackingKing (row, column, colourBool)) {
				return true;
			}
		}		
	}
}

/* Checks if castling is possible with rook at given position
 * technically a king move
 */
function castlingCheck(rookRow, rookCol) {
	var canCastle = true;
	var rookToCheck = board.getPiece(rookRow, rookCol);
	
	if (rookToCheck !== null && !rookToCheck.hasMoved) {
		var kingsRow = (rookToCheck.isWhite) ? 7 : 0;	//store the row the king and rooks start in
		var king = null;
		if (board.getPiece(kingsRow, 4) !== null && board.getPiece(kingsRow, 4).type === "King") 
			king = board.getPiece(kingsRow, 4);
		
		if (king != null && !king.hasMoved) {
			var startCol, endCol;
			if (rookCol < 4) {	//determine which rook was passed for the check
				startCol = 1;	//inclusive
				endCol = 4;		//exclusive
			}
			else {
				startCol = 5;
				endCol = 7;
			}

			for (var i = startCol; i < endCol; i++) {
				//no pieces between rook and king
				if (board.getPiece(kingsRow, i) !== null) { 
					return false;
				}
				//king doesn't cross over, or end on a square in which it would be in check
				//check if a piece can attack any square between the kings initial and destination square
				if (i !== 1) {	//if castling with the rook in file A we don't need to check column adjacent to it as the king doesn't pass over that one)
					isCheckingBoard = true;
					for (var row = 0; row < 8; row++) {
						for (var col = 0; col < 8; col++) {
							if (board.getPiece(row, col) !== null && board.getPiece(row, col).isWhite !== king.isWhite) {
								isWhiteTurn = !isWhiteTurn;
								fakeChessPieceListener(ctxHighlight, ctxPiece, board, col*LENGTH, row*LENGTH);
								isWhiteTurn = !isWhiteTurn;
							}
						}
					}
					for (var index = 0; index < allHighlightedTiles.length; index++) {
						var currentElement = allHighlightedTiles[index];
						if (currentElement[1] == kingsRow && currentElement[2] == i) { //a tile b/t rook and king is a legal destination for this piece
							alert("castle check");
							//board.getPiece(item[1],item[2]).isInCheck = true; //may not even use this
							allHighlightedTiles = [];
							isCheckingBoard = false;
							canCastle = false;
							break;
						}
					}
				}
			}
			
			//king can't be in check
			if (inCheck(king.isWhite)) { return false; }
		}
		else { return false; }
	}
	else { return false; }
	/* Need to update these as the current way of checking pieces changes the lastSelectedPiece and associated data
	 * 
	*/
	if (canCastle) {
		lastSelectedPiece = king;
		lastRow = kingsRow;
		lastColumn = 4;
	}
	
	return canCastle;
}

/*
 * row the row of the pawn that moves 2 spaces forward, post move(and the one that is potentially vulnerable to en passant)
 * col the column of said pawn
 */
function enPassantCheck(row, column) {
	//capturing pawn must be on its 5th rank before executing the maneuver
	//check for pawns immediate to the right and left of the pawn that moved
	var rightAdjacentPiece = board.getPiece(row, col + 1);
	var leftAdjacentPiece = board.getPiece(row, col + 1);
	
	if (leftAdjacentPiece !== null && leftAdjacentPiece.type === "Pawn") {
		
	}
	//must be done on turn immediately after captured pawn moves 2 spaces forward
	
	//move capturing pawn to same position it would be in if the captured pawn only moved one square forward
}

//PAWN
function pawnListener(ctxHighlight, board, row, column, forwardMoves, colourBool) {
    var attackFlag1 = false;
    var attackFlag2 = false;

    //check direction of pawn travels, same principle can be applied to see what can attack what
    var sign = 1;	// allows reuse of code for different colours. -ve sign for white and +ve for black
	if (board.getPiece(row,column).isWhite) { sign *= -1; }
		
	for (var i = 1; i <= forwardMoves; i++) {
		//tile in front of pawn is empty
		
		/* next two ifs check for attack moves
		 * 1st if for attacking right, 2nd for left
		 * condition following OR is for en passant
		*/
		if ((board.getPiece(row+(1*sign),column+1) !== null && validAttack(row+(1*sign),column+1, !colourBool) && !attackFlag1) || 
		(board.getPiece(row, column+1) !== null && pawnTwoSquaresRowCol !== null && pawnTwoSquaresRowCol[0] === row && pawnTwoSquaresRowCol[1] === column+1))
		{
			fill(ctxHighlight, LIGHT_RED, ATK, row + (1 * sign), column + 1);
			attackFlag1 = true;
		}
		if ((board.getPiece(row + (1*sign),column-1) !== null && validAttack(row + (1*sign), column-1, !colourBool) && !attackFlag2) || 
		(board.getPiece(row, column-1) !== null && pawnTwoSquaresRowCol !== null && pawnTwoSquaresRowCol[0] === row && pawnTwoSquaresRowCol[1] === column-1))
		{
			fill(ctxHighlight, LIGHT_RED, ATK, row + (1*sign), column - 1);
			attackFlag2 = true;
		}

		//move check
		if (board.getPiece(row+(i*sign),column) === null) {
			fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + (i*sign), column);
		} else {
			break;
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
		//check if king can castle to the left - breaks if no rook, moves rook instead
		if (castlingCheck(7,7)) {
			fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + 2);
			isCastlingRight = true;	//used in listener to move rook
		}
        if (board.getPiece(row,column + 1) === null && !rightFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column + 1);
        } else if (!rightFlag) {
            //ATTACK HIGHLIGHT, this will need to check isWhite
            if (validAttack(row,column + 1, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column + 1);
            }
            rightFlag = true;
        }
        //DOWN
        if (board.getPiece(row + 1,column) === null && !downFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row + 1, column);
        } else if (!downFlag) {
            if (validAttack(row + 1,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row + 1, column);
            }
            downFlag = true;
        }
        //LEFT
		//check if king can castle to the left - breaks if no rook, moves rook instead
		if (castlingCheck(7,0)) {
			fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - 2);
			isCastlingLeft = true;	//used in listener to move rook
		}
        if (board.getPiece(row, column - 1) === null && !leftFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row, column - 1);
        } else if (!leftFlag) {
            if (validAttack(row,column - 1, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row, column - 1);
            }
            leftFlag = true;
        }
        //UP
        if (board.getPiece(row - 1,column) === null && !upFlag) {
            fill(ctxHighlight, MELLOW_YELLOW, MOVE, row - 1, column);
        } else if (!upFlag) {
            if (validAttack(row - 1,column, colourBool)) {
                fill(ctxHighlight, LIGHT_RED, ATK, row - 1, column);
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