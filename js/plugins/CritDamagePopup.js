ImageManager._critDamageImage = ImageManager.loadSystem('Loading');
ImageManager._normalDamageImage = ImageManager.loadSystem('Damage');

var My_Sprite_Damage_prototype_setup = Sprite_Damage.prototype.setup;

Sprite_Damage.prototype.setup = function(target)
{
    this._result = target.shiftDamagePopup();
    var result = this._result;
    if (result.critical)
        {
            this._damageBitmap = ImageManager._critDamageImage;
        }
    else
        {
            this._damageBitmap = ImageManager._normalDamageImage;
        }
    target._damagePopup.unshift(this._result);
    
    My_Sprite_Damage_prototype_setup.call(this, target);
};