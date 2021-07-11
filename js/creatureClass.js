class creature {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.scale = creatureSets[this.type].scale;

        //Sprite setup
        this.image = new Sprite(resources["spriteSheet"].textures[this.type + "_01.png"]);
        this.image.anchor.set(0.5);

        this.image.x = this.x;
        this.image.y = this.y;
        this.image.scale.set(this.scale, this.scale);
        this.image.zIndex = this.type == "Flawed" ? 1.5 : 1;

        //Stats
        this.healthTotal = creatureSets[this.type].health;
        this.health = this.healthTotal;
        this.attack = creatureSets[this.type].attack;
        this.speed = creatureSets[this.type].speed;

        //Animation
        this.frame = 1;
        this.frameReturn = false;

        //Abilities
        this.movement = creatureSets[this.type].movement;
        this.yMovement = false;

        if (this.movement !== "Player" && this.movement !== "Minion") {
            this.image.interactive = true;
            this.image.buttonMode = true;
            enemyCount += 1;
        }

        this.casting = false;
        this.skillSet = creatureSets[this.type].moves;
        this.skillCooldown = {};
        this.modifiers = {};

        //Assigns copied skills and sets cooldowns to 0
        for (let setIndex in this.skillSet) {
            this.skillCooldown[this.skillSet[setIndex]] = {};

            Object.assign(this.skillCooldown[this.skillSet[setIndex]], skills[this.skillSet[setIndex]]);

            //Players get skills refreshed from the start
            if (this.type == "Flawless") {
                this.skillCooldown[this.skillSet[setIndex]].cooldown = 0
            }
        }

        stage.addChild(this.image);

        //Shadow test
        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0x4d4d4d);
        this.shadow.drawEllipse(20, 20, 50, 50);
        this.shadow.endFill();
        this.shadow.zIndex = 0;

        stage.addChild(this.shadow);

        //Healthbar test
        this.baseBar = new PIXI.Graphics();

        this.baseBar.beginFill(0xff0000);
        this.baseBar.drawRect(0, 0, 20, 20);
        this.baseBar.endFill();
        this.baseBar.zIndex = 2;

        stage.addChild(this.baseBar);

        //Boss battle
        if (this.type == "Flawed") {
            GUI[2].texture = resources["spriteSheet"].textures["Bubble_Flawed.png"];
            GUI[2].position.set(560, 60);
            GUI[2].scale.set(0.5, 0.5);
            GUI[2].anchor.set(0.5);
            GUI[2].zIndex = 5;

            stage.addChild(GUI[2]);
            stage.addChild(GUI[3]);

            if (creatures[0].health > 0) {
                music.pause();
                music = sound.Sound.from({
                    url: "muzak/BossTheme.mp3",
                    volume: musicVolume,
                    loop: true
                });
                music.play();
            }


        }

        this.GUI();
    }

    //Skill/Attack handlers
    cast(skillCast) {
        switch (this.casting) {
            case "Conceit":
                projectiles.push(new projectile("Conceit", this.x, this.y, crosshair.x, crosshair.y, this.attack));
                break;

            case "Ingrain_Conceit":
                projectiles.push(new projectile("Ingrain_Conceit", this.x, this.y, crosshair.x, crosshair.y, this.attack));
                break;

            case "Viral_Arrogance":
                projectiles.push(new projectile("Viral_Arrogance", this.x, this.y, crosshair.x, crosshair.y, this.attack));
                break;

            case "Undermine":
                projectiles.push(new projectile("Undermine", this.x, this.y, this.x, this.y, this.attack));
                break;

            case "Ingrain_Undermine":
                projectiles.push(new projectile("Ingrain_Undermine", this.x, this.y, this.x, this.y, this.attack));
                break;

            case "Vital_Projection":
                projectiles.push(new projectile("Vital_Projection", this.x, this.y, this.x, this.y, this.attack));
                this.modifiers.healing = skills["Regenerate"].value;
                break;

            case "Exploit":
                creatures.push(new creature("Exploiter", this.x + 25, this.y));
                sound.play("Exploit");
                break;

            case "Ingrain_Exploit":
                creatures.push(new creature("Ingrain_Exploiter", this.x + 25, this.y));
                sound.play("Ingrain_Exploit");
                break;

            case "Freeze_Manipulation":
                creatures.push(new creature("Freeze_Manipulator", this.x + 25, this.y));
                sound.play("Freeze_Manipulation");
                break;

            case "Gambit":
                projectiles.push(new projectile("Gambit", this.x, this.y, this.x + 300, this.y - skills.Gambit.offset[1], this.attack));
                break;

            case "Ingrain_Gambit":
                projectiles.push(new projectile("Ingrain_Gambit", this.x, this.y, this.x + 300, this.y - skills.Ingrain_Gambit.offset[1], this.attack));
                break;

            case "Last_Resort":
                projectiles.push(new projectile("Last_Resort", this.x, this.y, this.x + 300, this.y - skills.Last_Resort.offset[1], this.attack));
                break;

            case "Enrage":
                //Inflicts haste on all nearby enemies
                for (let inflictCreature in creatures) {
                    if (creatures[inflictCreature].movement !== "Player" && creatures[inflictCreature].movement !== "Minion" && creatures[inflictCreature].movement !== "Boss" & creatures[inflictCreature].health > 0 && !creatures[inflictCreature].modifiers.haste > 0 && collision(this.image, creatures[inflictCreature].image, skills.Enrage.range)) {
                        creatures[inflictCreature].modifiers.haste = skills["Haste"].duration;
                    }
                }

                sound.play("Enrage");

                break;

            case "Snowball":
                projectiles.push(new projectile("Snowball", this.x, this.y, creatures[0].x, creatures[0].y, this.attack));

                if (this.attack < 90) {
                    this.attack += 30;
                }

                break;

            case "Bargain":
                projectiles.push(new projectile("Bargain", this.x, this.y, creatures[0].x, creatures[0].y, this.attack));

                break;

            case "Resonate":
                this.modifiers.resonate = skills.Resonate.value;
                this.skillCooldown["Resonate"].cooldown = skills.Resonate.cooldown;
                projectiles.push(new projectile("Fortify", this.x, this.y, this.x, this.y, this.attack));

                if (texts[0].text == "") {
                    texts[0].text = "TRUTH CONCEALED";
                } else if (texts[0].text == "TRUTH CONCEALED") {
                    texts[0].text = "THROUGH IDEALS";
                } else if (texts[0].text == "THROUGH IDEALS") {
                    texts[0].text = "PERFECT PERSONA";
                } else if (texts[0].text == "PERFECT PERSONA") {
                    texts[0].text = "ACCEPT ACCEPTANCE";
                } else {
                    texts[0].text = "FLAWLESS";
                }

                break;

            case "Circulate":
                if (creatures[0].type == "Flawless" && creatures[0].health > 0) {
                    creatures[0].health = Math.min(creatures[0].healthTotal, creatures[0].health + this.attack);
                    this.health = Math.max(0, this.health - this.attack);
                }

                sound.play("Freeze_Manipulation");

                break;

            case "Steadfast":
                this.modifiers.healing = skills["Regenerate"].value;

                sound.play("Vital_Projection");

                break;

            case "Acceptance":
                creatures[0].health = Math.max(0, creatures[0].health - (skills["Acceptance"].power * this.attack));

                if (creatures[0].health <= 0) {
                    texts[0].text = "FLAWED";
                }

                sound.play("Last_Resort");

                break;

        }
    }

    trigger(skillType, skillUse = false, self = true) {
        //Sets up skill triggers
        if (!self && creatures[0].health > 0 && creatures[0].type == "Flawless" && !creatures[0].casting && creatures[0].skillCooldown[skillType].cooldown <= 0 && state == "Play") {
            crosshair.x = skillUse.x;
            crosshair.y = skillUse.y;
            creatures[0].frame = 1;
            creatures[0].frameReturn = false;
            creatures[0].casting = skillType;
            creatures[0].skillCooldown[skillType].cooldown = skills[skillType].cooldown;
        } else if (self && creatures[0].health > 0 && creatures[0].type == "Flawless" && this.health > 0) {
            this.frame = 1;
            this.frameReturn = false;
            this.casting = skillType;
            this.skillCooldown[skillType].cooldown = skills[skillType].cooldown;
        }
    }

    GUI() {
        if (this.health <= 0) {
            stage.removeChild(this.shadow);
            stage.removeChild(this.baseBar);
        } else {
            this.shadow.width = this.image.width * this.image.scale.x * 4;
            this.shadow.height = this.image.height * this.image.scale.y;
            this.shadow.x = this.x - this.shadow.width / 5;
            this.shadow.y = this.y + this.shadow.height * 1.25;
            this.shadow.alpha = 0.75;

            this.baseBar.x = this.x - (this.image.width / 2 * (this.health / this.healthTotal));
            this.baseBar.y = this.image.y - this.image.height;
            this.baseBar.width = this.image.width * (this.health / this.healthTotal);
            this.baseBar.height = this.image.height / 8;
            this.baseBar.radius = 1;

            this.health == this.healthTotal ? this.baseBar.alpha = 0 : this.baseBar.alpha = 1;
        }

        //Flawless health bar
        if (this.type == "Flawless" || (this.type == "Flawed" && this.x > 0)) {
            GUI[this.type == "Flawless" ? 1 : 3].clear();
            GUI[this.type == "Flawless" ? 1 : 3].beginFill(this.modifiers.healing > 0 && this.health < this.healthTotal ? 0xdbace9 : 0xff0000);
            GUI[this.type == "Flawless" ? 1 : 3].arc(this.type == "Flawless" ? 80 : 560, 60, 45, -Math.PI * 0.5, Math.PI / 180 * 360 * (this.health / this.healthTotal) - Math.PI * 0.5, false);
            GUI[this.type == "Flawless" ? 1 : 3].lineTo(this.type == "Flawless" ? 80 : 560, 60);
            GUI[this.type == "Flawless" ? 1 : 3].endFill();
            GUI[this.type == "Flawless" ? 1 : 3].zIndex = 4;
            GUI[this.type == "Flawless" ? 0 : 2].alpha = this.health <= 0 ? 0.5 : 1;
        }
    }

    animate(attack) {
        //Animation handlers
        if (attack) {
            if (this.type == "Flawless") {
                crosshair.alpha = 0.5;
            }

            this.frame += this.frameReturn ? -3 / 12 : 3 / 12;

            if (this.frame >= 4 && !this.frameReturn) {
                this.frame = 3;
                this.frameReturn = true;
                this.cast();
            } else if (this.frame < 1 && this.frameReturn) {
                this.frame = 1;
                this.frameReturn = false;
                this.casting = false;
                crosshair.alpha = 1;
            }

        } else {
            this.frame += this.frameReturn ? -(this.speed) / 12 : (this.speed) / 12;

            if (this.frame >= 4) {
                this.frame = 3;
                this.frameReturn = true;
            } else if (this.frame <= 1) {
                this.frame = 1;
                this.frameReturn = false;
            }
        }
    }

    skillHandle() {
        for (let setIndex in this.skillSet) {
            //Haste doubles cooldown rate for non Enrage skills
            this.skillCooldown[this.skillSet[setIndex]].cooldown = Math.max(0, this.skillCooldown[this.skillSet[setIndex]].cooldown - (this.modifiers.haste && this.modifiers.haste && this.type !== "Pique" > 0 ? 1 / 60 * skills["Haste"].value : 1 / 60));

        }

        //Resets skillbubbles
        if (this.type == "Flawless") {
            bubbleSetup(this);
        }

        //Modifiers
        if (!this.modifiers.haste <= 0) {
            if (this.modifiers.haste == skills["Haste"].duration) {
                this.speed *= skills["Haste"].value;

                //Highlights shadow for effect
                this.shadow.clear();
                this.shadow.beginFill(0xf5426c);
                this.shadow.drawEllipse(20, 20, 50, 50);
                this.shadow.endFill();
            }

            this.modifiers.haste -= 1;

            if (this.modifiers.haste <= 0) {
                this.speed /= skills["Haste"].value;
                this.modifiers.haste = undefined;

                //Highlights shadow for effect
                this.shadow.clear();
                this.shadow.beginFill(0x4d4d4d);
                this.shadow.drawEllipse(20, 20, 50, 50);
                this.shadow.endFill();
            }
        }

        if (!this.modifiers.knockback <= 0) {
            this.x += 5;
            this.modifiers.knockback -= 5;
        }

        if (!this.modifiers.healing <= 0 && this.health > 0) {
            this.health = Math.min(this.healthTotal, this.health + 2);
            this.modifiers.healing -= 2;

            //Stops healing if at full health
            if (this.health == this.healthTotal) {
                this.modifiers.healing = 0;
            }

            //Color change signals regeneration
            if (this.modifiers.healing <= 0) {
                this.baseBar.clear();
                this.baseBar.beginFill(0xff0000);
                this.baseBar.drawRect(0, 0, 20, 20);
                this.baseBar.endFill();
            } else {
                this.baseBar.clear();
                this.baseBar.beginFill(0xdbace9);
                this.baseBar.drawRect(0, 0, 20, 20);
                this.baseBar.endFill();
            }

        }

        if (!this.modifiers.freeze <= 0) {
            this.modifiers.freeze -= 1;

            //Color change signals freeze
            if (this.modifiers.freeze <= 0) {
                this.image.tint = "0xFFFFFF";
                this.modifiers.freeze = undefined;
            } else {
                this.image.tint = "0x8fffff";
            }

        }

        if (!this.modifiers.resonate <= 0) {
            this.modifiers.resonate -= 1;
            this.skillCooldown["Resonate"].cooldown = skills.Resonate.cooldown;

            if (this.modifiers.resonate % 90 == 0) {
                creatures.push(new creature("Break", 700, Math.random() * 330));
            }

            if (this.modifiers.resonate % 180 == 0) {
                creatures.push(new creature("Pique", 700, Math.random() * 330));
                creatures.push(new creature("Naysay", 760, Math.random() * 330));
                creatures.push(new creature("Pique", 820, Math.random() * 330));
            }

            if (this.modifiers.resonate % 360 == 0) {
                creatures.push(new creature("Haggle", 700, Math.random() * 330));
            }

        }
    }

    draw() {
        //Movement handlers
        if (!this.modifiers.freeze > 0 && !this.modifiers.knockback > 0) {

            this.animate(this.casting);

            switch (this.movement) {
                case "Player":
                    this.x = Math.min(this.x + (this.speed) * (this.scale > 0 ? 1 : -1), 75);
                    break;

                case "Passive":
                    this.x += (this.speed) * (this.scale > 0 ? 1 : -1);
                    this.y += this.yMovement ? this.speed / 6 : -this.speed / 6;

                    if ((this.x > 590 && this.scale > 0) || (this.x < 150 && this.scale < 0)) {
                        this.scale *= -1;
                        this.x += this.scale * this.speed * 2;
                    }

                    if (this.y < 50) {
                        this.yMovement = true;
                    } else if (this.y > 310) {
                        this.yMovement = false;
                    } else if (Math.floor(Math.random() * 50) == 0) {
                        this.yMovement = !this.yMovement;
                    }
                    break;

                case "Hostile":
                    //Locks enemies to left when hostile
                    if (this.scale > 0) {
                        this.scale *= -1;
                    }

                    //Moves at all times
                    if (!this.casting) {
                        this.x -= this.speed;
                    }

                    if (creatures[0].type == "Flawless" && Math.abs(creatures[0].y - this.y) > this.speed) {
                        this.y += this.y > creatures[0].y ? -this.speed : this.speed;
                    } else if (collision(this.image, creatures[0].image)) {
                        this.health = 0;
                        creatures[0].health = Math.max(0, creatures[0].health - this.attack);
                    }

                    if (!this.casting && this.skillCooldown.Enrage && this.skillCooldown.Enrage.cooldown <= 0) {
                        this.trigger("Enrage");
                    }

                    break;

                case "Ranged":
                    //Locks enemies to left when range
                    if (this.scale > 0) {
                        this.scale *= -1;
                    }

                    //Moves if not at a certain distance
                    if (this.x > 565) {
                        this.x -= this.speed;
                    }

                    if (!this.casting && this.skillCooldown[this.skillSet[0]].cooldown <= 0) {
                        this.trigger(this.skillSet[0]);
                    }

                    break;

                case "Boss":
                    //Locks enemies to left when hostile
                    if (this.scale > 0) {
                        this.scale *= -1;
                    }

                    this.y = creatures[0].y;

                    //Applies skills as conditions are met
                    if (!this.casting && creatures[0].type == "Flawless" && creatures[0].health > 0 && collision(this.image, creatures[0].image)) {
                        this.trigger(this.skillSet[3]);
                    } else if (!this.casting && this.skillCooldown[this.skillSet[2]].cooldown <= 0 && this.health < this.healthTotal && !this.modifiers.healing > 0 && this.modifiers.resonate > 0) {
                        this.trigger(this.skillSet[2]);
                    } else if (!this.casting && this.skillCooldown[this.skillSet[1]].cooldown <= 0 && creatures[0].type == "Flawless" && creatures[0].health < creatures[0].healthTotal && this.modifiers.resonate > 0) {
                        this.trigger(this.skillSet[1]);
                    } else if (!this.casting && this.skillCooldown[this.skillSet[0]].cooldown <= 0 && creatures[0].type == "Flawless" && !this.modifiers.resonate > 0) {
                        this.trigger(this.skillSet[0]);
                    } else if (!this.casting && !this.modifiers.resonate > 0) {
                        this.x -= this.speed;
                    }

                    //Flawed dies if Flawless is dead
                    if (creatures[0].type !== "Flawless" && texts[0].text !== "FLAWED") {
                        this.health = 0;
                    }
                    break;

                case "Minion":
                    //Locks enemies to left when minion
                    if (this.scale > 0) {
                        this.scale *= 1;
                    }

                    //Finds all non player enemies and hits them
                    for (let hitCreature in creatures) {
                        if (creatures[hitCreature].movement !== "Player" && creatures[hitCreature].movement !== "Minion" && creatures[hitCreature].movement !== "Boss" && creatures[hitCreature].health > 0 && this.health > 0 && collision(this.image, creatures[hitCreature].image)) {
                            this.health = 0;
                            creatures[hitCreature].health = Math.max(0, creatures[hitCreature].health - creatures[hitCreature].attack * this.attack);

                            //Freeze Manipulators inflict freeze
                            if (this.type == "Freeze_Manipulator") {
                                creatures[hitCreature].modifiers.freeze = skills.Freeze.duration;
                                sound.play("Freeze");
                            }

                        }
                    }

                    if (this.x < 700) {
                        this.x += this.speed;
                    } else {
                        this.health = 0;
                    }

                    break;
            }

        }

        //Enemies die if Flawed defeats Flawless or they hit a boundary
        if (((this.movement == "Passive" || this.movement == "Hostile" || this.movement == "Ranged") && texts[0].text == "FLAWED") || this.x < -50) {
            this.health = 0;
        }

        this.image.x = this.x;
        this.image.y = this.movement == "Boss" && this.modifiers.resonate > 0 ? this.y - this.frame * 3 - this.modifiers.resonate / 3 : this.type == "Gloom" ? this.y - 3 : this.y - this.frame * 3;
        this.image.scale.set(this.scale, Math.abs(this.scale));

        //Body swap animation
        if (this.casting) {
            this.image.texture = resources["spriteSheet"].textures[this.type + "_" + skills[this.casting].animation + "_0" + Math.floor(this.frame) + ".png"];
        } else {
            this.image.texture = resources["spriteSheet"].textures[this.type + "_0" + Math.floor(this.frame) + ".png"];
        }

        this.image.on("pointerdown", skillTrigger => creatures[0].trigger(creatures[0].skillSet[0], this, false));

        this.GUI();
        this.skillHandle();

        if (collision(this.image, crosshair) && this.movement !== "Minion") {
            crosshair.focus = true;
            texts[1].text = this.type;
            texts[1].style.fill = creatureSets[this.type].color;
            texts[2].text = creatureSets[this.type].description;
        }

        if (this.health == 0 && this.image.alpha > 0) {
            this.speed = 0;
            this.animation = 0;
            this.image.rotation += 1 / 10 * this.scale;
            this.image.alpha -= 1 / 15;
            this.scale *= 0.95;

        } else if (this.image.alpha <= 0) {
            //Mind Siege
            if (this.type == "Flawed" && this.x > 0) {
                texts[0].text = "A FRAGILE MIND";
                for (let i = 0; i < 10; i++) {
                    creatures.push(new creature("Break", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Naysay", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Pique", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Haggle", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Pique", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Naysay", 700 + i * 60, Math.random() * 330));
                    creatures.push(new creature("Break", 700 + i * 60, Math.random() * 330));
                }
            }

            if (this.movement !== "Player" && this.movement !== "Minion") {
                enemyCount -= 1;
            }

            this.image.removeAllListeners();
            creatures.splice(creatures.indexOf(this), 1);
            stage.removeChild(this.image);
        }
    }
}