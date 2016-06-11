/* contains data necessary to determine legal actions for a given piece at a given point in time.  This includes what tiles the piece can reach from it's current tile and whether that state is reached through movement or attack
 * action  whether the action is purely movement or causes a piece to be removed from the board, ie. an attack
 */
function Move(actionType, row, column) {
	var objIsActionType = false;
	
	for (property in ActionType) {
		if (actionType === ActionType[property]) {		//check if arg is in fact an ActionType property
			this.actionType = actionType;
			objIsActionType = true;
			break;
		}
	}
	if (!objIsActionType)
		throw "incorrect object type for argument 'actionType': " +  typeof actionType + ".  Requires property of ActionType.";
	this.row = row;
	this.column = column;
}

/* Effectively an enum used to determine whether an action a piece takes is a result of pure movement or an attack.  Used for hightlighting the tiles the proper colour.
 *
 */
const ActionType = {
	MOVE : Symbol("MOVE"),
	ATTACK : Symbol("ATTACK")
};

/* Test if the argument type is valid property of ActionType
 *
 */ 
// function isActionType(arg) {
	// // parse symbol format to extract symbol description
	// var firstCharOfDesc = String(arg).indexOf('(') + 1;
	// var firstCharAfterDesc = String(arg).indexOf(')');
	
	// return (ActionType.hasOwnProperty( String(arg).substring(firstCharOfDesc, firstCharAfterDesc)));
// }

//testing
// var newMove = new Move(ActionType.MOVE, 4, 3);
// for (var p in ActionType) {
	// console.log(p);
	// console.log(ActionType.MOVE === ActionType[p]);
// }
// console.log("newMove.actionType: " + String(newMove.actionType));
// console.log(ActionType.hasOwnProperty("MOVE"));
// console.log(ActionType.MOVE);
// var t = String(ActionType.ATTACK).substring(String(ActionType.ATTACK).indexOf('(') + 1, String(ActionType.ATTACK).indexOf(')') );
// console.log(t);
// console.log(ActionType.hasOwnProperty(t));
// console.log('isActionType: ActionType.ATTACK? ' + isActionType("MOVE"));

/* Used to define the method through which a piece reaches a given position
 */
// class Action {
	// constructor(action) {
		// this.action = action;
	// }
	// toString() {
		// return `Action.${this.action}`;
	// }
// }

// Action.MOVE = new Action('MOVE');
// Action.ATTACK = new Action('ATTACK');

// alert(Action.MOVE);
// console.log(Action.MOVE instanceof Action);