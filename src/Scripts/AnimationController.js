var AnimationController = pc.createScript('animationController');

AnimationController.attributes.add("forward_key", {
    type: 'number',
    default: 87,
    description: "forward key ascii value"
});
AnimationController.attributes.add("backward_key", {
    type: 'number',
    default: 83,
    description: "backward key ascii value"
});
AnimationController.attributes.add("leftward_key", {
    type: 'number',
    default: 65,
    description: "leftward key ascii value"
});
AnimationController.attributes.add("rightward_key", {
    type: 'number',
    default: 68,
    description: "rightward key ascii value"
});
AnimationController.attributes.add("crouch_key", {
    type: 'number',
    default: 67,
    description: "crouch key ascii value"
});
AnimationController.attributes.add("jump_key", {
    type: 'number',
    default: 32,
    description: "jump key ascii value"
});
AnimationController.attributes.add("shift_key", {
    type: 'number',
    default: 16,
    description: "shift key ascii value"
});
AnimationController.attributes.add("toggle_firearm_key", {
    type: 'number',
    default: 88,
    description: "shift key ascii value"
});

// initialize code called once per entity
AnimationController.prototype.initialize = function() {
    this.playerState = "idle";
    this.isArmed = false;
};

// update code called every frame
AnimationController.prototype.update = function(dt) {
    this.playerStateManager(this.app);
};

AnimationController.prototype.playerStateManager = function(app) {
    switch(this.playerState) {
        case "walking":
            if (app.keyboard.isPressed(this.shift_key)) this.playerState = "sprint";
            if (app.keyboard.isPressed(this.jump_key)) this.playerState = "jumping";
            
            if (app.keyboard.isPressed(this.forward_key)) {
                if (this.isArmed)
                    this.changeMovementState(13);
                else
                    this.changeMovementState(1);
            }
            else if (app.keyboard.isPressed(this.backward_key)) {
                this.changeMovementState(2);
            }
            else if (app.keyboard.isPressed(this.leftward_key)) {
                this.changeMovementState(3);
            }
            else if (app.keyboard.isPressed(this.rightward_key)) {
                this.changeMovementState(4);
            }
            else {
                this.playerState = "idle";
            }
        break;

        case "sprint":
            if (app.keyboard.isPressed(this.jump_key)) this.playerState = "jumping";
            if (app.keyboard.isPressed(this.forward_key) && app.keyboard.isPressed(this.shift_key)) {
                if (this.isArmed)
                    this.changeMovementState(14);
                else
                    this.changeMovementState(5);
            }
            else if (app.keyboard.isPressed(this.backward_key) && app.keyboard.isPressed(this.shift_key)) {
                this.changeMovementState(6);
            }
            else if (app.keyboard.isPressed(this.leftward_key) && app.keyboard.isPressed(this.shift_key)) {
                this.changeMovementState(7);
            }
            else if (app.keyboard.isPressed(this.rightward_key) && app.keyboard.isPressed(this.shift_key)) {
                this.changeMovementState(8);
            }
            else if (app.keyboard.isPressed(this.forward_key) || app.keyboard.isPressed(this.backward_key) || app.keyboard.isPressed(this.leftward_key) || app.keyboard.isPressed(this.rightward_key)) {
                this.playerState = "walking";
            }
            else {
                this.playerState = "idle";
            }
        break;

        case "crouching":
            if (app.keyboard.isPressed(this.jump_key)) this.playerState = "jumping";
            if (app.keyboard.isPressed(this.crouch_key)) {
                this.changeMovementState(9);
            }
            else {
                this.playerState = "idle";
            }
        break;

        case "jumping":
            // jumpState may contain more or may fire external scripts and functions to further handle jumping...
            this.jumpState(app, 10);
        break;

        case "idle":
        default:
        // Change the animation state back to idle...
        if (this.isArmed)
            this.changeMovementState(12);
        else
            this.changeMovementState(0);
        if (app.keyboard.isPressed(this.jump_key))
            this.playerState = "jumping";
        if (app.keyboard.isPressed(this.crouch_key))
            this.playerState = "crouching";
        if (app.keyboard.isPressed(this.forward_key) || app.keyboard.isPressed(this.backward_key) || app.keyboard.isPressed(this.leftward_key) || app.keyboard.isPressed(this.rightward_key)) {
            this.playerState = "walking";
        }
        if (!this.isArmed && app.keyboard.isPressed(this.toggle_firearm_key)) {
            this.changeMovementState(11);
            this.isArmed = true;
        }
        break;
    }
};

AnimationController.prototype.jumpState = function (app, jumpState) {
    if (app.keyboard.isPressed(this.jump_key)) {
        this.changeMovementState(jumpState);
    }
    else {
        this.playerState = "idle";
    }
};


AnimationController.prototype.changeMovementState = function(newState) {
    if (this.entity.anim.getInteger("animState") != newState) this.entity.anim.setInteger("animState", newState);
};
// swap method called for script hot-reloading
// inherit your script state here
// Movement.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/