var skills = {
    Conceit: {
        description: "A scornful glare that lights up a flare",
        node: [0, 50, 180, 1],
        scale: 0.25,
        power: 3,
        speed: 6,
        state: "Snare",
        cooldown: 0.5,
        offset: [0, 20],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Conceit",
    },

    Ingrain_Conceit: {
        description: "A scornful glare that blinds the truth",
        node: [1, 160, 180, 1],
        skillPoints: 1,
        scale: 0.25,
        power: 6,
        speed: 9,
        state: "Snare",
        cooldown: 0.5,
        offset: [0, 20],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Conceit",
    },

    Viral_Arrogance: {
        description: "A lie from within that spreads like fire + SPLIT",
        node: [2, 270, 180, 2],
        scale: 0.25,
        power: 6,
        speed: 12,
        state: "Split",
        cooldown: 0.5,
        offset: [-5, 20],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Conceit",
    },

    Exploit: {
        description: "Frees a damage reflecting minion",
        node: [1, 110, 100, 1],
        cooldown: 5,
        animation: "Exploit",
    },

    Ingrain_Exploit: {
        description: "Shoots a spawn that deals double the harm",
        node: [2, 255, 100, 4],
        cooldown: 5,
        animation: "Exploit",
    },

    Freeze_Manipulation: {
        description: "Punishes threefold and a little more + FREEZE",
        node: [2, 400, 100, 5],
        cooldown: 5,
        animation: "Exploit",
    },

    Undermine: {
        description: "Pushes fiends away for a different time",
        node: [1, 110, 260, 1],
        scale: 0,
        power: 0,
        speed: 6,
        state: "Burst",
        value: 60,
        cooldown: 10,
        offset: [0, 5],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Undermine",
    },

    Ingrain_Undermine: {
        description: "Shoves fiends and problems alike",
        node: [2, 255, 260, 7],
        scale: 0,
        power: 0,
        speed: 9,
        state: "Burst",
        value: 90,
        cooldown: 10,
        offset: [0, 5],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Undermine",
    },

    Vital_Projection: {
        description: "Knocks enemies for a quick recovery + REGENERATE",
        node: [2, 400, 260, 8],
        scale: 0,
        power: 0,
        speed: 9,
        state: "Burst",
        value: 120,
        cooldown: 10,
        offset: [0, 5],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Undermine",
    },

    Gambit: {
        description: "Uses life energy to clean a mess",
        node: [2, 380, 180, 3],
        scale: 0.25,
        power: 1,
        speed: 0,
        state: "Gambit",
        cooldown: 15,
        offset: [2, 8],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Gambit",
    },

    Ingrain_Gambit: {
        description: "Uses life energy to wipe out pests",
        node: [2, 490, 180, 10],
        scale: 0.25,
        power: 2,
        speed: 3,
        state: "Gambit",
        cooldown: 15,
        offset: [2, 8],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Gambit",
    },

    Last_Resort: {
        description: "Shares a doomed fate of oneself + HOMING",
        node: [3, 600, 180, 11],
        scale: 0.25,
        power: 3,
        speed: 3,
        state: "Gambit",
        cooldown: 15,
        offset: [2, 8],
        friendlyFire: ["Player", "Minion", "Boss"],
        animation: "Gambit",
    },

    Barrage_Gambit: {
        scale: 0.25,
        power: 1,
        speed: 6,
        state: "Barrage",
        offset: [0, 0],
        friendlyFire: ["Player", "Minion", "Boss"],
    },

    Barrage_Ingrain_Gambit: {
        scale: 0.25,
        power: 2,
        speed: 9,
        state: "Barrage",
        offset: [0, 0],
        friendlyFire: ["Player", "Minion", "Boss"],
    },

    Barrage_Last_Resort: {
        scale: 0.25,
        power: 3,
        speed: 9,
        state: "Barrage",
        offset: [0, 0],
        friendlyFire: ["Player", "Minion", "Boss"],
    },

    Health_Up: {
        description: "Increases maximum health",
        node: [
            [2, 330, 320, 8],
            [3, 545, 260, 9]
        ],
    },

    Attack_Up: {
        description: "Increases attack damage",
        node: [
            [2, 330, 40, 5],
            [3, 545, 100, 6]
        ],
    },

    Enrage: {
        range: 90,
        cooldown: 2,
        animation: "Enrage",
    },

    Snowball: {
        scale: 0.15,
        power: 1,
        speed: 6,
        state: "Snowball",
        cooldown: 2,
        offset: [2, -17],
        friendlyFire: ["Passive", "Hostile", "Ranged", "Boss"],
        animation: "Snowball",
    },

    Bargain: {
        scale: 0.5,
        power: 1,
        speed: 6,
        state: "Bargain",
        cooldown: 2,
        offset: [0, 15],
        friendlyFire: ["Passive", "Hostile", "Ranged", "Boss"],
        animation: "Bargain",
    },

    Resonate: {
        value: 360,
        cooldown: 0.5,
        animation: "Resonate",
    },

    Fortify: {
        scale: 0,
        power: 3,
        speed: 6,
        state: "Fort",
        offset: [0, 5],
        friendlyFire: ["Player", "Minion", "Boss"],
    },

    Circulate: {
        cooldown: 1,
        animation: "Resonate",
    },

    Steadfast: {
        cooldown: 6,
        animation: "Resonate",
    },

    Acceptance: {
        power: 2,
        cooldown: 0,
        animation: "Resonate",
    },

    Haste: {
        value: 2,
        duration: 120,
    },

    Freeze: {
        duration: 120,
    },

    Regenerate: {
        value: 60,
    },
};

var creatureSets = {
    Flawless: {
        description: "A perfect being that can\ncycle attacks to defend itself.",
        color: "#c644ea",
        scale: 0.25,
        health: 0,
        attack: 0,
        speed: 3,
        movement: "Player",
        moves: [],
    },

    Exploiter: {
        scale: 0.25,
        health: 30,
        attack: 1,
        speed: 9,
        movement: "Minion",
        moves: [],
    },

    Ingrain_Exploiter: {
        scale: 0.25,
        health: 30,
        attack: 2,
        speed: 12,
        movement: "Minion",
        moves: [],
    },

    Freeze_Manipulator: {
        scale: 0.25,
        health: 30,
        attack: 3,
        speed: 12,
        movement: "Minion",
        moves: [],
    },

    Break: {
        description: "Innocent creatures that play on\nfields, foreboding a terrible fate",
        color: "#efefef",
        scale: 0.25,
        health: 60,
        attack: 30,
        speed: 2,
        movement: "Passive",
        moves: [],
    },

    Naysay: {
        description: "Hostile creatures that rush in\nignoring the inevitable",
        color: "#f7c8c8",
        scale: 0.25,
        health: 90,
        attack: 30,
        speed: 3,
        movement: "Hostile",
        moves: [],
    },

    Pique: {
        description: "Irritating creatures that speed\nup their comrades' attacks",
        color: "#f44870",
        scale: 0.25,
        health: 180,
        attack: 30,
        speed: 2,
        movement: "Hostile",
        moves: ["Enrage"],
    },

    Gloom: {
        description: "Scourges planted on fields\nwith snowballing shots",
        color: "#3f20e9",
        scale: 0.25,
        health: 120,
        attack: 30,
        speed: 3,
        movement: "Ranged",
        moves: ["Snowball"],
    },

    Haggle: {
        description: "Mischievous creatures that conjure\nenrage balls to scourge the land",
        color: "#00e334",
        scale: 0.25,
        health: 240,
        attack: 60,
        speed: 3,
        movement: "Ranged",
        moves: ["Bargain"],
    },

    Flawed: {
        description: "An imperfect being that uses\npecuilar attacks",
        color: "#90f8ff",
        scale: 0.25,
        health: 240,
        attack: 30,
        speed: 3,
        movement: "Boss",
        moves: ["Resonate", "Circulate", "Steadfast", "Acceptance"],
    }
};

var levels = {
    0: {
        name: "Trouble at Shore",
        description: "Creatures have been flocking the shores in groups. You\nhave been assigned a simple task: take them down.",
        skillPoints: 1,
        texture: 2,
        muzak: "ShoreTheme",
        tutorial: ["CLICK TO ATTACK!", "INCOMING!", "INCOMING!", "WATCH OUT!", "MORE?", "MORE?", ""],
        spawn: [
            ["Break"],
            ["Break", "Break"],
            ["Break", "Break", "Break"],
            ["Naysay"],
            ["Break", "Break", "Break"],
            ["Break", "Naysay", "Break"],
            ["Break", "Break", "Break"],
            ["Naysay"],
            ["Break", "Break", "Break"],
            ["Naysay", "Break", "Naysay"]
        ],
    },

    1: {
        name: "Wave after Wave",
        description: "Prepare for a Naysay onslaught after a horde of Breaks\ndrop in.",
        skillPoints: 2,
        texture: 2,
        muzak: "ShoreTheme",
        spawn: [
            ["Break"],
            ["Break", "Break"],
            ["Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Naysay"],
            ["Naysay", "Naysay"],
            ["Break", "Naysay", "Break"],
            ["Naysay", "Break", "Naysay"],
            ["Naysay", "Naysay", "Naysay"],
        ],
    },

    2: {
        name: "Boiling Point",
        description: "A new challenger has approached. Whatever you do:\ndon't let them get near the others.",
        skillPoints: 3,
        texture: 2,
        muzak: "ShoreTheme",
        tutorial: ["", "", "", "", "TAKE THEM OUT!", ""],
        spawn: [
            ["Naysay"],
            ["Break", "Naysay", "Break"],
            ["Naysay", "Break", "Naysay"],
            ["Naysay", "Naysay", "Naysay"],
            ["Pique"],
            ["Naysay", "Naysay", "Naysay"],
            ["Naysay", "Pique", "Naysay"],
            ["Break", "Naysay", "Pique", "Naysay", "Break"],
            ["Pique", "Break", "Pique"],
            ["Pique", "Naysay", "Pique"],
        ],
    },

    3: {
        name: "Forest Wanderers",
        description: "The forests have been getting all the more dangerous by\nthe passing of the hour. Keep your guard.",
        skillPoints: 3,
        texture: 3,
        muzak: "ForestTheme",
        spawn: [
            ["Break"],
            ["Naysay", "Naysay", "Naysay"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Break", "Pique", "Break"],
            ["Naysay", "Pique", "Naysay"],
            ["Pique", "Naysay", "Pique"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Break", "Naysay", "Pique", "Naysay", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Break", "Pique", "Naysay", "Pique", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Pique", "Break", "Pique"],
            ["Pique", "Naysay", "Pique"],
            ["Pique", "Pique", "Pique"],
        ],
    },

    4: {
        name: "Forest Witches",
        description: "Another challenger has approached. Friend or foe,\nthey won't be helping for long.",
        skillPoints: 4,
        texture: 3,
        muzak: "ForestTheme",
        tutorial: ["", "", "", "", "", "TAKE THEM OUT!", ""],
        spawn: [
            ["Break", "Break", "Break", "Break", "Break"],
            ["Break", "Pique", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Naysay", "Pique", "Naysay"],
            ["Pique", "Naysay", "Pique"],
            ["Haggle"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Haggle"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Break", "Haggle", "Break"],
            ["Naysay", "Haggle", "Naysay"],
            ["Pique", "Haggle", "Pique"],
            ["Haggle", "Break", "Haggle"],
            ["Haggle", "Naysay", "Haggle"],
            ["Haggle", "Pique", "Haggle"],
        ],
    },

    5: {
        name: "Clockwork Coven",
        description: "A group of Haggles was spotted in a clearing in the\nforest. Wipe them out as quick as possible.",
        skillPoints: 5,
        texture: 3,
        muzak: "ForestTheme",
        spawn: [
            ["Haggle"],
            ["Haggle", "Haggle"],
            ["Haggle"],
            ["Haggle", "Haggle", "Haggle"],
            ["Haggle", "Haggle"],
            ["Haggle", "Haggle", "Haggle"],
            ["Haggle", "Haggle"],
            ["Haggle", "Haggle", "Haggle", "Haggle"],
            ["Haggle", "Haggle", "Haggle"],
            ["Haggle", "Haggle", "Haggle", "Haggle"],
        ],
    },

    6: {
        name: "Park Introductions",
        description: "The readings say there's something in\nthe park. Something almost as powerful as you.",
        skillPoints: 3,
        texture: 4,
        muzak: "ParkTheme",
        spawn: [
            ["Haggle"],
            ["Break", "Break", "Break"],
            ["Naysay", "Pique", "Naysay"],
            ["Pique", "Haggle", "Pique"],
            ["Haggle", "Pique", "Haggle"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Naysay", "Naysay", "Naysay"],
            ["Pique", "Pique", "Pique"],
            ["Pique", "Haggle", "Pique"],
            ["Naysay", "Pique", "Haggle", "Pique", "Naysay"],
            ["Break", "Naysay", "Pique", "Haggle", "Pique", "Naysay", "Break"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Haggle", "Pique", "Haggle"],
            ["Haggle", "Haggle", "Haggle"],
        ],
    },

    7: {
        name: "Icebreakers",
        description: "A horde of Breaks was circling the tunnel with that special\nreading. Clear the way for who or what is inside there.",
        skillPoints: 4,
        texture: 4,
        muzak: "ParkTheme",
        spawn: [
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
        ],
    },

    8: {
        name: "Last Stand",
        description: "The reading from the tunnel is coming straight towards\nyou. Stand your ground.",
        skillPoints: 5,
        texture: 4,
        muzak: "ParkTheme",
        spawn: [
            ["Pique", "Pique", "Pique"],
            ["Haggle", "Pique", "Haggle"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Naysay", "Naysay", "Pique", "Naysay", "Naysay"],
            ["Naysay", "Pique", "Haggle", "Pique", "Naysay"],
            ["Break", "Naysay", "Pique", "Haggle", "Pique", "Naysay", "Break"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Haggle", "Break", "Haggle"],
            ["Haggle", "Naysay", "Haggle"],
            ["Haggle", "Pique", "Haggle"],
            ["Break", "Break", "Break", "Break", "Break"],
            ["Naysay", "Naysay", "Naysay", "Naysay", "Naysay", "Naysay", "Naysay", "Naysay", "Naysay", "Naysay"],
            ["Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break", "Break"],
            ["Flawed"]
        ],
    },

    9: {
        name: "Mind Walls",
        description: "Protect the Mind Walls against an endless wave of fiends.\nBest Time: ",
        texture: 5,
        muzak: "MindTheme",
        tutorial: ["", "", "", "AN UNFORESEEN EVENT", "", "", "", "SOLITUDE PROLONGED", "", "", "", "HOPE NO MORE", ""],
        spawn: [
            ["Break", "Break", "Break"],
            ["Break", "Naysay", "Break"],
            ["Naysay", "Pique", "Naysay"],
            ["Pique", "Haggle", "Pique"],
        ],
    }
};