/* Billings, M., Kurylovich, A. */


// TODO prevent highlighted tiles from being displayed after clicking next problem
// TODO sometimes spam clicking on piece (king in 118) removes the piece
// TODO prevent CPU from taking turn after the player has failed to check in the required number of moves; AI moves after alert is closed
// TODO probably with AI not taking legal action for Healy problem (2 moves, #2 I believe) 
// TODO prevent player from being able to control BLACK

$(document).ready(function() {
	var canvasHighlight = document.getElementById('highlight');
	var canvasPieces = document.getElementById('chesspieceCanvas');
	var composition;
	var ctxHighlight = canvasHighlight.getContext('2d');
	var ctxPiece = canvasPieces.getContext('2d');				// the context that the pieces are drawn on - used EVERYWHERE
	board = new Board();
	init();
	
	compositions = {
		currentCompositionID : null,							// id for composition currently displayed to player
		currentCompositionGroupID : null,						// used to find composition group that composition belongs to
		nextID : 0,												// next value that will be assigned as the id to new compositions
		checkmateInTwo : new CompositionGroup(),
		checkmateInThree : new CompositionGroup(),
		checkmateInFour : new CompositionGroup()
	};
	
	populateCompositionList();
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

/* hightlights board tiles in the given colour
 * ctxHighlight context the highlight is displayed on
 * colour the colour to highlight with
 * action action that is pushed to the list of highlighted tiles
 */
function fill(ctxHighlight, colour, action) {
	if (action.column > -1 && action.column < 8 && action.row > -1 && action.row < 8) {
		ctxHighlight.fillStyle = colour;
		ctxHighlight.fillRect(action.column * LENGTH, action.row * LENGTH, LENGTH, LENGTH);
		highlightedTiles.push(action); 
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

    drawBoard(canvas, ctx);
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
 * bColour the side to log the action for
 */
function logAction(bColour) {
	var actionList = document.getElementById('actionListBody');
	var whiteMovedLast = (isWhiteTurn) ? false : true;
	
	if (bColour == WHITE) {
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
 * BUG doesn't convey checkmate
 * consider switching to FAN for language indepence
 * BUG does not convey castling
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
			break;
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
	
	string += Math.abs(logData.previousRow - 8);
	
	if (logData.action.actionType == ActionType.MOVE) {
		string += '-';
	}
	else {
		string += 'x';
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
	
	string += Math.abs(logData.action.row - 8);
	
	// check
	if (inCheck(board, WHITE) || inCheck(board, BLACK)) {		//board.blackKingTile.piece.isInCheck || board.whiteKingTile.piece.isInCheck
		string += '+';
	}
	// if ()
	
	return string;
}

/* Code to carry out player and AI gameplay.  Called through clicks on the board.
 * x the x coordinate of the user's click
 * y the y coordinate of the user's click
*/
function gameLoop(x, y) {
	if (gameIsRunning) {
		if (playerIsWhite) {
			playerTurn(board, x, y);
			
			// player moved piece - black's turn
			if (!isWhiteTurn && !gameLoopIsRunning) {	// set in playerTurn after piece is moved
				gameLoopIsRunning = true;
				CPUTurnWrapper();
			}
		}
	}
}

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
	// DEBUG
	// console.log('prev. coords ' + lastRowSelected + ' ' + lastColumnSelected);

	//deal with piece movement (including attacking) - piece selected last turn; time to move!
	if (highlightedTile) {		
		objLogData.previousRow = lastSelectedTile.row;
		objLogData.previousColumn = lastSelectedTile.column;
		
		if (pawnThatMovedTwoLastTurn !== null)
			pawnThatMovedTwoLastTurn = null;
		// check if pawn moved 2 ranks
		if (lastSelectedTile !== null && lastSelectedTile.piece.type == "Pawn") {
			if (Math.abs(lastSelectedTile.row - row) == 2) {
				pawnThatMovedTwoLastTurn = lastSelectedTile.piece;
			}
		}
		
		// handle special cases of piece movement
		if (highlightedTile.actionType == ActionType.ENPASSANT)
			enPassantHandler(highlightedTile);
		castlingHandler(lastSelectedTile, highlightedTile);
		
		//move the piece corresponding to that highlighted pattern to the selected location 
		board.movePiece(lastSelectedTile.row, lastSelectedTile.column, row, column);
		draw(board);
		
		// check if it's in a promotion tile; only works for white pieces
		// NOTE CPU (black) will move before the piece to upgrade to is selected
		if (lastSelectedTile.piece.isWhite && lastSelectedTile.piece.type === 'Pawn' && row == 0) {
			//create promotion dialog
			$('#promotion')
			.data( {isWhite: true, row: row, column: column} )	// 2nd 'row' is the variable
			.dialog({
				buttons: { 
					'Accept': function() {
						acceptPromotionListener();
						$(this).dialog('close');
					}
				},
				dialogClass: "no-close",						// remove close button
				modal: true,
				title: "Promote piece",
				close: function(event, ui) {
					// update check status for opponent
					inCheck(board, !playerIsWhite);
				
					//update tracking variables
					highlightedTile = null;
					highlightedTiles = []; 												// reset which tiles are hightlighted each time this runs
					isWhiteTurn = (lastSelectedTile.piece.isWhite) ? false : true;		// toggle game turn after a piece has moved
					
					CPUTurnWrapper();													// run code for Black's turn
				}
			});
		}
		else {
			// update check status for opponent
			inCheck(board, !playerIsWhite);
		
			//update tracking variables
			highlightedTile = null;
			highlightedTiles = []; 												// reset which tiles are hightlighted each time this runs
			isWhiteTurn = (lastSelectedTile.piece.isWhite) ? false : true;		// toggle game turn after a piece has moved
		}
	}
	/* logic used when a piece is first selected - before anything is highlighted for the player
	 * check if player clicked on their own piece and highlight the appropriate tiles in response
	 */
	else if (lastSelectedTile = getBoardTileWithCoords(board, x, y)) {
		var lastSelectedPiece = lastSelectedTile.piece;
		var legalMoves = [];			// all moves which don't place the acting side's King in check
		var potentialMoves = [];		// all moves
		var isPlayerTurn;
		var selectedKingTile;			// the King belonging to the player
		highlightedTiles = [];
		
		// DEBUG currently lets you select any piece
		// only allow interaction with pieces of the correct colour
		if (lastSelectedTile !== undefined)
			isPlayerTurn = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; 
		
		// only allow King to be selected if King is in check
		// NOTE need to test with other enemy pieces of all types
		selectedKingTile = (lastSelectedTile.piece.isWhite) ? board.whiteKingTile : board.blackKingTile;
		
		// opens the possibility of moving the other side's pieces if the player's side King is in check (for debugging)
		if (selectedKingTile !== undefined && inCheck(board, selectedKingTile.piece.isWhite)) { 		
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
			else {
				let potentialMovesForPiece;
				let movesOfCheckingPiece; 
				if (lastSelectedPiece.isWhite == selectedKingTile.piece.isWhite) {			
					potentialMovesForPiece = lastSelectedTile.piece.getStandardMoves(board, false, lastSelectedTile.row, lastSelectedTile.column);
					movesOfCheckingPiece = board.tileOfCheckingPiece.piece.getStandardMoves(board, false, board.tileOfCheckingPiece.row, board.tileOfCheckingPiece.column);
					
					for (let i = 0; i < potentialMovesForPiece.length; i++) {
						let action = potentialMovesForPiece[i];
						// if the selected piece can attack the checking piece
						if (action.actionType == ActionType.ATTACK && action.row == board.tileOfCheckingPiece.row && action.column == board.tileOfCheckingPiece.column) {
							legalMoves.push(action);
							fill(ctxHighlight, LIGHT_RED, action); // consider doing this outside the loop separately
							break;
						}
						// if the selected piece can block the checking piece and prevent it from capturing the King next move
						else if (action.agent.type !== 'Knight') {
							for (let j = 0; j < movesOfCheckingPiece.length; j++) {
								if (potentialMovesForPiece[i].row == movesOfCheckingPiece[j].row && potentialMovesForPiece[i].column == movesOfCheckingPiece[j].column) {
									// DEBUG
									// if (movesOfCheckingPiece[j].row == 5 && movesOfCheckingPiece[j].column == 6)
										// console.log();
									// vert and horz cap if row !== and col !==
									// vert cap if row ==, ...
									if (board.tileOfCheckingPiece.row == selectedKingTile.row) {
										if (Math.abs(potentialMovesForPiece[i].column - selectedKingTile.column) < Math.abs(board.tileOfCheckingPiece.column - selectedKingTile.column)) {
											legalMoves.push(potentialMovesForPiece[i]);
										}
									}
									// horz cap if col ==
									else if (board.tileOfCheckingPiece.column == selectedKingTile.column) {
										if (Math.abs(potentialMovesForPiece[i].row - selectedKingTile.row) < Math.abs(board.tileOfCheckingPiece.row - selectedKingTile.row)) {
											legalMoves.push(potentialMovesForPiece[i]);
										}
									}
									else {
										if (Math.abs(potentialMovesForPiece[i].row - selectedKingTile.row) < Math.abs(board.tileOfCheckingPiece.row - selectedKingTile.row) 
											&& Math.abs(potentialMovesForPiece[i].column - selectedKingTile.column) < Math.abs(board.tileOfCheckingPiece.column - selectedKingTile.column))
											{										
											legalMoves.push(potentialMovesForPiece[i]);
										}
									}
								}
							}
							
						}
					}
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
			}
		}
		// highlight the appropriate tiles
		else {	
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
	} 
	// player clicked off the piece
	else {	
		highlightedTiles = [];
		highlightedTile = false;
	}
}

/* Update data structure in case of en passant
 *
 */
function enPassantHandler(action) {
	// if (action.actionType === ActionType.ENPASSANT) { 
		if (action.agent.isWhite === playerIsWhite)
			board.removePiece(action.row + 1, action.column);
		else
			board.removePiece(action.row - 1, action.column);
	// }
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
 * 
 */
function CPUTurn() {
	var nextAIAction = minimax(board, BLACK);		// action object
	var agentTile;									// the tile of the piece that will be acted upon
	
	// null if there are no legal moves
	if (nextAIAction !== null) {
		agentTile = board.getTileWithPiece(nextAIAction.agent);
		objLogData.action = nextAIAction;
		objLogData.previousRow = agentTile.row;
		objLogData.previousColumn = agentTile.column;
		
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
		}
		
		if (nextAIAction.actionType == ActionType.ENPASSANT)
			enPassantHandler(nextAIAction);
		castlingHandler(agentTile, nextAIAction);
		board.movePiece(agentTile.row, agentTile.column, nextAIAction.row, nextAIAction.column);
		
		isWhiteTurn = !isWhiteTurn;
		draw(board);
	}
	// DEBUG
	// console.log('next move will move ' + nextAIAction.agent + ' from [' + agentTile.row + ', ' + agentTile.column + '] to ['
		// + nextAIAction.row + ', ' + nextAIAction.column + ']'); 
}

/* Contains the code needed to execute the CPU's turn.  Necessary to prevent the CPU from taking action before the player (in the case of promotion) has selected a piece to promote to.
 *
 */
function CPUTurnWrapper() {
	var displayText = "";
	var terminalStateData;
	var currentComposition;
	
	outputText('Turn: Black');
	// logAction(playerIsWhite);
	
	setTimeout(function() {		// setTimeout is necessary to draw the player move before drawing the CPUs move
		CPUTurn();
		
		// check if CPU move caused the game to end
		terminalTestResult = terminalGameConditionTest(board);
		if (terminalTestResult.isTerminalState) {
			gameIsRunning = false; 
			outputText(terminalTestResult.details);
		}
		else {
			outputText('Turn: White');
			// logAction(!playerIsWhite);
		}
		
		// save state
		currentComposition = getComposition(compositions.currentCompositionGroupID, compositions.currentCompositionID);
		
		if (currentComposition !== null) {
			currentComposition.states.push(new Board(board));		// cloned so each state acts as a snapshot of a board
			document.getElementById('turnsRemaining').innerHTML = parseInt(document.getElementById('turnsRemaining').innerHTML) - 1;					// moves remaining
			
			// enable undo button once the first action has been taken
			if (currentComposition.states.length == 1) {
				$('#uiUndo').attr('disabled', false);
			} 
			
			// player has made too many moves
			if (currentComposition.states.length >= compositions.currentCompositionGroupID && terminalTestResult.isTerminalState == false) {
				gameIsRunning = false;
				isWhiteTurn = true;
				alert('Too many moves!');
			}
		}
		gameLoopIsRunning = false;
	}, 500);
}
/* outputs the given string to the game state indicator above the board
 *
 */
function outputText(string) {
	document.getElementById('turn').innerHTML = string;
}