/* Billings, M., Kurylovich, A. */
$(document).ready(function() {
	var canvasHighlight = document.getElementById('highlight');
	var canvasPieces = document.getElementById('chesspieceCanvas');
	var ctxHighlight = canvasHighlight.getContext('2d');
	var ctxPiece = canvasPieces.getContext('2d');				// the context that the pieces are drawn on - used EVERYWHERE
	board = new Board();
});	

/* Find a piece on the board using pixel coordinates on the canvas
 * x the horizontal component of the 2d coordinate 
 * y the vertical component of the 2d coordinate
*/
function getBoardTileWithCoords(board, x, y) {
	let col = Math.floor(x / LENGTH);
	let row = Math.floor(y / LENGTH);
	let result = board.getTile(row, col);
	console.log(result);
	return result;
}
	
/* Draws the visual representation of the physical board in a checkered patterns using two shades
of brown.

MIGHT WANT TO SEPARATE THIS, PLACEPIECES AND INIT INTO AN INITIALIZE.JS
*/
function drawBoard(canvas, ctx) {
    var white = true;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (!white) {
                ctx.fillStyle = "rgb(160,82,45)";
                ctx.fillRect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
                white = true;
            } else {
                ctx.fillStyle = "rgb(245,222,179)";
                ctx.fillRect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
                white = false;
            }
        }
        white = !white;
    }
}

/* Draws a piece from the backing data structure to the board
 * board the desired board to pull from
 * row expects row index (ie. 0-7)
 */
function drawPiece(board, tile) {
	var x = tile.column * LENGTH;
	var y = (tile.row + 1) * LENGTH - OFFSET;
	ctxPiece.clearRect(x, y - 65, LENGTH, LENGTH);						//clear tile first; need (y - 65) to adjust the coordinates to properly position vertical pixel
	ctxPiece.fillText(String.fromCharCode(tile.piece.unicode), x, y);	//draws piece on board - coords specify bottom left corner of text
}

/* Draws pieces on the board in the positions reflected by the backing data structure
 *
 */
function draw(board) {
	ctxPiece.clearRect(0, 0, LENGTH * 8, LENGTH * 8);					//clear piece images from board
	for (var i = 0; i < board.occupiedTiles.length; i++) {
		drawPiece(board, board.occupiedTiles[i]);
	}
}

/* This method initializes on load and creates an onclick event.
*/
function init() {
    canvas = document.getElementById('chessboard');
    canvasPieces = document.getElementById('chesspieceCanvas');
    canvasHighlight = document.getElementById('highlight');
	ctx = canvas.getContext('2d');
    ctxPiece = canvasPieces.getContext('2d');
	ctxPiece.font = PIECE_FONT;
    ctxHighlight = canvasHighlight.getContext('2d');

	/* accounts for fact that board may not be positioned in the top left corner of the page
	 * border isn't counted with offset()
	*/
    var canvasLeft = $('#board').offset().left + parseInt($('#board').css('border-left-width')); 
    var canvasTop = $('#board').offset().top;

    drawBoard(canvas, ctx);
	
	// click event will check what piece has been clicked
    canvasPieces.addEventListener('click', function(event) {
        ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);

        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop; //alert('event.pageX - canvasLeft = ' + event.pageX + '-' + canvasLeft);
        gameLoop(x, y);
    });
}

/* Promote a piece to another
 * created outside of board because it doesn't feel like the board stuff should contain the rules (ie. encapsulation)
*/
function promotePiece(piece) {
	//display promotion choice to user
	$('#promotionWindow').css('display', 'initial');
	//replace existing piece with a piece of that type
}

/* Outputs the result of an action to the actionLog.
 *
 */
function logAction(pieceType, previousRow, previousColumn, action) {
	console.log();
	var actionList = document.getElementById('actionListBody');
	
	if (lastSelectedTile.piece.isWhite) {
		actionList.innerHTML += "<tr><td>" + ++actionCount + "." + "</td>" +
			"<td>" + createChessNotationData(board, objLogData) + "</td>"; //convert('King', prevTileOfMovedPiece.row, prevTileOfMovedPiece.column, ) + 
	}
	else {
		// $('#actionList tr').append("<td>black</td>");
		var lastTd = $('#actionList tr').last().append("<td>&nbsp;" + createChessNotationData(board, objLogData) + "</td");
		console.log();
	}
	// move scrollbar to the bottom to display new entry
	var table = document.getElementById('actionList');
	table.scrollTop = table.scrollHeight - table.clientHeight;
}

/* return a string representing the action performed.  This information is displayed to the user within #actionList.
 *
 */
function createChessNotationData(board, logData) {
	var string = '';
	
	switch (logData.action.agent.type) {
		case 'King':
			string += 'K';
			break;
		case 'Queen':
			string += 'Q';
			break;
		case 'Rook':
			string += 'R';
			break;
		case 'Bishop':
			string += 'B';
		case 'Knight':
			string += 'N';
			break;
		default:
			break;
	}
	
	switch (logData.previousColumn) {
		case 0:
			string += 'a';
			break;
		case 1:
			string += 'b';
			break;
		case 2:
			string += 'c';
			break;
		case 3:
			string += 'd';
			break;
		case 4:
			string += 'e';
			break;
		case 5:
			string += 'f';
			break;
		case 6:
			string += 'g';
			break;
		case 7:
			string += 'h';
			break;
		default:
			throw "invalid column provided to log";
			break;
	}
	
	string += logData.previousRow;
	
	if (logData.action.actionType == ActionType.MOVE) {
		string += '-';
	}
	else {
		string += 'x';
	}
	
	// checkmate
		
	
	if (board.blackKingTile.piece.isInCheck || board.whiteKingTile.isInCheck) {
		string += '+';
	}
	
	// location moved to
	switch (logData.action.column) {
		case 0:
			string += 'a';
			break;
		case 1:
			string += 'b';
			break;
		case 2:
			string += 'c';
			break;
		case 3:
			string += 'd';
			break;
		case 4:
			string += 'e';
			break;
		case 5:
			string += 'f';
			break;
		case 6:
			string += 'g';
			break;
		case 7:
			string += 'h';
			break;
		default:
			throw "invalid column provided to log";
			break;
	}
	
	string += logData.action.row;
	return string;
}

/* Code to carry out player and AI gameplay.  Called through clicks on the board.
 * x the x coordinate of the user's click
 * y the y coordinate of the user's click
*/
function gameLoop(x, y) { 
	if (gameIsRunning) {
		if (isWhiteTurn) {
			if (playerIsWhite) {
				playerTurn(board, x, y);
		
				// player moved piece
				if (isWhiteTurn == false) {	// set in playerTurn after piece is moved
					logAction();
					if (terminalGameConditionTest(board)) { //terminalGameConditionTest()
						console.log('terminalGameConditionTest true');
					}
					else {
						toggleTurnDisplayText();
					}
				}
			}
			// else CPU is white
		}
		else {
			if (playerIsWhite) {
				// CPU
				playerTurn(board, x, y);
				
				if (terminalGameConditionTest(board)) { //terminalGameConditionTest()
					console.log('terminalGameConditionTest true');
				}
				else {
					toggleTurnDisplayText();
				}
				//playerTurn
				
		
				if (isWhiteTurn == true) {	// set in playerTurn after piece is moved
					logAction();
					toggleTurnDisplayText();
				}
			}
			 
			
			
			// if (!isWhiteTurn) {
				// // setTimeout(function() {		// setTimeout is necessary to draw the player move before drawing the CPUs move
					// // //if (!isWhiteTurn) 
					// // CPUTurn(x, y);
				// // }, 20);
				// logAction();
				// toggleTurn();
			// }
		}
	}
	// game is over
	if (!gameIsRunning) {
		board.initialize(WHITE);
	}
}
// TODO* add board param
/* code supporting the player's interaction with the game
 *
 */
function playerTurn(board, x, y) {
	var column = Math.floor(x / LENGTH);		// find out the intersection of the row and column using the coordinates of where the player clicked
	var row = Math.floor(y / LENGTH);
	var highlightedTile = null; 				// not null if tile selected is highlighted in someway, ie. can the piece be moved there

	//check if selected tile is highlighted
	highlightedTiles.forEach(function(action) {
		if (action.row == row && action.column == column) {
			highlightedTile = action;
			objLogData.action = action;
		}
	});
	//console.log('prev. coords ' + lastRowSelected + ' ' + lastColumnSelected);

	//deal with piece movement (including attacking) - piece selected last turn; time to move!
	if (highlightedTile) {		
		objLogData.previousRow = lastSelectedTile.row;
		objLogData.previousColumn = lastSelectedTile.column;
		
		enPassantHandler(highlightedTile);

		if (pawnThatMovedTwoLastTurn !== null)
			pawnThatMovedTwoLastTurn = null;
		// check if pawn moved 2 ranks
		if (lastSelectedTile !== null && lastSelectedTile.piece.type == "Pawn") {
			if (Math.abs(lastSelectedTile.row - row) == 2) {
				pawnThatMovedTwoLastTurn = lastSelectedTile.piece;
			}
		}
		
		castlingHandler(lastSelectedTile, highlightedTile);
		
		//move the piece corresponding to that highlighted pattern to the selected location 
		board.movePiece(lastSelectedTile.row, lastSelectedTile.column, row, column);
		draw(board);
		
		//check if it's in a promotion tile; only works for white pieces
		if (lastSelectedTile.piece.isWhite && lastSelectedTile.piece.type === 'Pawn') {
			if (row == 0) {
				//call promotion fn
				$('#promotion')
					.data( {isWhite: true, row: row, column: column} )	// 2nd 'row' is the variable
					.dialog({
						dialogClass: "no-close",						// remove close button
						modal: true,
						title: "Promote piece"
					});
			}
		}
		
		//update tracking variables
		highlightedTile = null;
		highlightedTiles = []; 												// reset which tiles are hightlighted each time this runs
		isWhiteTurn = (lastSelectedTile.piece.isWhite) ? false : true;		// toggle game turn after a piece has moved
	}
	/* logic used when a piece is first selected - before anything is highlighted for the player
	 * check if player clicked on their own piece and highlight the appropriate tiles in response
	 */
	else if (lastSelectedTile = getBoardTileWithCoords(board, x, y)) {
		var lastSelectedPiece = lastSelectedTile.piece;
		var legalMoves = [];			// all moves which don't place the acting side's King in check
		var potentialMoves = [];		// all moves
		var isPlayerTurn;
		highlightedTiles = [];
		
		// DEBUG currently lets you select any piece
		// only allow interaction with pieces of the correct colour
		if (lastSelectedTile !== undefined)
			isPlayerTurn = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; 
		
		// only allow King to be selected if King is in check
		// NOTE need to test with other enemy pieces of all types
		let selectedKingTile = (lastSelectedTile.piece.isWhite) ? board.whiteKingTile : board.blackKingTile;		//(playerIsWhite)
	
		if (selectedKingTile !== undefined && inCheck(board, selectedKingTile.piece.isWhite)) { 		// opens the possibility of moving the other side's pieces if the player's side King is in check
			if (lastSelectedPiece.type == 'King') {
				potentialMoves = lastSelectedPiece.getStandardMoves(board, false, lastSelectedTile.row, lastSelectedTile.column);
			
				//only highlight moves that will get the King out of check.  Could alternatively avoid potential checks by ensuring the king in check doesn't move into any of the movement tiles listed in potential moves.  This would work for all pieces whose movement options are the same as their attack options.
				potentialMoves.forEach(function(action) {
					let futureBoardState = new Board(board);
					futureBoardState.movePiece(lastSelectedTile.row, lastSelectedTile.column, action.row, action.column);
					if (!inCheck(futureBoardState, selectedKingTile.piece.isWhite)) {
						let actionColour;
						if (action.actionType == ActionType.MOVE) {
							actionColour = MELLOW_YELLOW;
						}
						else if (action.actionType == ActionType.ATTACK) {
							actionColour = LIGHT_RED;
						}
						fill(ctxHighlight, actionColour, action);
						legalMoves.push(action);
					}
				});
			} 
			// allow selection of pieces that can get the King out of check
			// TODO doesn't work if you block the checkingPiece's path to the kind
			else {
				let potentialMovesForPiece;
				if (lastSelectedPiece.isWhite == selectedKingTile.piece.isWhite) {			
					potentialMovesForPiece = lastSelectedTile.piece.getStandardMoves(board, false, lastSelectedTile.row, lastSelectedTile.column);
			
					for (let i = 0; i < potentialMovesForPiece.length; i++) {
						let action = potentialMovesForPiece[i];
						// if the selected piece can attack the checking piece
						if (action.actionType == ActionType.ATTACK && action.row == board.tileOfCheckingPiece.row && action.column == board.tileOfCheckingPiece.column) {
							legalMoves.push(action);
							fill(ctxHighlight, LIGHT_RED, action);
							break;
						}
						// if the selected piece can block the checking piece and prevent it from capturing the King next move
						else if (action.agent.type !== 'Knight') {
							
						}
					}
				}
			}
		}
		else {	// highlight the appropriate tiles
			let potentialMoves = lastSelectedPiece.getStandardMoves(board, false, lastSelectedTile.row, lastSelectedTile.column); 
			
			if (lastSelectedPiece.type == 'Pawn')
				potentialMoves = potentialMoves.concat(getEnPassantMoves(board, false, lastSelectedTile));
			else if (lastSelectedPiece.type == 'King') {
				// castling options
				// check right
				let castlingRookTile = board.getTile(lastSelectedTile.row, 7);
				if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile)) {		
					legalMoves.push(new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column + 2));	// can push to legal moves as canCastle checks for move legality inherently
				}
				// check left
				castlingRookTile = board.getTile(lastSelectedTile.row, 0);
				if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile))	{
					legalMoves.push(new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column - 2));
				}
			}
			// only allow actions that won't place the King in check
			potentialMoves.forEach(function(action) {
				let futureBoardState = new Board(board);
				futureBoardState.movePiece(lastSelectedTile.row, lastSelectedTile.column, action.row, action.column);
				if (!inCheck(futureBoardState, lastSelectedPiece.isWhite)) {
					legalMoves.push(action);
				}
			});
				
			// highlight legal moves
			legalMoves.forEach(function(action) {
				let actionColour;
				if (action.actionType == ActionType.MOVE) {
					actionColour = MELLOW_YELLOW;
				}
				else if (action.actionType == ActionType.ATTACK) {
					actionColour = LIGHT_RED;
				}
				fill(ctxHighlight, actionColour, action);
			});
		}
		// King is in checkmate if there are no legal moves for the King to make
		// if (legalMoves.length == 0) {
			// let kingsMoves = selectedKingTile.piece.getStandardMoves(board, false, selectedKingTile.row, selectedKingTile.column);
			
			// // alert('code for checkmate');
		// }
	} 
	else {	// player clicked off the piece
		highlightedTiles = [];
		highlightedTile = false;
	}
}

/* Update data structure in case of en passant
 *
 */
function enPassantHandler(action) {
	if (action.actionType === ActionType.ENPASSANT) { 
		if (action.agent.isWhite === playerIsWhite)
			board.removePiece(action.row + 1, action.column);
		else
			board.removePiece(action.row - 1, action.column);
	}
}

/* Update data structure in the case of castling.  Code is common to player and CPU.
 *
 */
function castlingHandler(agentTile, actionTile) {
	// castling logic
	if (agentTile.piece.type == 'King') {
		//move the rook to the appropriate position
		if (Math.abs(agentTile.column - actionTile.column) == 2) {
			let rookTile = null;
			if (agentTile.column < actionTile.column) {				// castle right
				rookTile = board.getPiece(agentTile.row, 7);
				board.movePiece(agentTile.row, 7, agentTile.row, actionTile.column - 1);
			}
			else {
				rookTile = board.getPiece(agentTile.row, 0);		// castle left
				board.movePiece(agentTile.row, 0, agentTile.row, actionTile.column + 1);
			}
		}
	}
}

/* code controlling AI action
 * TODO support 
 */
function CPUTurn(x, y) {
	// DEBUG
	// var agentTile = board.getTile(4, 2);
	// var highlightedTile = new Action(agentTile.piece, ActionType.ENPASSANT, 5, 3);
	var nextAIAction = new Action(board.getPiece(6, 3), ActionType.MOVE, 7, 3);
	
	// var nextAIAction = minimax(board, BLACK);		// action object
	var agentTile;									// the tile of the piece that will be acted upon
	if (nextAIAction !== null) {
		agentTile = board.getPieceTile(nextAIAction.agent);
	
		enPassantHandler(nextAIAction);
		
		if (pawnThatMovedTwoLastTurn !== null)
			pawnThatMovedTwoLastTurn = null;
		// check if pawn moved 2 ranks
		if (agentTile.piece.type == "Pawn") {
			if (Math.abs(nextAIAction.row - agentTile.row) == 2) {
				pawnThatMovedTwoLastTurn = agentTile.piece;
			}
		}
		
		// promotion
		if (agentTile.piece.type == "Pawn" && agentTile.row !== 7 && nextAIAction.row == 7) {
			let CPUcolour = (playerIsWhite) ? BLACK : WHITE;
			board.addPiece(new Queen(CPUcolour), agentTile.row, agentTile.column);
			// agentTile = new Tile(new Queen(CPUcolour), agentTile.row, agentTile.column);
		}
		
		castlingHandler(agentTile, nextAIAction);
		board.movePiece(agentTile.row, agentTile.column, nextAIAction.row, nextAIAction.column);

		draw(board);
	}
	// // AI caught in checkmate
	// else {
		// alert("Success! You won!");
		// gameIsRunning = false;
		
	// }
	
	// DEBUG
	// console.log('next move will move ' + nextAIAction.agent + ' from [' + agentTile.row + ', ' + agentTile.column + '] to ['
		// + nextAIAction.row + ', ' + nextAIAction.column + ']'); 
}

/* resets DS to initial state and draws it to the argument board
 * board the board which will be drawn to the canvas
 */
function resetBoard(board) {
	board.initialize();
	draw(board);
}

function toggleTurnDisplayText() {
	var turnText = (isWhiteTurn) ? 'Turn: White' : 'Turn: Black';
	document.getElementById('turn').innerHTML = turnText;
}

window.onload = init;