/* Billings, Kurylovich */

$(window).load(function() {
	document.getElementById('uiStart').addEventListener('click', startMatchListener);
	document.getElementById('uiSurrender').addEventListener('click', surrenderListener);
	

});

/*
 *
*/
function exitFreeplayListener() {
	// hide freeplay fieldset and show the std one
	$('#freeplayInfo').css('display', 'none');
	$('#gameInfo').css('display', 'initial');
	
	//clear board
	board.clear(0, 0, 8, 8);
	
	$('#turn').css('visibility', 'hidden');
}

/*
 *
*/
function freeplayStartListener() {
	//disable piece adding functionality
	$('#fpAddPiece').prop('disabled', true);
	$('#fpStart').attr('disabled', true);
	$('#fpReset').attr('disabled', false);
	
	isFreeplayTest = true;
	isGameRunning = true;
	console.log("freeplay testing has begun");
	/*
	var playerMovesBlack = ($('input[name=fpPlayerMovesBlack]:checked').val() == "true");
	if (playerMovesBlack) {
		isFreeplayTest = true;
		isGameRunning = true;	//required to prevent start match alert from popping up
		alert("freeplay testing has begun")
	}
	else {
		alert("freeplay match has begun");
	}
	*/
}

function saveLayoutListener() {
	savedBoard = $.extend(true, {}, oldObject);			//make a deep copy of the board	
}

function loadLayoutListener() {
	if (savedBoard != undefined)
		board = savedBoard;
	
	board.drawPieces();
	//freeplayStartListener();
}
/* show promotion dialog when pawn reaches opposite side of board
 *
 */
function acceptPromotionListener() {
	var newPiece;
	var isWhite = $('#promotion').data('isWhite');
	var row = $('#promotion').data('row');
	var col = $('#promotion').data('column');
	//alert($('#promotion').data('isWhite') + ' ' + $('#promotion').data('row') + ' ' + $('#promotion').data('column'));
	switch ($('input[name=promotionPick]:checked').val()) {
		case "Queen":
			newPiece = new Queen(isWhite);
			break;
		case "Rook":
			newPiece = new Rook(isWhite);
			break;
		case "Bishop":
			newPiece = new Bishop(isWhite);
			break;
		case "Knight":
			newPiece = new Knight(isWhite);
			break;
	}
	
	board.addPiece(newPiece, row, col);
	$('#promotion').dialog("close");	//close dialog
	draw(board);
}

/* Add piece to board for freeplay
 * May not need to have isKingPlaced
*/
function addPiece(isWhite, pieceName, rank, file) {
	var row = parseInt(rank);
	var col = parseInt(file);
	var color = isWhite == "true";
	var piece;
	
	//for adding piece to the div
	var file = $('select[name=fpFile] option:selected').text();
	var rank = $('select[name=fpRank] option:selected').text();
	
	//add piece to board and backing data structure
	switch (pieceName) {
		case "Pawn":
			piece = new Pawn(color);
			break;
		case "Rook":
			piece = new Rook(color);
			break;
		case "Knight":
			piece = new Knight(color);
			break;
		case "Bishop":
			piece = new Bishop(color);
			break;
		case "Queen":
			piece = new Queen(color);
			break;
		case "King":
			piece = new King(color);
			if (color) {
				if (isWhiteKingPlaced) {
					board.removePiece(whiteKingData[1], whiteKingData[2]);	//remove old king from board
					removePiece(whiteKingData[0], file + rank);	//remove old king from list
				}
			
				isWhiteKingPlaced = true;
				whiteKingData = [listitemID, row, col];	
			}
			else {
				if (isBlackKingPlaced) {
					board.removePiece(blackKingData[1], blackKingData[2]);	//remove old king from board
					removePiece(blackKingData[0], file + rank);	//remove old king from list
				}
				isBlackKingPlaced = true;
				blackKingData = [listitemID, row, col];	
			}
			break;
	}
	
	//make sure there's only 1 list entry per tile (eg. there can't be 2 different pieces at 'a1' simulataneously)
	var tileIndex = -1;	//store index of the list item that's currently in the desired position
	for (var i = 0; i < occupiedTiles.length; i++) { //mimic behaviour of .indexOf method, since that method doesn't work for complex arrays
		if (occupiedTiles[i][1] == (file + rank))	{
			tileIndex = i; 
			break;
		}
	}
	if (tileIndex != -1) {	//may have compatibility issues with older browsers
		removePiece(occupiedTiles[tileIndex][0], occupiedTiles[tileIndex][1]); //remove the old piece and replace the list item currently at that position with the new 1
		occupiedTiles.splice(tileIndex,1);	//remove item from array at that index
		
		//make the appropriate changes if the new piece is booting out a king
		if (whiteKingData != null && whiteKingData[1] == row && whiteKingData[2] == col) {
			isWhiteKingPlaced = false;
			whiteKingData = null;
		}
		if (blackKingData != null && blackKingData[1] == row && blackKingData[2] == col) {
			isBlackKingPlaced = false;
			blackKingData = null;
		}
	}
	occupiedTiles.push([listitemID, file + rank, pieceName]);		//add the element to the occupiedTiles list
	//console.log(listitemID + ', ' + (file + rank) + ', ' + pieceName); //debug
	board.placePiece(piece, row, col);	//overwrite the old piece if the user attempts to place another piece on an already occupied tile
	
	//append new entry to list
	$('#freeplayPieces ol').append('<li>' + String.fromCharCode(piece.unicode) + ' ' + 
		file + rank + ' ' + '<input id="freeplayEntry' + listitemID + '" type="button" value="Remove" onclick="removePiece(' + listitemID + ', \'' + file + rank + '\')"></li>'); 
		/*alert('<input id="freeplayEntry' + listitemID + '" type="button" value="Remove" onclick="removePiece(' + listitemID++ + ', \'' + file + rank + '\')">');*/
	listitemID++;
}

/* begin a match against AI on "Start" button click
 *
*/
function startMatchListener() {
	// var enteredPly = $('#uiPly').val();
	// treeDepth = (enteredPly > 4 || enteredPly < 2) ? 4 : enteredPly;
	// $('#uiPly').attr('disabled', true);
	
	// //enable AI
	startAI();
	
	if (isGameRunning) {
		// board.clear(0,0,8,8); //clean up the board
		// placePiecesForMatch(true);
		// $('#uiFreeplay').attr('disabled', true);
		// alert("The match has started!");
	}
	
	//place pieces on board
	board.initialize(true);
	draw(board);
	
	//DEBUG
	minimax(board);
	//max(board);
}

/* Remove piece from board and from backing data structure
 *
*/
function removePiece(entryID, fileRankString) {
	if (isFreeplayTest) {	
		//do nothing
	}
	else {
		var row = (8 - parseInt(fileRankString.substring(1,2)));
		var col = parseInt(fileRankString.charCodeAt(0)) - 97; //97 reduces value of a to 0
		board.removePiece(row, col);	//doesn't do anything if there isn't a piece at that location
		
		//remove piece from occupied tile list
		for (var i = 0; i < occupiedTiles.length; i++) {
			if (occupiedTiles[i][0] == entryID) {
				occupiedTiles.splice(i,1);
			}
		}
		$('#freeplayEntry' + entryID).parent().remove();	//delete list item
	}
}

function surrenderListener() {
	if (isGameRunning) {
		//reset board to initial state
		isGameRunning = false;
		$('#uiPly').attr('disabled', false);
		$('#uiFreeplay').attr('disabled', false);
		$('.uiSurrender').attr('disabled', true);
		$('.uiStart').attr('disabled', false);
		//alert($('#freeplayInfo').css('display'));
		board.clear(0, 0, 8, 8);
		//freeplay options
		if ($('#freeplayInfo').css('display') == "block") {
			$('#fpAddPiece').attr('disabled', false);
			isFreeplayTest = false;
		}
		else {
			reinit(true);  // CALL ON START INSTEAD IN CASE AI SURRENDERS?!?!
			alert("Your conditions of surrender have been accepted!");
		}
		
		document.getElementById('highlight').getContext('2d').clearRect(0,0, LENGTH * 8, LENGTH * 8);
	}
	else {
		alert("You can't give up if you haven't even started yet!");
	}
}

/* doesn't currently stop the game
*/
function freeplayListener() {
	// hide normal fieldset and show the one for freeplay
	$('#gameInfo').css('display', 'none');
	$('#freeplayInfo').css('display', 'initial');
	
	// handle switching changes (ie. clear board, stop AI, etc.)
	$('#turn').prop('display', 'none');
	
	board.clear(0, 0, 8, 8);
}

function resetListener() {
	if (savedBoard !== undefined) {
		board.clear();
		board = savedBoard;
		
	}
	$('#fpReset').attr('disabled', true);
}

