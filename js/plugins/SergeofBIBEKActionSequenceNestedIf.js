var Imported = Imported || {};
Imported["SergeofBIBEK Action Sequence Nested If"] = 1.00;

if(Imported.YEP_BattleEngineCore)
{
    //Turn off Yanfly's if

    BattleManager.actionConditionsMet = function(actSeq) 
    {
        return true;
    };

    BattleManager.processActionSequenceCheck = function(actionName, actionArgs) 
    {
        return this.processActionSequence(actionName, actionArgs)
    };

    //Alias of Yanfly's BattleManager.processActionSequence function.
    var SergeofBIBEK_ASNestedIf_BattleManager_processActionSequence = BattleManager.processActionSequence;
    BattleManager.processActionSequence = function(actionName, actionArgs)
    {
        // Action Sequence If Start
        if (actionName.match(/^\s*IF .*/i) || actionName.match(/^\s*ELSE IF .*/i))
        {
            return this.SergeofBIBEKIf();
        }

        //Call the original
        return SergeofBIBEK_ASNestedIf_BattleManager_processActionSequence.call(this, actionName, actionArgs);
    };


    BattleManager.SergeofBIBEKIf = function()
    {
        //Some useful vars for the if condition
        var subject = this._subject;
        var user = this._subject;
        var target = this._targets[0];
        var targets = this._targets;
        var action = this._action;
        var item = this._action.item();

        var loopCondition = this._actSeq[0].match(/IF (.*)/i)[1];

        //array to hold the action sequences 
        BattleManager.SergeofBIBEKIfArray = [[], [], loopCondition];


        //Store all commands until end if
        var foundEnd = false;
        var newLoop = 0;
        var inElse = 0;
        while (!foundEnd)
        {
            var thisCommand = this._actionList.shift();
            console.log(thisCommand);

            if (thisCommand[0].match(/^\s*IF .*/i))
            {
                newLoop++;
            }

            if (thisCommand[0].match(/^\s*ELSE IF .*/i) || thisCommand[0].match(/^\s*ELSE\s*$/i))
            {
                if (newLoop == 0)
                {
                    inElse = 1;
                }
            }

            if (thisCommand[0].match(/^\s*END\s*$/i))
            {
                if (newLoop == 0)
                {
                    foundEnd = true;
                }
                else
                {
                    newLoop--;
                }
            }
            BattleManager.SergeofBIBEKIfArray[inElse].push(thisCommand);
            if (inElse == 1 && foundEnd)
                {
                    BattleManager.SergeofBIBEKIfArray[0].push(thisCommand);
                }
        }

        //put them all back in if the condition has been met
        if (eval(BattleManager.SergeofBIBEKIfArray[2]))
        {
            for (var i = BattleManager.SergeofBIBEKIfArray[0].length; i > 0; i--)
            {
                this._actionList.unshift(BattleManager.SergeofBIBEKIfArray[0][i - 1]);
            }
        }
        else
        {
            for (var i = BattleManager.SergeofBIBEKIfArray[1].length; i > 0; i--)
            {
                this._actionList.unshift(BattleManager.SergeofBIBEKIfArray[1][i - 1]);
            }
        }
        return true;
    };

}
else if(Utils.isOptionValid('test') && Utils.isNwjs())
{
    var message = "Yanfly's YEP_BattleEngineCore is not installed or installed incorrectly. Make sure it is above SergeofBIBEK's Action Sequence Loops.";
    alert(message);
    throw new Error(message);
}
else
{
    throw new Error("Action Sequence Loops Error: Missing Requirement 'YEP_BEC'");
}
