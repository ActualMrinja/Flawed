//Aliases
var App = PIXI.Application,
    Sprite = PIXI.Sprite,
    resources = PIXI.Loader.shared.resources,
    sound = PIXI.sound,
    loader = PIXI.Loader.shared,
    Container = PIXI.Container,
    ticker = PIXI.Ticker.shared,
    Texture = PIXI.Texture;

let app = new App({
    width: 640,
    height: 360,
    resolution: devicePixelRatio,
});
app.view.id = "game";

var stage = new Container();
stage.interactive = true;
stage.sortableChildren = true;
var stageTextures = [Texture.from("stages/title.png"), Texture.from("stages/home.png"), Texture.from("stages/shore.png"), Texture.from("stages/forest.png"), Texture.from("stages/park.png"), Texture.from("stages/mindWalls.png")];

loader.add({
    name: "spriteSheet",
    url: "spritesheet.json",
    crossOrigin: ""
}).load(setup);

var pointer = app.renderer.plugins.interaction.mouse.global;
var background = new Sprite(stageTextures[1]);
background.interactive = true;

var mp3Loader = 0;
var musicVolume = 0.7;
var muzakList = [sound.add("Main", "muzak/MainTheme.mp3"), sound.add("Shore", "muzak/ShoreTheme.mp3"), sound.add("Forest", "muzak/ForestTheme.mp3"), sound.add("Park", "muzak/ParkTheme.mp3"), sound.add("Boss", "muzak/BossTheme.mp3"), sound.add("Mind","muzak/MindTheme.mp3"), sound.add("Win", "muzak/Win.mp3"), sound.add("Fail", "muzak/Fail.mp3")]; 
music = sound.Sound.from("Main");
music.volume = musicVolume;

var soundVolume = 1;
var soundEffects = [sound.add("Conceit", "sounds/Conceit.mp3"), sound.add("Ingrain_Conceit", "sounds/Ingrain_Conceit.mp3"), sound.add("Viral_Arrogance", "sounds/Viral_Arrogance.mp3"), sound.add("Undermine", "sounds/Undermine.mp3"), sound.add("Ingrain_Undermine", "sounds/Ingrain_Undermine.mp3"), sound.add("Vital_Projection", "sounds/Vital_Projection.mp3"), sound.add("Exploit", "sounds/Exploit.mp3"), sound.add("Ingrain_Exploit", "sounds/Ingrain_Exploit.mp3"), sound.add("Freeze_Manipulation", "sounds/Freeze_Manipulation.mp3"), sound.add("Gambit", "sounds/Gambit.mp3"), sound.add("Ingrain_Gambit", "sounds/Ingrain_Gambit.mp3"), sound.add("Last_Resort", "sounds/Last_Resort.mp3"), sound.add("Barrage_Gambit", "sounds/Barrage_Gambit.mp3"), sound.add("Barrage_Ingrain_Gambit", "sounds/Barrage_Ingrain_Gambit.mp3"), sound.add("Barrage_Last_Resort", "sounds/Barrage_Last_Resort.mp3"), sound.add("Snowball", "sounds/Snowball.mp3"), sound.add("Bargain", "sounds/Bargain.mp3"), sound.add("Fortify", "sounds/Fortify.mp3"), sound.add("Enrage", "sounds/Enrage.mp3"), sound.add("Freeze", "sounds/Freeze.mp3")];
sound.volume = soundVolume;

for (muzak in muzakList) {
    sound.Sound.from({
        url: muzakList[muzak].url,
        preload: true,
        loaded: function(err, sound) { mp3Loader += 1 } 
    
    });
}

for (sounds in soundEffects) { 
    sound.Sound.from({
        url: soundEffects[sounds].url,
        preload: true,
        loaded: function(err, sound) { mp3Loader += 1 } 
    
    });
}

var skillBubbles = [new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite()];
var skillTree = [0, 0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
var levelCompletion = [false, false, false, false, false, false, false, false, false, 0];

var GUI = [new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new PIXI.Graphics(), new Sprite(), new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new PIXI.Graphics(), new Sprite(), new Sprite(), new Sprite(), new Sprite()];
var texts = [];

var creatures = [];
var projectiles = [];

var crosshair = new Sprite();
app.renderer.plugins.interaction.on("mousemove", positionSet => creatures.length > 0 && creatures[0].casting ? "" : crosshair.position.set(pointer.x / stage.scale.x, pointer.y / stage.scale.x));
crosshair.focus = false;

var state = "";
var level = 0;
var time = 0;
var enemyCount = 0;

//Basic collision 
function collision(sprite1, sprite2, circle = false) {
    if (!circle) {
        let trueCor = [sprite1.x - sprite1.width / 2, sprite1.y - sprite1.height / 2, sprite2.x - sprite2.width / 2, sprite2.y - sprite2.height / 2];

        if (trueCor[0] + sprite1.width > trueCor[2] && trueCor[0] < trueCor[2] + sprite2.width && trueCor[1] + sprite1.height > trueCor[3] && trueCor[1] < trueCor[3] + sprite2.height) {
            return true;
        } else {
            return false;
        }
    } else {
        if (Math.sqrt(Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)) < circle) {
            return true;
        } else {
            return false;
        }
    }
}

//Loads constructors
function loadFile(url) {
    let fileScript = document.createElement("script");
    fileScript.src = url;
    document.head.appendChild(fileScript);
}

function setVolume() {
    for (sounds in soundEffects) {
        sound.Sound.from(soundEffects[sounds]).volume = soundVolume;
    }
}

function fullScreen(toggle = false) {
    //For toggles 
    if (toggle) {

        if (!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && stage.scale.x == 1) {
            //If both are supported choose the lesser, if not choose the one that is supported. This helps with mobile support

            if (app.view.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                app.view.webkitRequestFullscreen();
            } else if (app.view.requestFullscreen) {
                app.view.requestFullscreen();
            } else if (app.view.mozRequestFullScreen) {
                /* Firefox */
                app.view.mozRequestFullScreen();
            } else if (app.view.msRequestFullscreen) {
                /* IE/Edge */
                app.view.msRequestFullscreen();
            }

        } else {
            if (document.webkitExitFullscreen) {
                /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                /* IE/Edge */
                document.msExitFullscreen();
            }

        }

    } else {

        GUI[6].texture = resources["spriteSheet"].textures["Bubble_" + (stage.scale.x <= 1 ? "Fullscreen" : "Exitscreen") + ".png"];

        if (!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            app.renderer.resize(640, 360);
            stage.scale.set(1, 1);
        } else {
            app.renderer.resize(window.innerWidth, window.innerWidth / (640 / 360));
            stage.scale.set(window.innerWidth / 640, window.innerWidth / 640);
        }

    }
}

function bubbleSetup(overlay = false, refresh = false, nodes = false) {
    //Refreshes all bubbles
    if (refresh) {
        for (bubbles in skillBubbles) {
            stage.removeChild(skillBubbles[bubbles]);
        }
    }

    //Sets up skill bubbles for skill tree
    if (nodes) {

        let nodeNames = ["Conceit", "Ingrain_Conceit", "Viral_Arrogance", "Exploit", "Ingrain_Exploit", "Freeze_Manipulation", "Undermine", "Ingrain_Undermine", "Vital_Projection", "Gambit", "Ingrain_Gambit", "Last_Resort", "Health_Up", "Health_Up", "Attack_Up", "Attack_Up"];
        let preBuy = false;

        for (let index = 8; index < skillBubbles.length; index++) {
            let nodeCost = nodeNames[index - 8] == "Health_Up" || nodeNames[index - 8] == "Attack_Up" ? skills[nodeNames[index - 8]].node[index % 2][0] : skills[nodeNames[index - 8]].node[0];

            skillBubbles[index].texture = resources["spriteSheet"].textures["Bubble_" + nodeNames[index - 8] + ".png"];
            skillBubbles[index].scale.set(skillTree[index - 7] || index == 8 ? 0.3 : 0.25, skillTree[index - 7] || index == 8 ? 0.3 : 0.25);
            skillBubbles[index].tint = skillTree[index - 7] || index == 8 ? "0xFFFFFF" : skillTree[0] >= nodeCost && (nodeNames[index - 8] == "Health_Up" || nodeNames[index - 8] == "Attack_Up" ? skillTree[skills[nodeNames[index - 8]].node[index % 2][3]] : skillTree[skills[nodeNames[index - 8]].node[3]]) ? "0x707070" : "0x454545";
            skillBubbles[index].anchor.set(0.5);
            skillBubbles[index].x = nodeNames[index - 8] == "Health_Up" || nodeNames[index - 8] == "Attack_Up" ? skills[nodeNames[index - 8]].node[index % 2][1] : skills[nodeNames[index - 8]].node[1];
            skillBubbles[index].y = nodeNames[index - 8] == "Health_Up" || nodeNames[index - 8] == "Attack_Up" ? skills[nodeNames[index - 8]].node[index % 2][2] : skills[nodeNames[index - 8]].node[2];

            skillBubbles[index].interactive = (skillTree[0] >= nodeCost && (nodeNames[index - 8] == "Health_Up" || nodeNames[index - 8] == "Attack_Up" ? skillTree[skills[nodeNames[index - 8]].node[index % 2][3]] : skillTree[skills[nodeNames[index - 8]].node[3]])) || skillTree[index - 7] || index == 8;
            skillBubbles[index].buttonMode = skillTree[0] >= nodeCost && !skillTree[index - 7] && index > 8;

            if (!overlay) {
                stage.addChild(skillBubbles[index]);

                //Checks for double clicks before buying
                skillBubbles[index].on("pointerdown", skillBuy => skillTree[index - 7] || preBuy !== index ? [texts[0].text = nodeNames[index - 8].split("_").join(" ") + "\n" + skills[nodeNames[index - 8]].description + (skillTree[index - 7] || index == 8 ? "\nUnlocked" : "\nCost: " + nodeCost), preBuy = index] : [skillTree[0] -= nodeCost, skillTree[index - 7] = true, bubbleSetup(true, false, true), preBuy = false, texts[0].text = "", sound.play("Snowball"), save(false)]);
            }

        }

        //Sets up skill bubbles for skill buttons
    } else {

        for (let index = 0; index < creatures[0].skillSet.length * 2; index++) {
            //Used in bubble and cooldown calculations
            let skillGrab = creatures[0].skillSet[Math.floor(index / 2)];
            let skillCooldown = overlay ? overlay.skillCooldown[skillGrab].cooldown : 0;

            if (index % 2 == 0 && overlay) {
                skillBubbles[index].texture = resources["spriteSheet"].textures["Bubble_" + skillGrab + ".png"];
                skillBubbles[index].scale.set(0.30 - creatures[0].frame / 100, 0.30 - creatures[0].frame / 100);
                skillBubbles[index].anchor.set(0.5);
                skillBubbles[index].x = Math.floor(index / 2) * 100 + 50;
                skillBubbles[index].y = 320;
                skillBubbles[index].zIndex = 4;

                if (index !== 0 && overlay && creatures[0].x == 75) {
                    skillBubbles[index].interactive = skillCooldown <= 0;
                    skillBubbles[index].buttonMode = true;
                }

            } else if (index % 2 == 1 && overlay) {
                skillBubbles[index].clear();
                skillBubbles[index].beginFill(0x000);
                skillBubbles[index].arc(Math.floor(index / 2) * 100 + 50, 320, 30, -Math.PI * 0.5, Math.PI / 180 * ((skillCooldown / skills[skillGrab].cooldown) * 360) - Math.PI * 0.5, false);
                skillBubbles[index].alpha = 0.5;
                skillBubbles[index].lineTo(Math.floor(index / 2) * 100 + 50, 320);
                skillBubbles[index].endFill();
                skillBubbles[index].zIndex = 5;
            }

            if (!overlay) {
                stage.addChild(skillBubbles[index]);
                if (index % 2 == 0) skillBubbles[index].on("pointerdown", skillTrigger => creatures[0].trigger(creatures[0].skillSet[index / 2], this, false));
            }
        }
    }
}

function toggleDifficulty(toggle = false) {
    if (toggle && (level % 3 == 2 || (!levelCompletion[level] && level % 3 == 1))) {
        level = level > 6 ? 6 : level > 3 ? 3 : 0;
    } else if (toggle && levelCompletion[level] && level % 3 == 1) {
        level += 1;
    } else if (toggle && levelCompletion[level]) {
        level += 1;
    }

    GUI[11].texture = resources["spriteSheet"].textures["Bubble_" + (level % 3 == 2 ? "Incurable" : level % 3 == 1 ? "Ingrained" : "Normal") + ".png"];
    texts[0].text = levels[level].name + "\n" + levels[level].description + (level == 9 ? Math.floor(levelCompletion[9] / 3600) + ":" + Math.floor(levelCompletion[9] % 3600 / 60) : "");
    level == 9 ? stage.removeChild(GUI[11]) : stage.addChild(GUI[11]);
}

function options(overlay = false) {
    if (!overlay) {
        state = "Title";
        
        let baseButtons = [4, 5, 6, 7, 8, 9, 11, 20, 22, 23];
        GUI[4].texture = resources["spriteSheet"].textures["Bubble_Play.png"];
        GUI[5].texture = resources["spriteSheet"].textures["Bubble_" + (musicVolume == 0.7 ? "Music" : "Musicoff") + ".png"];
        GUI[6].texture = resources["spriteSheet"].textures["Bubble_" + (stage.scale.x <= 1 ? "Fullscreen" : "Exitscreen") + ".png"];
        GUI[7].texture = resources["spriteSheet"].textures["Bubble_" + (soundVolume == 1 ? "Sound" : "Soundoff") + ".png"];
        GUI[8].texture = resources["spriteSheet"].textures["Bubble_Replay.png"];
        GUI[9].texture = resources["spriteSheet"].textures["Bubble_Select.png"];
        GUI[11].texture = resources["spriteSheet"].textures["Bubble_Normal.png"];
        GUI[20].texture = resources["spriteSheet"].textures["Bubble_Skillpoints.png"];
        GUI[22].texture = resources["spriteSheet"].textures["Bubble_Back.png"];
        GUI[23].texture = resources["spriteSheet"].textures["Bubble_Save.png"];


        for (let buttons in baseButtons) {
            GUI[baseButtons[buttons]].scale.set(0.4, 0.4);
            GUI[baseButtons[buttons]].anchor.set(0.5);
            GUI[baseButtons[buttons]].zIndex = 5;
            GUI[baseButtons[buttons]].interactive = true;
            GUI[baseButtons[buttons]].buttonMode = true;
        }
        
        GUI[0].position.set(80, 60);
        GUI[0].scale.set(0.5, 0.5);
        GUI[0].anchor.set(0.5);
        GUI[0].interactive = false;
        GUI[0].buttonMode = false;
    }

    switch (state) {

        //Title
        case "Title":
            resetStage();

            //Turns play button into a level start button
            GUI[23].scale.set(0.5, 0.5);
            GUI[23].position.set(190, 200);
            GUI[23].on("pointerdown", changeState => texts[0].text == "DELETE FILE?" ? [localStorage.clear(), skillTree = [0, 0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], levelCompletion = [false, false, false, false, false, false, false, false, false, 0], texts[0].text = "FILE DELETED"] : texts[0].text = "DELETE FILE?");
            stage.addChild(GUI[23]);

            //Turns play button into a level start button
            GUI[4].texture = resources["spriteSheet"].textures["Bubble_Play.png"];
            GUI[4].scale.set(0.5, 0.5);
            GUI[4].position.set(450, 200);
            GUI[4].on("pointerdown", changeState => [state = "Select", options(true)]);
            stage.addChild(GUI[4]);

            break;

            //Level selection phase
        case "Select":
            resetStage();

            //Turns play button into a level start button
            GUI[4].texture = resources["spriteSheet"].textures["Bubble_Play.png"];
            GUI[4].scale.set(0.4, 0.4);
            GUI[4].position.set(600, 320);
            GUI[4].on("pointerdown", changeState => levelCreate());
            stage.addChild(GUI[4]);

            //Toggles difficulty
            GUI[11].on("pointerdown", changeState => toggleDifficulty(true));
            GUI[11].position.set(520, 320)
            toggleDifficulty();

            GUI[22].on("pointerdown", changeState => [state = "Title", options(true)]);
            GUI[22].position.set(40, 320)
            stage.addChild(GUI[22]);

            GUI[20].on("pointerdown", changeState => [state = "Skills", options(true)]);
            GUI[20].position.set(120, 320)
            stage.addChild(GUI[20]);

            //Creates stage buttons
            for (let stages = 0; stages < 4; stages++) {
                let stageChecker = ["Shore", "Forest", "Park", "Mind_Walls"];

                GUI[12 + (stages * 2)] = new Sprite(stageTextures[levels[stages * 3].texture]);
                GUI[12 + (stages * 2)].position.set(stages % 2 == 0 ? 120 : 360, stages < 2 ? 90 : 190);
                GUI[12 + (stages * 2)].scale.set(0.125, 0.125);

                if (stages == 0 || levelCompletion[(stages - 1) * 3]) {
                    GUI[12 + (stages * 2)].interactive = true;
                    GUI[12 + (stages * 2)].buttonMode = true;
                }

                GUI[13 + (stages * 2)].clear();
                GUI[13 + (stages * 2)].lineStyle(4,
                    (stages == 3 && levelCompletion[9] >= 4320) || (stages < 3 && levelCompletion[(stages * 3) + 2]) ? "0x3a55cf" :
                    (stages == 3 && levelCompletion[9] >= 2880) || (stages < 3 && levelCompletion[(stages * 3) + 1]) ? "0x5bcf44" :
                    (stages == 3 && levelCompletion[9] >= 1440) || (stages < 3 && levelCompletion[stages * 3]) ? "0xcf4236" : "0x000000");


                if (stages !== 0 && !levelCompletion[(stages - 1) * 3]) {
                    GUI[13 + (stages * 2)].beginFill("0x000000");
                }

                GUI[13 + (stages * 2)].drawRect(stages % 2 == 0 ? 120 : 360, stages < 2 ? 90 : 190, 160, 90);

                if (stages !== 0 && !levelCompletion[(stages - 1) * 3]) {
                    GUI[13 + (stages * 2)].alpha = 0.75;
                    GUI[13 + (stages * 2)].endFill();
                }

                GUI[12 + (stages * 2)].on("pointerdown", changeState => [level = stages * 3, toggleDifficulty()]);
                GUI[13 + (stages * 2)].zIndex = 5;

                stage.addChild(GUI[12 + (stages * 2)]);
                stage.addChild(GUI[13 + (stages * 2)]);
            }

            break;

            //Skill select
        case "Skills":
            resetStage();

            GUI[9].position.set(600, 320);
            GUI[9].on("pointerdown", changeState => [state = "Select", options(true)]);
            stage.addChild(GUI[9]);

            GUI[21].texture = resources["spriteSheet"].textures["Skillpoints.png"];
            GUI[21].position.set(45, 320);
            GUI[21].scale.set(0.5, 0.5);
            GUI[21].anchor.set(0.5);
            GUI[21].interactive = true;
            GUI[21].buttonMode = true;
            GUI[21].on("pointerdown", changeState => [skillTree = skillTree.map(a => a == true && a !== 1 ? !a : a), skillTree[0] = skillTree[1], bubbleSetup(true, false, true), preBuy = false, texts[0].text = "", sound.play("Fortify"), save(false)]);
            stage.addChild(GUI[21]);

            bubbleSetup(false, false, true);

            break;

        case "Pause":
            GUI[5].position.set(200, 240);
            GUI[6].position.set(320, 240);
            GUI[7].position.set(440, 240);
            GUI[8].position.set(260, 120);
            GUI[9].position.set(380, 120);
            GUI[5].on("pointerdown", changeState => [musicVolume = musicVolume == 0.7 ? 0 : 0.7, music.volume = musicVolume, GUI[5].texture = resources["spriteSheet"].textures["Bubble_" + (musicVolume == 0.7 ? "Music" : "Musicoff") + ".png"]]);

            GUI[6].on("pointerdown", changeState => fullScreen(true));

            GUI[7].on("pointerdown", changeState => [soundVolume = soundVolume == 1 ? 0 : 1, setVolume(), GUI[7].texture = resources["spriteSheet"].textures["Bubble_" + (soundVolume == 1 ? "Sound" : "Soundoff") + ".png"]]);

            GUI[8].on("pointerdown", changeState => levelCreate());
            GUI[9].on("pointerdown", changeState => [state = "Select", options(true)]);

            for (let button = 0; button < 5; button++) {
                stage.addChild(GUI[button + 5]);
            }

            break;

        case "Play":
            for (let button = 0; button < 5; button++) {
                stage.removeChild(GUI[button + 5]);
            }

            break;

        case "Win":
            if (!levelCompletion[level]) {
                levelCompletion[level] = true;
                skillTree[0] += levels[level].skillPoints;
                skillTree[1] += levels[level].skillPoints;
                save(false);
            }

            texts[0].text = level == 8 ? "FLAWED" : "YOU WON!";
            GUI[8].position.set(200, 180);
            GUI[9].position.set(440, 180);

            GUI[8].on("pointerdown", changeState => levelCreate());
            GUI[9].on("pointerdown", changeState => [state = "Select", options(true)]);

            stage.addChild(GUI[8]);
            stage.addChild(GUI[9]);
            stage.removeChild(GUI[4]);

            music.pause();
            music = muzakList[6];
            music.volume = musicVolume;
            music.loop = false;
            music.play();
            break;

        case "Fail":
            texts[0].text = "TRY AGAIN?";
            GUI[8].position.set(200, 180);
            GUI[9].position.set(440, 180);

            GUI[8].on("pointerdown", changeState => levelCreate());
            GUI[9].on("pointerdown", changeState => [state = "Select", options(true)]);

            stage.addChild(GUI[8]);
            stage.addChild(GUI[9]);
            stage.removeChild(GUI[4]);

            music.pause();
            music = muzakList[7];
            music.volume = musicVolume;
            music.loop = false;
            music.play();

            //Endless mode
            if (level == 9 && time > levelCompletion[level]) {
                levelCompletion[level] = time;
                texts[0].text = "HIGH SCORE!";
                save(false);
            }

            break;
    }
}

function resetStage() {
    stage.removeChild(background);
    background = new Sprite(stageTextures[state == "Title" ? 0 : state == "Select" || state == "Skills" ? 1 : levels[level].texture]);
    background.scale.set(0.5, 0.5);
    stage.addChild(background);

    if (state !== "Title" && (state == "Play" || music.url !== "muzak/MainTheme.mp3")) {
        music.pause();
        music = muzakList[state == "Select" || state == "Skills" || state == "Title" ? 0 : levels[level].muzak];
        music.volume = musicVolume;
        music.loop = true;
        music.play();
    }

    for (moveCreature in creatures) {
        creatures[moveCreature].image.removeAllListeners();
        stage.removeChild(creatures[moveCreature].image);
        stage.removeChild(creatures[moveCreature].shadow);
        stage.removeChild(creatures[moveCreature].baseBar);
    }

    for (moveProjectile in projectiles) {
        stage.removeChild(projectiles[moveProjectile].image);
    }

    for (graphics in GUI) {
        stage.removeChild(GUI[graphics]);
        GUI[graphics].removeAllListeners();
    }

    for (bubbles in skillBubbles) {
        stage.removeChild(skillBubbles[bubbles]);
        skillBubbles[bubbles].removeAllListeners();
    }

    time = -30;
    stage.removeChild(crosshair);
    stage.addChild(GUI[10]);

    texts[0].text = "";

    creatures = [];
    projectiles = [];
}

function levelCreate() {
    state = "Play";
    enemyCount = 0;

    resetStage();

    //Resets Flawless skillset based on skill tree
    creatureSets["Flawless"].health = skillTree[13] && skillTree[14] ? 240 : skillTree[13] || skillTree[14] ? 180 : 120;
    creatureSets["Flawless"].attack = skillTree[15] && skillTree[16] ? 20 : skillTree[15] || skillTree[16] ? 15 : 10;
    creatureSets["Flawless"].moves = [];

    creatureSets["Flawless"].moves.push(skillTree[3] ? "Viral_Arrogance" : skillTree[2] ? "Ingrain_Conceit" : "Conceit");

    if (skillTree[4] || skillTree[5] || skillTree[6]) {
        creatureSets["Flawless"].moves.push(skillTree[6] ? "Freeze_Manipulation" : skillTree[5] ? "Ingrain_Exploit" : "Exploit");
    }

    if (skillTree[7] || skillTree[8] || skillTree[9]) {
        creatureSets["Flawless"].moves.push(skillTree[9] ? "Vital_Projection" : skillTree[8] ? "Ingrain_Undermine" : "Undermine");
    }

    if (skillTree[10] || skillTree[11] || skillTree[12]) {
        creatureSets["Flawless"].moves.push(skillTree[12] ? "Last_Resort" : skillTree[11] ? "Ingrain_Gambit" : "Gambit");
    }

    creatures.push(new creature("Flawless", -50, 180));

    stage.addChild(GUI[0]);
    stage.addChild(GUI[1]);

    //Turns play button into a pause button
    GUI[4] = new Sprite(resources["spriteSheet"].textures["Bubble_Pause.png"]);
    GUI[4].position.set(615, 25);
    GUI[4].scale.set(0.25, 0.25);
    GUI[4].anchor.set(0.5);
    GUI[4].zIndex = 5;
    GUI[4].interactive = true;
    GUI[4].buttonMode = true;
    GUI[4].on("pointerdown", changeState => [GUI[4].texture = resources["spriteSheet"].textures["Bubble_" + state + ".png"], state = state == "Play" ? "Pause" : "Play", options(true)]);
    stage.addChild(GUI[4]);

    stage.addChild(crosshair);

    bubbleSetup(false, true);
    options(true);
}

function levelHandle() {
    //Dynamic spawns for endless mode
    if (level == 9 && time == levels[level].spawn.length * 360) {
        for (let waveCreate = (time / 1440) * 4; waveCreate < (time / 1440) * 4 + 4; waveCreate++) {
            levels[level].spawn[waveCreate] = [];

            for (spawnDouble in levels[level].spawn[waveCreate - 4]) {
                levels[level].spawn[waveCreate].push(levels[level].spawn[waveCreate - 4][spawnDouble]);
                levels[level].spawn[waveCreate].push(levels[level].spawn[waveCreate - 4][spawnDouble]);
            }
        }
    }

    if (time % 360 == 0) {
        for (spawns in levels[level].spawn[time / 360]) {
            creatures.push(new creature(levels[level].spawn[time / 360][spawns], 660 + (spawns * 60), Math.random() * 330));
        }
    }

    //Sets label text
    if (levels[level].tutorial && levels[level].tutorial[Math.floor(time / 360)] !== texts[0].length) {
        texts[0].text = levels[level].tutorial[Math.floor(time / 360)];
    } else if (time <= 0) {
        texts[0].text = "";
    }

    if (enemyCount == 0 && time >= levels[level].spawn.length * 360) {
        state = "Win";
        options(true);
    } else if ((creatures.length == 0 || creatures[0].type !== "Flawless") && texts[0].text !== "FLAWED") {
        state = "Fail";
        options(true);
    }

    time += 1;
}

function save(load, rewrite = false) {
    if (load) {
        skillTree = JSON.parse(localStorage.getItem("Skills"));
        levelCompletion = JSON.parse(localStorage.getItem("Levels"));
    } else {
        localStorage.setItem("Skills", JSON.stringify(skillTree));
        localStorage.setItem("Levels", JSON.stringify(levelCompletion));
    }
}

function setup() {
    var font = new FontFaceObserver("Deutsch");
    font.load().then(
        function() {
            texts[0] = new PIXI.Text("", {
                fontFamily: "Deutsch",
                fontSize: 60,
                fill: "#b8b8b8",
                stroke: "#2b2b2b",
                strokeThickness: 10,
                align: "center"
            });
            texts[0].position.set(320, 45);

            texts[1] = new PIXI.Text("", {
                fontFamily: "Deutsch",
                fontSize: 40,
                fill: "#b8b8b8",
                stroke: "#2b2b2b",
                strokeThickness: 10,
                align: "center"
            });
            texts[1].position.set(520, 280);

            texts[2] = new PIXI.Text("", {
                fontFamily: "Deutsch",
                fontSize: 30,
                fill: "#b8b8b8",
                stroke: "#2b2b2b",
                strokeThickness: 10,
                align: "center"
            });
            texts[2].position.set(520, 320);

            texts[3] = new PIXI.Text("", {
                fontFamily: "Deutsch",
                fontSize: 60,
                fill: "#b8b8b8",
                stroke: "#2b2b2b",
                strokeThickness: 10,
                align: "center"
            });
            texts[3].position.set(100, 320);

            for (textFit in texts) {
                texts[textFit].anchor.set(0.5);
                texts[textFit].scale.set(0.5, 0.5);
                texts[textFit].zIndex = 7;
                stage.addChild(texts[textFit]);
            }
        }
    );

    if (localStorage.length > 0) {
        save(true);
    }

    //Initial textures
    background = new Sprite(stageTextures[1]);
    background.scale.set(0.5, 0.5);
    stage.addChild(background);
    
    crosshair.texture = resources["spriteSheet"].textures["Crosshair_Conceit.png"];
    crosshair.scale.set(0.5, 0.5);
    crosshair.anchor.set(0.5);
    crosshair.zIndex = 6;

    GUI[0].texture = resources["spriteSheet"].textures["Bubble_Flawless.png"];
    GUI[0].position.set(80, 60);
    GUI[0].scale.set(0.5, 0.5);
    GUI[0].anchor.set(0.5);
    GUI[0].zIndex = 5;
    GUI[0].interactive = true;
    GUI[0].buttonMode = true;
    GUI[0].on("pointerdown", speedUp => GUI[0].scale.set(GUI[0].scale.x *= 0.9, GUI[0].scale.y *= 0.9));
               
    stage.addChild(GUI[0]);

    ticker.add(function(delta) {
        if (texts.length > 0) {
            //Setups time for animations
            if (state !== "Pause" && state !== "Play") {
                time += 1;
            }

            //Waits till all mp3 files are loaded before continuing
            if (mp3Loader !== "Complete") {
                if (mp3Loader == muzakList.length + soundEffects.length) {
                    mp3Loader = "Complete";
                    options();
                } else {
                    GUI[0].x > 600 && GUI[0].scale.x > 0 ? GUI[0].scale.x *= -1 : GUI[0].x < 40 && GUI[0].scale.x < 0 ? GUI[0].scale.x *= -1 : GUI[0].x += GUI[0].scale.x > 0 ? 5 : -5;
                    GUI[0].y > 320 && GUI[0].scale.y > 0 ? GUI[0].scale.y *= -1 : GUI[0].y < 40 && GUI[0].scale.y < 0 ? GUI[0].scale.y *= -1 : GUI[0].y += GUI[0].scale.y > 0 ? 5 : -5;
                    texts[0].text = "Loading"+(time % 60 > 40 ? "...\n" : time % 60 > 20 ? "..\n" : ".\n")+ Math.floor((mp3Loader / (muzakList.length + soundEffects.length)) * 100)+"%";
                    app.renderer.render(stage);
               
                }
                
                return; 
            } 

            if (state == "Play") {
                levelHandle();

                for (moveCreature in creatures) {
                    creatures[moveCreature].draw();
                }

                for (moveProjectile in projectiles) {
                    projectiles[moveProjectile].draw();
                }

            }

            fullScreen();

            //Handles text GUI
            texts[0].style.fontSize = state == "Select" || state == "Skills" ? 40 : 60 - (crosshair.rotation % 5) * 5;

            if (!crosshair.focus || (state !== "Pause" && state !== "Play")) {
                texts[1].text = "";
                texts[2].text = "";

                state == "Skills" ? texts[3].text = skillTree[0] : texts[3].text = "";
            }

            if (state == "Pause" || state == "Play") {
                crosshair.rotation += crosshair.focus ? 0.2 : 0.1;
                crosshair.focus = false;
            }


            if (time < 0) {
                GUI[10].clear();
                GUI[10].lineStyle(time * -26, "0x000000");
                GUI[10].drawEllipse(320, 180, 380, 380);
                GUI[10].zIndex = 8;
            }
          
            //Sorts all children by Z-Index then by position
            stage.children.sort(function(a, b) {
                if (a.zIndex > b.zIndex) return 1;
                if (a.y > b.y) return 1;
                if (a.y < b.y) return -1;
                if (a.x > b.x) return 1;
                if (a.x < b.x) return -1;
                return 0;
            });

            app.renderer.render(stage);
        }
    });
}

document.getElementById("container").appendChild(app.view);

loadFile("js/creatureClass.js");
loadFile("js/projectileClass.js");
loadFile("js/fontfaceobserver.js");
loadFile("js/info.js");