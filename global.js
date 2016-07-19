const BLACK = false;	// the player that moves second
const LENGTH = 75;
const OFFSET = 10;
const PIECE_FONT = "70px Arial unicode MS";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.7)";
const LIGHT_RED = "rgba(255, 0, 0, 0.25)"
const WHITE = true;		// the player that moves first

var canvas;
// var canvasPieces;
var ctx;
// var ctxPiece;

var actionCount = 0;					// keep track of the number of moves that have been made in the current game
var board;								// primary board used to play the game
var isWhiteTurn = true;					// change back to TRUE; changed to FALSE for debugging minimax
var gameIsRunning = false;				// true when the player is playing a game
var highlightedTiles = [];
var lastSelectedTile; 					// for moving pieces
var pawnThatMovedTwoLastTurn = null;	// pawn that moved two tiles on the last turn	

var playerIsWhite = true;
var whiteKingTile = undefined;
var blackKingTile = undefined;
var prevLocationOfMovedPiece = {		// store the previous location of the most recently moved chess piece
	row : undefined,
	column : undefined
};