import * as BlockActionsConsts from "../constants/BlockActions";

export const MOVE_ACTION_FACTOR = 100; // user triggered a last move left / right to fit the piece
export const DROP_ACTION_FACTOR = 50; // user triggered a drop
export const DEFAULT_FACTOR = 1; // normal drop without lines completed


export default class ScoreResolver{
    constructor(){
        this.score = 0;
        this.lines = 0;
        this._lastAction = undefined;
        this.lastAutoActions = []; // keep last two auto actions
        this.onScoreUpdateCallback = undefined;
    }

    set lastUserAction(action){
        this._lastAction = action;
        this.lastAutoActions = [];
    }

    set lastAutoAction(action){
        const length = this.lastAutoActions.length;
        if  (length === 2)
            return;
        this.lastAutoActions.push(action);
    }

    resetScore(){
        this.score = 0;
    }

    resolve (numLines) {
        let res =  numLines * DEFAULT_FACTOR;
        switch (this._lastAction){
            case BlockActionsConsts.MOVE_LEFT:
            case BlockActionsConsts.MOVE_RIGHT:
                if (this.lastAutoActions.length === 1) // user input was just before lock
                    res = numLines * MOVE_ACTION_FACTOR;
                break;
            case BlockActionsConsts.DROP:
                res = numLines * DROP_ACTION_FACTOR;
                break;
        }

        this.score += res + DEFAULT_FACTOR; // add one point per piece placement on board
        this.lines += numLines;
        if (this.onScoreUpdateCallback)
            this.onScoreUpdateCallback(this.score, this.lines);
        return this.score;
    }

}