
import * as PIXI from 'pixi.js';
import { Howl } from 'howler';

const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

const SYMBOL_SIZE = size.height/3;
const REEL_WIDTH = size.width / 3.3;
let initialScore = 100;
let reels = []


const Reel_Spin = new Howl({
  src: ["./src/assets/audio/Reel_Spin.mp3"],
});

const Landing_1 = new Howl({
  src: ['./src/assets/audio/Spin_Complete.mp3'],
});
const Win_Sound = new Howl({
  src: ["./src/assets/audio/Slot_machine_win.mp3"],
});

let running = false;

// Create the application
const app = new PIXI.Application({ transparent: true, width: size.width * 0.98, height: size.height * 0.98 });

// Add the view to the DOM
document.body.appendChild(app.view);


let backgGround = PIXI.Texture.from("./src/assets/BG.png");



const tilingSprite = new PIXI.TilingSprite(
    backgGround,
    app.screen.width,
    app.screen.height,
);

app.stage.addChild(tilingSprite);

    app.loader.add('01', './src/assets/SYM1.png')
   app.loader.add('02', './src/assets/SYM3.png')
    app.loader.add("03", "./src/assets/SYM4.png")
     app.loader.add("04", "./src/assets/SYM5.png")
     app.loader.add("05", "./src/assets/SYM6.png")
app.loader.add("06", "./src/assets/SYM7.png")
app.loader.add("line", "./src/assets/Bet_Line.png");

app.loader.load(onAssetsLoaded);
function show() {
  let loading = PIXI.Texture.from("./src/assets/5.png");
  const tilingLoading = new PIXI.TilingSprite(
    loading,
    app.screen.width,
    app.screen.height
  );

  app.stage.addChild(tilingLoading);
}

function onAssetsLoaded() {
  const slotTextures = [
    PIXI.Texture.from("01"),
    PIXI.Texture.from("02"),
    PIXI.Texture.from("03"),
    PIXI.Texture.from("04"),
    PIXI.Texture.from("05"),
    PIXI.Texture.from("06"),
  ];


    const reelContainer = new PIXI.Container();
 
  for (let i = 0; i < 3; i++) {
    const rc = new PIXI.Container();
      rc.x = i * REEL_WIDTH;
     
      
    reelContainer.addChild(rc);
    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };
    reel.blur.blurX = reel.blur.blurY = 0;
  
    rc.filters = [reel.blur];
    for (let j = 0; j < 5; j++) {
      const symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
      );

      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }

  
      reels.push(reel);

     
  }

  reelContainer.y = (app.screen.height - SYMBOL_SIZE * 2) / 2;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 3);

  app.stage.addChild(reelContainer);
  


  let score = new PIXI.Graphics();
  score.beginFill(0, 0.5);
  score.drawRect(0, 0, 100, 100);

  let scoreText = new PIXI.Text("Credits:");

  scoreText.x = app.screen.width - scoreText.width - 115;
  scoreText.y = 0;
  scoreText.style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "50px",
    fill: "#F7E3CB",
    stroke: "#4a1850",
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });
  app.stage.addChild(scoreText);
  let ammount = new PIXI.Text(`${initialScore}`);
  ammount.x = app.screen.width - scoreText.width + 60;
  ammount.y = 50;
  ammount.style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "40px",
    fill: "#F7EDCA",
    stroke: "#4a1850",
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });
    app.stage.addChild(ammount);
    
 
  // // Create start button 
 
  const textureStartDisabled = PIXI.Texture.from("./src/assets/BTN_Spin_d.png");

  const textureStartNormal = PIXI.Texture.from("./src/assets/BTN_Spin.png");
  const textureStartPressed = PIXI.Texture.from("./src/assets/BTN_Spin_d.png");
  const button = new PIXI.Sprite(textureStartNormal);
  button.width = button.height = SYMBOL_SIZE/1.5 ;
  button.x = Math.round(app.screen.width - button.width - 30);
  button.y = Math.round(app.screen.height / 2);
  button.buttonMode = true;
  button.interactive = true;
  button
    .on("pointerdown", onButtonDown)
    .on("pointerup", onButtonUp)
    .on("pointerupoutside", onButtonUp)
    .on("pointerout", onButtonOut)
    .on("buttonDisabled", onButtonDisabled);
  app.stage.addChild(button);

  function onButtonDown() {
      this.texture = running ? textureStartDisabled : textureStartPressed;
  }

    function onButtonUp() {
        startPlay();
        this.texture = running ? textureStartDisabled : textureStartNormal;
  }

  function onButtonOut() {
       this.texture = running
              ? textureStartDisabled
              : textureStartNormal
  }

  function onButtonDisabled(e) {
      e.detail.texture = textureStartDisabled;
  }
    function checkWin() {
  const symbols = reels.map((el) => el.symbols[2].texture.textureCacheIds);
        const winingLine = symbols.map((el) => el[0]);
      return (winingLine[1] == winingLine[0] && winingLine[0] == winingLine[2])
  
}
  // Start play function
    function startPlay() {
    
    if (running) return;
      running = true;

          initialScore = initialScore - 2;

      ammount.text = initialScore;
  
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const target = r.position + 50;
      const time = 600 + i * 600;
      tweenTo(
        r,
        "position",
        target,
        time,
        backout(0.2),
        null,
        i === reels.length - 1 ? reelsComplete : null
      );
    }
    Reel_Spin.play();
  }

  // Reels done
  function reelsComplete() {
    running = false;
      Reel_Spin.stop();
       let winingLineTexture = PIXI.Texture.from("./src/assets/Bet_Line.png");
       let winingLine = new PIXI.Sprite(winingLineTexture);
      winingLine.width = app.screen.width - REEL_WIDTH;
       winingLine.height = 10;
       winingLine.x = REEL_WIDTH / 3;
       winingLine.y = app.screen.height / 1.7;
      app.stage.addChild(winingLine);
      if (checkWin())
      {
          payout()
      }
      button.texture = textureStartNormal;
      
  }
    function payout() {Win_Sound.play();
      initialScore = initialScore + 17;

      ammount.text = initialScore;
    }
 
   
  //Animate update
  app.ticker.add((deltaTime) => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });
};

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
};

//Animate update
app.ticker.add((deltaTime) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            Landing_1.play();
            remove.push(t);
        }   
    };
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    };
});

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
};

function backout(amount) {
    return t => (--t * t * ((amount + 1) * t + amount) + 1);
};




