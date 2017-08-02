/*:
 * @plugindesc Now you can nest your IF commands in action sequences!
 * @author SergeofBIBEK
 * @help
 *
 * Action Sequence Nested IF
 * Version 1.00
 * by SergeofBIBEK
 *
 *
 * This Plugin requires:
 *
 * Yanfly's Battle Engine Core
 *    (http://yanfly.moe/2015/10/10/yep-3-battle-engine-core/)
 *
 * Now you can nest your IF commands in action sequences!
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
 *  How to use IF in action sequences
 * ==========================================================================
 *
 * To start an IF, use the following command:
 *
 *     IF condition
 *
 * The condition is whatever you would put in a normal JS IF statement.
 *
 * Then end the IF with the following command:
 *
 *     END
 *
 * Here is an example:
 *
 *     <Target Action>
 *     if user.mp > 100
 *     animation 5: target
 *     wait for animation
 *     action effect
 *     mp -100: user, show
 *     wait: 10
 *     end
 *     </Target Action>
 *
 * You can also still use else and else if like this:
 *
 * ELSE
 * ELSE IF condition
 * 
 * The condition follows all the same rules as the IF conditions
 *
 *     <Target Action>
 *     if user.mp > 100
 *     animation 5: target
 *     wait for animation
 *     action effect
 *     mp -100: user, show
 *     wait: 10
 *     else
 *     animation 3: user
 *     wait for animation
 *     mp +50: user, show
 *     end
 *     </Target Action>
 *
 * But Wait! There's more!
 * Now you can nest your if statements!
 *
 *     <Target Action>
 *     if user.mp > 100
 *     animation 5: target
 *     wait for animation
 *     action effect
 *     mp -100: user, show
 *     wait: 10
 *     if user.hp > 100
 *     animation 3: user
 *     wait for animation
 *     action effect
 *     hp -100: user, show
 *     end
 *     end
 *     </Target Action>
 *
 * In this example the user will do damage if their mp is OVER 100, 
 * then do damage again if their hp is OVER 100. If their mp is
 * is UNDER 100 then nothing will happen. EVEN if their HP is 101+.
 * 
 * Since that if is inside the other if, it won't happen unless the
 * first IF's conditions are met. Nest IFs, just like JS!
 *
 * ==========================================================================
 *  Changelog
 * ==========================================================================
 *
 */

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

        //array to hold the action sequences, first array is the if true commands and second array is the else commands
        BattleManager.SergeofBIBEKIfArray = [[], [], loopCondition];


        //Store all commands until end if
        var foundEnd = false;
        var newLoop = 0;
        var inElse = 0;
        while (!foundEnd)
        {
            var thisCommand = this._actionList.shift();

            //new if found, let's track how deep it goes.
            if (thisCommand[0].match(/^\s*IF .*/i))
            {
                newLoop++;
            }

            // if this is an else paired with the first if, then start storing commands in the else array.
            if (thisCommand[0].match(/^\s*ELSE IF .*/i) || thisCommand[0].match(/^\s*ELSE\s*$/i))
            {
                if (newLoop == 0)
                {
                    inElse = 1;
                }
            }
            
            //found and "end" check if it is the matching end, if not then step down one level.
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
            //push the command into the correct array. either if true or else.
            BattleManager.SergeofBIBEKIfArray[inElse].push(thisCommand);
            //if there is an else condition AND this is the paired "end" command, go ahead and add end to the first section too.
            //This way we can be sure our end is still in tact.
            if (inElse == 1 && foundEnd)
                {
                    BattleManager.SergeofBIBEKIfArray[0].push(thisCommand);
                }
        }

        //put them back in if the condition has been met
        if (eval(BattleManager.SergeofBIBEKIfArray[2]))
        {
            for (var i = BattleManager.SergeofBIBEKIfArray[0].length; i > 0; i--)
            {
                this._actionList.unshift(BattleManager.SergeofBIBEKIfArray[0][i - 1]);
            }
        }
        else //if the condition has NOT been met, then put the commands in the else back in.
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
