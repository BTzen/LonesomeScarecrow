/* Billings, M. 
 * Caribou Contests 
 * moved composition code here. Still seems to work fine.  Delete this after I'm sure of it.
 */
 
function Composition(id, board) {
	this.id = id;
	this.initialState = new Board(board);
	this.states = [];			// contains n-1 boards
}

function CompositionGroup() {
	this.unsolvedProblems = [];
	this.solvedProblems = [];
}
 
function getComposition(groupID, compositionID) {
	var desiredComposition = null;
	
	if (groupID == 2) {
		for (let i = 0; i < compositions.checkmateInTwo.unsolvedProblems.length; i++) {
			if (compositions.checkmateInTwo.unsolvedProblems[i].id == compositionID) {
				desiredComposition = compositions.checkmateInTwo.unsolvedProblems[i];
			}
		}
	}
	else if (groupID == 3) {
		for (let i = 0; i < compositions.checkmateInThree.unsolvedProblems.length; i++) {
			if (compositions.checkmateInThree.unsolvedProblems[i].id == compositionID) {
				desiredComposition = compositions.checkmateInThree.unsolvedProblems[i];
			}
		}
	}
	else if (groupID == 4) {
		for (let i = 0; i < compositions.checkmateInFour.unsolvedProblems.length; i++) {
			if (compositions.checkmateInFour.unsolvedProblems[i].id == compositionID) {
				desiredComposition = compositions.checkmateInFour.unsolvedProblems[i];
			}
		}
	}
	else {
		throw "invalid groupID";
	}
	
	return desiredComposition;
}

/* sets the board to a random composition and draws it to the canvas
 *
 */
function loadRandomComposition() {
	var problemType;
	var problemTypeSelector;
	var min, max, rand;
	var currentPopulatedGroupID = [2, 3, 4];

	// randomly select problem from a particular group using the dropdown
	problemTypeSelector = document.getElementById('problemTypeSelector');
	switch (problemTypeSelector.value) {
		case '0':
			// let
			// rand = ;
			break;
		case '1':
			alert("nothing for 1 yet");
		case '2':
			problemType = compositions.checkmateInTwo;
			compositions.currentCompositionGroupID = 2;
			break;
		case '3':
			problemType = compositions.checkmateInThree;
			compositions.currentCompositionGroupID = 3;
			break;
		case '4':
			problemType = compositions.checkmateInFour;
			compositions.currentCompositionGroupID = 4;
			break;
		default:
			console.log('default switch case reached');
			break;
	}
	// randomly select a composition
	max = problemType.unsolvedProblems.length;
	min = 0;
	if (problemType.unsolvedProblems.length > 0) {
		if (problemType.unsolvedProblems.length > 1) {
			while (rand == undefined || problemType.unsolvedProblems[rand].id == compositions.currentCompositionID) {
				rand = Math.floor(Math.random() * (max - min)) + min;							// return random integer between min (inclusive) and max (exclusive)
			}
		}
		else
			rand = Math.floor(Math.random() * (max - min)) + min;	
		
		compositions.currentCompositionID = problemType.unsolvedProblems[rand].id;
		board = new Board(problemType.unsolvedProblems[rand].initialState);
		draw(board);
	}
	else {
		alert("You've solved all " + problemTypeSelector.options[problemTypeSelector.selectedIndex].text + " problems!");
	}
}

function populateCompositionList() {
	// checkmate in two problems
	c = new Board();
	c.addPiece(new Rook(WHITE), 0, 7);
	c.addPiece(new Bishop(WHITE), 1, 1);
	c.addPiece(new Knight(WHITE), 1, 3);
	c.addPiece(new Rook(BLACK), 3, 3);
	c.addPiece(new King(WHITE), 4, 1);
	c.addPiece(new King(BLACK), 4, 4);
	c.addPiece(new Queen(WHITE), 6, 5);
	composition = new Composition(compositions.nextID++, c);
	compositions.checkmateInTwo.unsolvedProblems.push(composition);
	
	//http://chess.stackexchange.com/questions/12686/what-is-the-solution-to-this-mate-in-2-puzzle?rq=1
	// c = new Board();
	// c.addPiece(new King(BLACK), 0, 3);
	// c.addPiece(new Pawn(WHITE), 1, 3);
	// c.addPiece(new Queen(WHITE), 2, 3);
	// c.addPiece(new King(WHITE), 7, 4);
	
	// checkmate in three problems
	// frank healey: 200 chess problems, #45
	// c = new Board();
	// c.addPiece(new King(WHITE), 2, 3);
	// c.addPiece(new Rook(WHITE), 3, 2);
	// c.addPiece(new Pawn(WHITE), 5, 2);
	// c.addPiece(new King(BLACK), 5, 3);
	// c.addPiece(new Queen(WHITE), 6, 5);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInThree.unsolvedProblems.push(composition);
	
	// ?
	c = new Board();
	c.addPiece(new King(BLACK), 1, 3);
	c.addPiece(new Pawn(WHITE), 1, 4);
	c.addPiece(new Queen(WHITE), 3, 2);
	c.addPiece(new King(WHITE), 7, 0);
	composition = new Composition(compositions.nextID++, c);
	compositions.checkmateInThree.unsolvedProblems.push(composition);
	
	// checkmate in four problems
	// 1 - frank healey: 200 chess problems, 116.
	// c = new Board();
	// c.addPiece(new Pawn(BLACK), 2, 4);
	// c.addPiece(new Pawn(WHITE), 3, 1);
	// c.addPiece(new Pawn(BLACK), 3, 3);
	// c.addPiece(new King(WHITE), 4, 1);
	// c.addPiece(new King(BLACK), 4, 3);
	// c.addPiece(new Bishop(WHITE), 4, 4);
	// c.addPiece(new Knight(WHITE), 5, 3);
	// c.addPiece(new Rook(WHITE), 7, 4);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	/* frank healey: 200 chess problems, 117.
	 * can be solved if Black moves King to e5 or d7
	 */
	// c = new Board();
	// c.addPiece(new Bishop(WHITE), 0, 5);
	// c.addPiece(new King(BLACK), 2, 4);
	// c.addPiece(new Pawn(BLACK), 2, 5);
	// c.addPiece(new King(WHITE), 2, 6);
	// c.addPiece(new Rook(WHITE), 4, 2);
	// c.addPiece(new Pawn(BLACK), 5, 6);
	// c.addPiece(new Pawn(WHITE), 6, 3);
	// c.addPiece(new Knight(WHITE), 6, 4);
	// c.addPiece(new Pawn(WHITE), 6, 6);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// frank healey: 200 chess problems, 118.
	// c = new Board();
	// c.addPiece(new Queen(WHITE), 0, 5);
	// c.addPiece(new Pawn(BLACK), 1, 0);
	// c.addPiece(new Pawn(WHITE), 2, 0);
	// c.addPiece(new Pawn(BLACK), 2, 3);
	// c.addPiece(new King(BLACK), 2, 4);
	// c.addPiece(new Pawn(BLACK), 3, 3);
	// c.addPiece(new Knight(WHITE), 5, 2);
	// c.addPiece(new Knight(WHITE), 5, 3);
	// c.addPiece(new Pawn(BLACK), 5, 6);
	// c.addPiece(new Pawn(WHITE), 6, 6);
	// c.addPiece(new King(WHITE), 7, 7);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// frank healey: 200 chess problems, 119.
	// c = new Board();
	// c.addPiece(new King(BLACK), 0, 4);
	// c.addPiece(new King(WHITE), 0, 7);
	// c.addPiece(new Bishop(BLACK), 1, 1);
	// c.addPiece(new Bishop(BLACK), 1, 4);
	// c.addPiece(new Pawn(BLACK), 1, 6);
	// c.addPiece(new Knight(WHITE), 3, 2);
	// c.addPiece(new Bishop(WHITE), 5, 3);
	// c.addPiece(new Rook(WHITE), 7, 4);
	// c.addPiece(new Rook(WHITE), 7, 5);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 5 - frank healey: 200 chess problems, 120.
	// c = new Board();
	// c.addPiece(new Rook(BLACK), 0, 0);
	// c.addPiece(new Queen(BLACK), 0, 6);
	// c.addPiece(new Rook(WHITE), 1, 4);
	// c.addPiece(new Bishop(BLACK), 1, 5);
	// c.addPiece(new Pawn(BLACK), 2, 3);
	// c.addPiece(new Pawn(BLACK), 3, 6);
	// c.addPiece(new Rook(BLACK), 4, 7);
	// c.addPiece(new King(BLACK), 5, 1);
	// c.addPiece(new Pawn(BLACK), 5, 7);
	// c.addPiece(new Pawn(WHITE), 6, 1);
	// c.addPiece(new Knight(WHITE), 6, 2);
	// c.addPiece(new Queen(WHITE), 6, 5);
	// c.addPiece(new King(WHITE), 6, 7);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 6 - frank healey: 200 chess problems, 121.
	// c = new Board();
	// c.addPiece(new Knight(WHITE), 0, 5);
	// c.addPiece(new Bishop(WHITE), 1, 1);
	// c.addPiece(new Knight(BLACK), 1, 3);
	// c.addPiece(new Bishop(BLACK), 1, 4);
	// c.addPiece(new Bishop(BLACK), 1, 5);
	// c.addPiece(new Knight(WHITE), 1, 6);
	// c.addPiece(new Pawn(WHITE), 2, 2);
	// c.addPiece(new King(BLACK), 2, 3);
	// c.addPiece(new Pawn(BLACK), 3, 4);
	// c.addPiece(new Pawn(BLACK), 4, 2);
	// c.addPiece(new Queen(WHITE), 5, 5);
	// c.addPiece(new Queen(BLACK), 6, 0);
	// c.addPiece(new Bishop(WHITE), 7, 6);
	// c.addPiece(new King(WHITE), 7, 7);
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 7 - frank healey: 200 chess problems, 122
	c = new Board();
	c.addPiece(new Bishop(BLACK), 0, 5);
	c.addPiece(new Pawn(BLACK), 1, 7);
	c.addPiece(new Rook(BLACK), 2, 2);
	c.addPiece(new Rook(BLACK), 2, 3);
	c.addPiece(new Bishop(WHITE), 3, 0);
	c.addPiece(new Knight(WHITE), 3, 4);
	c.addPiece(new King(BLACK), 4, 3);
	c.addPiece(new Knight(WHITE), 4, 5);
	c.addPiece(new Queen(WHITE), 4, 7);
	c.addPiece(new Pawn(WHITE), 5, 3);
	c.addPiece(new Pawn(BLACK), 5, 5);
	c.addPiece(new King(WHITE), 6, 0);
	c.addPiece(new Pawn(WHITE), 6, 1);
	c.addPiece(new Pawn(WHITE), 6, 5);
	c.addPiece(new Bishop(BLACK), 7, 7);
	composition = new Composition(compositions.nextID++, c);
	compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 8
	// c = new Board();
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 9
	// c = new Board();
	// composition = new Composition(compositions.nextID++, c);
	// compositions.checkmateInFour.unsolvedProblems.push(composition);
	
	// 10
}