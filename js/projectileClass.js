class projectile {

    constructor(type, x, y, targetX, targetY, attack) {
        this.type = type;
        this.x = x - skills[this.type].offset[0];
        this.y = y - skills[this.type].offset[1];
        this.scale = skills[this.type].scale;

        //Sprite setup
        this.image = new Sprite(resources["spriteSheet"].textures[this.type + ".png"]);
        this.image.anchor.set(0.5);

        this.image.x = this.x;
        this.image.y = this.y;
        this.image.zIndex = 3;
        this.image.scale.set(this.scale, this.scale);

        //Stats
        this.power = attack * skills[this.type].power;
        this.speed = skills[this.type].speed;
        this.target = [targetX, targetY];
        this.state = skills[this.type].state;
        this.friendlyFire = skills[this.type].friendlyFire;

        //Projectile path
        this.path = new PIXI.Point();
        this.path.x = this.target[0] - this.x;
        this.path.y = this.target[1] - this.y;
        this.distance = Math.sqrt((this.path.x * this.path.x) + (this.path.y * this.path.y));
        this.path.x /= this.distance;
        this.path.y /= this.distance;

        stage.addChild(this.image);

        //Trail effects don't play sounds
        if (attack !== 0) {
            sound.play(this.type);
        }
    }

    scout() {
        for (let hitCreature in creatures) {
            if (this.friendlyFire.indexOf(creatures[hitCreature].movement) == -1 && collision(this.image, creatures[hitCreature].image) && creatures[hitCreature].health > 0) {
                if (this.state == "Fort") {
                    this.scale = Math.max(0, this.scale - 0.05);
                } else if (this.state !== "Burst") {
                    this.state = "Particle";
                }

                //Bargain deals no damage if it hits Flawless
                if (this.type == "Bargain" && this.scale == 0.5 && creatures[hitCreature].type == "Flawless") {
                    if (!creatures[hitCreature].modifiers.haste || creatures[hitCreature].modifiers.haste <= 0) creatures[hitCreature].modifiers.haste = skills.Haste.duration;
                    projectiles.push(new projectile("Bargain", this.x + 10 + skills[this.type].offset[0], this.y + skills[this.type].offset[1], 200 + Math.random() * 300, Math.random() * 330, this.power));
                } else {
                    creatures[hitCreature].health = Math.max(creatures[hitCreature].health - this.power, 0);
                }

                if (this.state == "Burst" && !creatures[hitCreature].modifiers.knockback > 0) {
                    creatures[hitCreature].modifiers.knockback = skills[this.type].value;
                } else if (this.state !== "Burst") {
                    return;
                }
            }
        }
    }

    draw() {
        switch (this.state) {
            //Snares act like landmines
            case "Snare":
                if (this.scale < 0.5) {
                    this.speed += 0.12;
                    this.scale += 0.01;
                }

                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else if (this.speed > 0) {
                    this.speed -= 0.1;
                } else {
                    this.state = "Particle";
                }

                this.scout();
                break;

                //Splits split on end
            case "Split":
                if (this.scale < 0.5) {
                    this.speed += 0.12;
                    this.scale += 0.01;
                }

                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else {
                    this.state = "Particle";
                }

                this.scout();
                break;

            case "Burst":
                if (this.scale < 0.5) {
                    this.scale += 0.01;
                } else {
                    this.state = "Particle";
                }

                this.x += this.speed;

                this.scout();
                break;

                //Gambits health till too weak to continue
            case "Gambit":
                if (this.scale < 0.5) {
                    this.speed += 0.12;
                    this.scale += 0.005;
                }

                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else if (creatures[0].type !== "Flawless" || creatures[0].health <= 60) {
                    this.state = "Particle";
                }

                if (creatures.length > 1 && creatures[0].type == "Flawless" && !((creatures.length == 2 && this.friendlyFire.indexOf(creatures[1].movement) !== -1) ||
                        (creatures.length == 3 && this.friendlyFire.indexOf(creatures[1].movement) !== -1 && this.friendlyFire.indexOf(creatures[2].movement) !== -1)) && creatures[0].health > 60) {
                    creatures[0].health -= 2;
                    let target = creatures[0];

                    while (this.friendlyFire.indexOf(target.movement) !== -1) {
                        target = creatures[Math.floor(Math.random() * creatures.length)]
                    }

                    projectiles.push(new projectile("Barrage_" + this.type, this.x, this.y, target.x, target.y, this.power / skills[this.type].power));
                }
                break;

                //Barrages have the ability to home
            case "Barrage":

                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else {
                    //Resets target for homing
                    if (this.type == "Barrage_Last_Resort" && creatures.length > 1 && creatures[0].type == "Flawless" && !((creatures.length == 2 && this.friendlyFire.indexOf(creatures[1].movement) !== -1) ||
                            (creatures.length == 3 && this.friendlyFire.indexOf(creatures[1].movement) !== -1 && this.friendlyFire.indexOf(creatures[2].movement) !== -1))) {
                        let target = creatures[0];

                        while (this.friendlyFire.indexOf(target.movement) !== -1) {
                            target = creatures[Math.floor(Math.random() * creatures.length)]
                        }

                        this.target = [target.x, target.y];
                        this.path = new PIXI.Point();
                        this.path.x = this.target[0] - this.x;
                        this.path.y = this.target[1] - this.y;
                        this.distance = Math.sqrt((this.path.x * this.path.x) + (this.path.y * this.path.y));
                        this.path.x /= this.distance;
                        this.path.y /= this.distance;

                    } else {
                        this.state = "Particle";
                    }
                }

                this.scout();
                break;

            case "Snowball":
                this.scale = 0.15 * this.power / 30;

                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else {
                    this.state = "Particle";
                }

                this.scout();
                break;

            case "Bargain":
                if (this.distance > 0) {
                    this.x += this.path.x * this.speed;
                    this.y += this.path.y * this.speed;
                    this.distance -= 1 * this.speed;
                } else {
                    this.state = "Particle";
                    creatures.push(new creature("Gloom", this.x, this.y));
                }

                //Trail effect copies sprite
                if (this.scale == 0.5) {
                    let trail = 5 - Math.random() * 10;
                    projectiles.push(new projectile("Bargain", this.x + trail + skills[this.type].offset[0], this.y + trail + skills[this.type].offset[1], this.x + trail + skills[this.type].offset[0], this.y + trail + skills[this.type].offset[1], 0));
                    projectiles[projectiles.length - 1].state = "Particle";
                    projectiles[projectiles.length - 1].scale = 0.15;
                }

                this.scout();
                break;

            case "Fort":
                if (this.scale < 0.25) {
                    this.scale += 0.01;
                } else {
                    this.state = "Particle";
                }

                this.scout();
                break;

            case "Particle":
                if (this.image.alpha < 0) {
                    projectiles.splice(projectiles.indexOf(this), 1);
                    stage.removeChild(this.image);

                    if (this.type == "Viral_Arrogance") {
                        projectiles.push(new projectile("Conceit", this.x, this.y, this.x, this.y - 50, this.power / skills[this.type].power));
                        projectiles.push(new projectile("Conceit", this.x, this.y, this.x, this.y + 50, this.power / skills[this.type].power));
                    }

                    return;
                } else {
                    this.image.tint -= 100;
                    this.scale += 0.01;
                    this.image.alpha -= 0.05;
                }


                break;

        }

        this.image.rotation += this.speed;
        this.image.x = this.x;
        this.image.y = this.y;
        this.image.scale.set(this.scale, this.scale);
    }
}