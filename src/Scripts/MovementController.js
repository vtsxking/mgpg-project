var MovementController = pc.createScript('movementController');

MovementController.attributes.add("forward_key", {
    type: 'number',
    default: 87,
    description: "forward key ascii value"
});
MovementController.attributes.add("backward_key", {
    type: 'number',
    default: 83,
    description: "backward key ascii value"
});
MovementController.attributes.add("leftward_key", {
    type: 'number',
    default: 65,
    description: "leftward key ascii value"
});
MovementController.attributes.add("rightward_key", {
    type: 'number',
    default: 68,
    description: "rightward key ascii value"
});
MovementController.attributes.add("crouch_key", {
    type: 'number',
    default: 67,
    description: "crouch key ascii value"
});
MovementController.attributes.add("jump_key", {
    type: 'number',
    default: 32,
    description: "jump key ascii value"
});
MovementController.attributes.add("shift_key", {
    type: 'number',
    default: 16,
    description: "shift key ascii value"
});
MovementController.attributes.add("speed", {
    type: 'number',
    default: 0.3,
    description: "the speed in "
});
MovementController.attributes.add("sprint_speed", {
    type: 'number',
    default: 0.6,
    description: "the speed in "
});

// initialize code called once per entity
MovementController.prototype.initialize = function() {
    // Camera...
    var camera = this.app.root.findByName('Camera');
    this.cameraScript = camera.script.cameraController;   
};

// Temp var to avoid garbage collection...
MovementController.worldDir = new pc.Vec3();
MovementController.tempDir = new pc.Vec3();

// update code called every frame
MovementController.prototype.update = function(dt) {
    let app = this.app;
    let worldDirection = MovementController.worldDir;
    worldDirection.set(0,0,0);

    let tempDirection = MovementController.tempDir;

    let forward = this.entity.forward;
    let right = this.entity.right;

    let x = 0;
    let z = 0;
    
    if (app.keyboard.isPressed(this.forward_key)) z -= 1;
    if (app.keyboard.isPressed(this.backward_key)) z += 1;
    if (app.keyboard.isPressed(this.leftward_key)) x += 1;
    if (app.keyboard.isPressed(this.rightward_key)) x -= 1;

    if (x !== 0 || z !== 0) {
        worldDirection.add(tempDirection.copy(forward).mulScalar(z));
        worldDirection.add(tempDirection.copy(right).mulScalar(x));
        worldDirection.normalize();

        let pos = new pc.Vec3(worldDirection.x * dt, 0, worldDirection.z * dt);
        if (app.keyboard.isPressed(this.shift_key)) {
            pos.normalize().scale(this.sprint_speed);
        } else {
            pos.normalize().scale(this.speed);
        }
        pos.add(this.entity.getPosition());
        
        // Camera...
        var targetY = this.cameraScript.eulers.x;
        var rot = new pc.Vec3(0, targetY, 0);

        // Updated for camera rotation...
        this.entity.rigidbody.teleport(pos, rot);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// MovementController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/