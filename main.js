json = {
	"frames": {
		"Fin-ish.png": {
			"frame": {
				"x": 1,
				"y": 1,
				"w": 75,
				"h": 60
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 75,
				"h": 60
			},
			"sourceSize": {
				"w": 75,
				"h": 60
			}
		},
		"Fin-ish1.png": {
			"frame": {
				"x": 78,
				"y": 1,
				"w": 75,
				"h": 60
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 75,
				"h": 60
			},
			"sourceSize": {
				"w": 75,
				"h": 60
			}
		},
		"Fin-ish2.png": {
			"frame": {
				"x": 1,
				"y": 63,
				"w": 75,
				"h": 60
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 75,
				"h": 60
			},
			"sourceSize": {
				"w": 75,
				"h": 60
			}
		}
	},
	"meta": {
		"app": "http://www.codeandweb.com/texturepacker",
		"version": "1.0",
		"image": "spritesheet.png",
		"format": "RGBA8888",
		"size": {
			"w": 154,
			"h": 124
		},
		"scale": "1"
	}
}


//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

const app =  new Application ({
    width: 800,
    height: 450,
    resolution: 1,
    resolution: devicePixelRatio
});

loader.add("spritesheet.png").load(setup);

function setup(){
    let test = resources[json];
    
    let fin = new Sprite(test.textures["Fin-ish.png"]);
    app.stage.addChild(fin);

}


document.body.appendChild(app.view);