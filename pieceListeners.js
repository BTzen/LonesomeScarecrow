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

    for (var i = 1; i <= forwardMoves; i++) { //alert('p');
        //board represented as 1D array so the row # must be multiplied by the # of tiles in a row
        //tile in front of pawn is empty
        if (board.__position__[piecePosition + (i * 8)] === null) {
            fill(ctxHighlight, MELLOW_YELLOW, "move", row + i, column);
        }
        // //next two ifs check for attack moves
        if (board.__position__[piecePosition + 9] !== null && !attackFlag1) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column + 1);
            attackFlag1 = true;
        }
        if (board.__position__[piecePosition + 7] !== null && !attackFlag2) {
            fill(ctxHighlight, LIGHT_RED, "attack", row + 1, column - 1);
            attackFlag2 = true;
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