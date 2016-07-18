/* contains data necessary to determine legal actions for a given piece at a given point in time.  This includes what tiles the piece can reach from it's current tile and whether that state is reached through movement or attack
 * action  whether the action is purely movement or causes a piece to be removed from the board, ie. an attack
 */
function Action(agent, actionType, row, column) {
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
	this.agent = agent;
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