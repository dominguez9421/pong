var game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image("paddle", "assets/paddle.png");
  game.load.image("ball", "assets/ball.png");
  game.load.image("wall", "assets/invisible-wall.png");
}

var paddles;
var playerPaddle;
var aiPaddle;
var ball;
var walls;
var speed;
var space;
var cursors;
var helpText;
var score = {
  player: 0,
  ai: 0
};
var playerScoreText;
var aiScoreText;
var gameOver = false;

function create() {
  // using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Two invisible walls for up and down
  walls = game.add.group();
  walls.enableBody = true;
  var wall = walls.create(0, -40, "wall");
  wall.body.immovable = true;
  wall = walls.create(0, 600, "wall");
  wall.body.immovable = true;

  // Creating ball sprite
  ball = game.add.sprite(
    (game.world.width - 40) / 2,
    (game.world.height - 40) / 2,
    "ball"
  );

  // Enabling phyisics for the ball
  game.physics.arcade.enable(ball);

  // Physics for the ball
  ball.body.bounce.x = 1;
  ball.body.bounce.y = 1;

  // Ball speed
  speed = 500;

  // Add bounds event listener and callback
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballOut, this);

  // Paddles group contains the two paddles
  paddles = game.add.group();

  // Activating physics for paddles
  paddles.enableBody = true;

  // Creating player paddle
  playerPaddle = paddles.create(10, (game.world.height - 128) / 2, "paddle");

  // Creating AI paddle
  aiPaddle = paddles.create(
    game.world.width - 16 - 10,
    (game.world.height - 128) / 2,
    "paddle"
  );

  // Making paddles immovable (no movement transfer)
  paddles.setAll("body.immovable", true);

  // Collision between paddles and world bounds
  paddles.setAll("body.collideWorldBounds", true);

  // Smaller paddles
  paddles.setAll("scale.x", 0.5);
  paddles.setAll("scale.y", 0.5);

  //  Our Controls
  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(32);

  // Help text
  helpText = game.add.text(16, 16, "Press Space Key to start !", {
    fontSize: "32px",
    fill: "#fff"
  });

  // Player Score
  playerScoreText = game.add.text(200, 125, score.player, {
    fontSize: "75px",
    fill: "#fff"
  });
  // AI score
  playerScoreText.anchor.setTo(0.5, 0.5);
  aiScoreText = game.add.text(600, 125, score.ai, {
    fontSize: "75px",
    fill: "#fff"
  });
  aiScoreText.anchor.setTo(0.5, 0.5);
}

function update() {
  if (gameOver) return;
  // Collision between ball and paddles
  game.physics.arcade.collide(paddles, ball);

  // Collision with walls so ball doesn't go into outer space
  game.physics.arcade.collide(walls, ball);

  // Reset velocity at each frame
  playerPaddle.body.velocity.y = 0;

  // Start Game pressing space
  if (space.isDown && ball.body.velocity.x == 0 && ball.body.velocity.y == 0) {
    setVelocity(ball);
    helpText.kill();
  }

  if (cursors.up.isDown) {
    //  Move to the top
    playerPaddle.body.velocity.y = -400;
  } else if (cursors.down.isDown) {
    //  Move to the bottom
    playerPaddle.body.velocity.y = 400;
  } else {
    //  Stand still
    // playerPaddle.animations.stop();
  }

  // simple AI for AI paddle
  aiPaddle.body.velocity.y = ball.body.velocity.y;
  aiPaddle.body.maxVelocity.y = Math.abs(ball.body.velocity.y) * 0.77;
}

function ballOut(ball) {
  updateScore();

  ball.reset((game.world.width - 40) / 2, (game.world.height - 40) / 2);

  // Reset AI paddle
  aiPaddle.reset(game.world.width - 32 - 20, (game.world.height - 256) / 2);
  aiPaddle.body.velocity.x = 0;
  aiPaddle.body.velocity.y = 0;

  // Reset player paddle
  playerPaddle.reset(20, (game.world.height - 256) / 2);
  playerPaddle.body.velocity.x = 0;
  playerPaddle.body.velocity.y = 0;
}

function setVelocity(ball) {
  // Random angle between -30 and 30 degrees
  var angle = Math.random() * (Math.PI / 2) - Math.PI / 4;

  // Generate speed  var speed = 300
  var xSpeed = -Math.cos(angle) * speed;
  var ySpeed = Math.sin(angle) * speed;
  ball.body.velocity.x = xSpeed;
  ball.body.velocity.y = ySpeed;
}

function updateScore() {
  //Point system increase
  if (ball.body.velocity.x > 0) {
    score.player += 1;
    console.log(score.player);
    playerScoreText.text = score.player;
    if (score.player >= 1) {
      endGame();
    }
  } else {
    score.ai += 2;
    console.log(score.ai);
    aiScoreText.text = score.ai;
  }
}

function endGame() {
  gameOver = true;
  helpText = game.add.text(16, 16, "You win", {
    fontSize: "32px",
    fill: "#fff"
  });
  setTimeout(() => window.history.back(), 2000);
}
