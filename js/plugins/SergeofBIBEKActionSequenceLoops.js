/*:
 * @plugindesc Allows you to use loops in action sequences.
 * @author SergeofBIBEK
 * @help
 *
 * Action Sequence Loops
 * Version 1.11
 * by SergeofBIBEK
 *
 *
 * This Plugin requires:
 *
 * Yanfly's Battle Engine Core
 *    (http://yanfly.moe/2015/10/10/yep-3-battle-engine-core/)
 *
 * Now you can use for and while loops in action sequences
 *
 *
 * ==========================================================================
 *  How to Set Up
 * ==========================================================================
 *
 * Place this plugin below YEP_BattleEngineCore.
 *
 *
 * ==========================================================================
 *  How to loop within Action Sequences
 * ==========================================================================
 *
 * To start a loop, use the following command:
 *
 *     WHILE condition
 *
 * The condition is whatever you would put inside a normal JS while loop.
 *
 * Then end the loop with the following command:
 *
 *     END WHILE
 *
 * Here is an example:
 *
 *     <Target Action>
 *     while user.mp > 100
 *     animation 5: target
 *     wait for animation
 *     action effect
 *     mp -100: user, show
 *     wait: 10
 *     end while
 *     </Target Action>
 *
 * Pretty straight forward!
 *
 * ==========================================================================
 *  Changelog
 * ==========================================================================
 * Version 1.11 - Small bug fixes and compatibility improvements.
 * 
 * Version 1.10 - Can now nest while loops.
 * 
 *
 */

var Imported = Imported || {};
Imported["SergeofBIBEK Action Sequence Loops"] = 1.11;

if(Imported.YEP_BattleEngineCore)
{

    //Alias of Yanfly's BattleManager.processActionSequence function.
    var SergeofBIBEK_ASLoops_BattleManager_processActionSequence = BattleManager.processActionSequence;
    BattleManager.processActionSequence = function(actionName, actionArgs)
    {
        // Action Sequence While Start
        if (actionName.match(/^\s*WHILE .*/i))
        {
            //Calls my Original Function passing in the variables.
            return this.SergeofBIBEKWhileLoopStart();
        }
        // Action Sequence While End
        if (actionName.match(/^\s*END WHILE/i))
        {
            //Calls my Original Function passing in the variables.
            return this.SergeofBIBEKWhileLoopEnd();
        }

        //Call the original
        return SergeofBIBEK_ASLoops_BattleManager_processActionSequence.call(this, actionName, actionArgs);
    };

    /**
        * Original function saves the body and condition of the while loop.
        * @function BattleManager.SergeofBIBEKWhileLoopStart
        * @param {String} loopCondition - user's condition for the while loop.
        * @return {bool} true or false that Yanfly's processActionSequence is waiting for.
        * @this BattleManager
        * @author SergeofBIBEK <SergeofBIBEK@gmail.com>
        * @todo Handle error cases.
        * @todo Optimize
        */
    BattleManager.SergeofBIBEKWhileLoopStart = function()
    {
        if (!BattleManager.SergeofBIBEKWhileArray)
        {
            BattleManager.SergeofBIBEKWhileArray = [];
        }


        //Some useful vars for the while condition
        var subject = this._subject;
        var user = this._subject;
        var target = this._targets[0];
        var targets = this._targets;
        var action = this._action;
        var item = this._action.item();

        var loopCondition = this._actSeq[0].match(/WHILE (.*)/i)[1];

        //array to hold the action sequences 
        BattleManager.SergeofBIBEKWhileArray.unshift([[],loopCondition]);


        //Store all commands until end while
        var foundEnd = false;
        var newLoop = 0;
        while (!foundEnd)
        {
            var thisCommand = this._actionList.shift();
            BattleManager.SergeofBIBEKWhileArray[0][0].push(thisCommand);

            if (thisCommand[0].match(/WHILE (.*)/i))
            {
                newLoop++;
            }

            if (thisCommand[0].match(/END WHILE/i))
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
        }

        //put them all back in if the condition has been met
        if (eval(BattleManager.SergeofBIBEKWhileArray[0][1]))
        {
            for (var i = BattleManager.SergeofBIBEKWhileArray[0][0].length; i > 0; i--)
            {
                this._actionList.unshift(BattleManager.SergeofBIBEKWhileArray[0][0][i - 1]);
            }
        }
        else
        {
            BattleManager.SergeofBIBEKWhileArray.shift();
        }
        return true;
    };

    /**
        * Original function checks the loop condition and loops if needed.
        * @function BattleManager.SergeofBIBEKWhileLoopEnd
        * @return {bool} true or false that Yanfly's processActionSequence is waiting for.
        * @this BattleManager
        * @author SergeofBIBEK <SergeofBIBEK@gmail.com>
        * @todo Handle error cases.
        * @todo Optimize
        */
    BattleManager.SergeofBIBEKWhileLoopEnd = function()
    {
        //Some useful vars for the while condition
        var subject = this._subject;
        var user = this._subject;
        var target = this._targets[0];
        var targets = this._targets;
        var action = this._action;
        var item = this._action.item();

        //put them all back in if the condition has been met
        if (eval(BattleManager.SergeofBIBEKWhileArray[0][1]))
        {
            for (var i = BattleManager.SergeofBIBEKWhileArray[0][0].length; i > 0; i--)
            {
                this._actionList.unshift(BattleManager.SergeofBIBEKWhileArray[0][0][i - 1]);
            }
        }
        else
        {
            BattleManager.SergeofBIBEKWhileArray.shift();
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
