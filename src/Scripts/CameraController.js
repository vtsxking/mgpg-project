var CameraController = pc.createScript('cameraController');

CameraController.attributes.add('mouseSpeed', { type: 'number', default: 1.4, description: 'Mouse Sensitivity' });

// Called once after all resources are loaded and before the first update
CameraController.prototype.initialize = function () {
    this.eulers = new pc.Vec3();
    this.touchCoords = new pc.Vec2();

    let app = this.app;
    app.mouse.on("mousemove", this.onMouseMove, this);
    app.mouse.on("mousedown", this.onMouseDown, this);

    // this is essentually our anchor for our camera, and will snap to this point if no object is in between...
    this.rayEnd = app.root.findByName('RaycastEndPoint');
    
    this.on('destroy', function() {
        app.mouse.off("mousemove", this.onMouseMove, this);
        app.mouse.off("mousedown", this.onMouseDown, this);
    }, this);
};
    
CameraController.prototype.postUpdate = function (dt) {
    // Center position of our character...
    let originEntity = this.entity.parent;
    
    let targetY = this.eulers.x;
    let targetX = this.eulers.y;

    let targetAng = new pc.Vec3(-targetX, targetY, 0);
    
    originEntity.setEulerAngles(targetAng);
    
    // Find position of camera in world space...
    this.entity.setPosition(this.getWorldPoint());
    
    // use character position to orient camera so that we are looking at our character...
    this.entity.lookAt(originEntity.getPosition());
};

// everytime we mouse our mouse we fire this method and collect mouse data in event `e`...
CameraController.prototype.onMouseMove = function (e) {
    if (pc.Mouse.isPointerLocked()) {
        // on mouse move across x axis multiply by mouse speed mod by 360 to keep degree capped to 0-360...
        this.eulers.x -= ((this.mouseSpeed * e.dx) / 60) % 360;
        // on mouse move across y axis multiply by mouse speed mod by 360 to keep degree capped to 0-360...
        this.eulers.y += ((this.mouseSpeed * e.dy) / 240) % 360;

        // acount for sub zero angles
        // cap y axis to more user friendly angles...
        if (this.eulers.x < 0) this.eulers.x += 360;
        if (this.eulers.y < 300) this.eulers.y = 300;
        if (this.eulers.y > 350) this.eulers.y = 350;
        //console.log(this.eulers);
    }
};

// on click lock mouse in app...
CameraController.prototype.onMouseDown = function (e) {
    this.app.mouse.enablePointerLock();
};

// fire a ray to detect where
CameraController.prototype.getWorldPoint = function () {
    // from our character center...
    let from = this.entity.parent.getPosition();
    // to our camera anchor...
    let to = this.rayEnd.getPosition();

    let hitPoint = to;

    let app = this.app;
    // shoot ray from character center...
    let hit = app.systems.rigidbody.raycastFirst(from, to);
    
    // return camera anchor or object if in between the two points...
    return hit ? hit.point : to;
};
