//colores disponibles para jugador
var colors = ["black", "blue", "green", "red", "yellow"];

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var player;
var obstacles;
var lockText;
var score = 0;

function preload() {
  //Toma un color aleatorio para la moto del usuario
  var userColor = colors[Math.floor(Math.random() * colors.length)];
  this.load.image(
    "player",
    "assets/Motorcycles/motorcycle_" + userColor + ".png"
  );
  //Carga los sprites del camino
  this.load.image("leftR", "assets/Tiles/leftR.png");
  this.load.image("centerR", "assets/Tiles/centerR.png");
  this.load.image("rightR", "assets/Tiles/rightR.png");
  //Carga los obstaculos posibles
  this.load.image("ob1","assets/Cars/car_black_1.png");
  this.load.image("ob2","assets/Cars/car_black_2.png");
  this.load.image("ob3","assets/Cars/car_black_3.png");
  this.load.image("ob4","assets/Cars/car_black_4.png");
  this.load.image("ob5","assets/Cars/car_black_5.png");
  this.load.image("ob6","assets/Cars/car_blue_1.png");
  this.load.image("ob7","assets/Cars/car_blue_2.png");
  this.load.image("ob8","assets/Cars/car_blue_3.png");
  this.load.image("ob9","assets/Cars/car_blue_4.png");
  this.load.image("ob10","assets/Cars/car_blue_5.png");
  this.load.image("ob11","assets/Cars/car_green_1.png");
  this.load.image("ob12","assets/Cars/car_green_2.png");
  this.load.image("ob13","assets/Cars/car_green_3.png");
  this.load.image("ob14","assets/Cars/car_green_4.png");
  this.load.image("ob15","assets/Cars/car_green_5.png");
  this.load.image("ob16","assets/Cars/car_red_1.png");
  this.load.image("ob17","assets/Cars/car_red_2.png");
  this.load.image("ob18","assets/Cars/car_red_3.png");
  this.load.image("ob19","assets/Cars/car_red_4.png");
  this.load.image("ob20","assets/Cars/car_red_5.png");
  this.load.image("ob21","assets/Cars/car_yellow_1.png");
  this.load.image("ob22","assets/Cars/car_yellow_2.png");
  this.load.image("ob23","assets/Cars/car_yellow_3.png");
  this.load.image("ob24","assets/Cars/car_yellow_4.png");
  this.load.image("ob25","assets/Cars/car_yellow_5.png");
}

function create() {
  //coloca el camino
  for (let j = 0; j <= 800; j += 128) {
    for (let i = 0; i <= 640; i += 128) {
      this.add.sprite(j, i, "centerR");
    }
  }
  //agrega bordes a la izquierda
  for (let i = 0; i <= 640; i += 128) {
    this.add.sprite(60, i, "leftR");
  }
  //agrega bordes a la derecha
  for (let i = 0; i <= 640; i += 128) {
    this.add.sprite(740, i, "rightR");
  }

  var customBounds = new Phaser.Geom.Rectangle(0, -120, 1000, 1000);
  obstacles = this.physics.add.group({
    key: "obstacles",
    velocityY: 500,
    customBoundsRectangle: customBounds,
    collideWorldBounds: true,
  });

  //añade al jugador
  player = this.physics.add.sprite(400, 300, "player");

  //Colisión entre jugador y obstaculo
  this.physics.add.collider(player, obstacles, function (p, o) {
    gameover();
  });

  // Toma el mouse al dar click
  this.input.on(
    "pointerdown",
    function (pointer) {
      this.input.mouse.requestPointerLock();
    },
    this
  );

  // Sigue el cursor
  this.input.on(
    "pointermove",
    function (pointer) {
      if (this.input.mouse.locked) {
        player.x += pointer.movementX;
        player.y += pointer.movementY;

        // Force the player to stay on screen
        player.x = Phaser.Math.Wrap(player.x, 0, game.renderer.width);
        player.y = Phaser.Math.Wrap(player.y, 0, game.renderer.height);

        if (pointer.movementX > 0) {
          player.setRotation(0.1);
        } else if (pointer.movementX < 0) {
          player.setRotation(-0.1);
        } else {
          player.setRotation(0);
        }

        updateLockText(true);
      }
    },
    this
  );

  // Exit pointer lock when Q is pressed. Browsers will also exit pointer lock when escape is
  // pressed.
  this.input.keyboard.on(
    "keydown-Q",
    function (event) {
      gameover();
    },
    this
  );

  // Optionally, you can subscribe to the game's pointer lock change event to know when the player
  // enters/exits pointer lock. This is useful if you need to update the UI, change to a custom
  // mouse cursor, etc.
  this.input.on(
    "pointerlockchange",
    function (event) {
      console.log(event);

      updateLockText(event.isPointerLocked, player.x, player.y);
    },
    this
  );

  lockText = this.add.text(16, 16, "", {
    fontSize: "20px",
    fill: "#000000",
  });

  updateLockText(false);
}

function updateLockText(isLocked) {
  lockText.setText(["Score: " + score + "\nPresione Q para detener el juego"]);
}

var x = 0;
var t = 120;
var v = 500;
function update() {
  updateLockText();
  if (x % t == 0) {
    obstacles.create(Math.floor(Math.random() * 800), 0, "ob"+Math.floor(Math.random()*25));
    v++;
    obstacles.setVelocityY(v);
    t--;
  }
  score++;
  x++;
}


//Funcion para terminar el juego
function gameover() {
  game.destroy(true);
  document.getElementById("text").style = "display:flex;";
  document.getElementById("score").innerHTML =
    "<center>GAME OVER <br> Puntaje: " +
    score;
}

//Funcion para reiniciar el juego
function restart() {
  document.getElementById("text").style = "display:none;";
  score = 0;
  t = 120;
  v = 500;
  obstacles.setVelocityY(v);
  game = new Phaser.Game(config);
}
