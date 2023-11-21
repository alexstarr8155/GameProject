"use strict";
/* 
 * Copyright (c) 2012, 2016 Carson Cheng.
 * Licensed under the MIT-License (http://opensource.org/licenses/MIT)
 * which can be found in the file MIT-LICENSE.txt in the LICENSE directory
 * at the root of this project distribution.
 */
// There are a bunch of special variables and functions.
// Here are some notable ones, but there are many more:
// setup, draw, PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT
var backgroundGroupName = "backgroundGroup";
var playerGroupName = "playerGroup";
var missileGroupName = "missileGroup";
var asteroidGroupName = "asteroidGroup";
var enemyGroupName = "enemyGroup";
var enemyMissilesGroupName = "enemyMissilesGroup";
var ufoGroupName = "ufoGroup";
var textGroupName = "textGroup";
var splashScreenGroupName = "splashScreenGroup";

var level = 0;
var score = 0;
var isMultiplayer = false;

var ufos = [];
var explosions = [];
var largeMissiles = [];
var smallMissiles = [];
var asteroids = [];
var enemyShips = [];
var enemyMissiles = [];

var missilesShot = 0;
var missilesHit = 0;
var levelUp = 0;

var gameStart = false;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}

var addAsteroid = function () {
    var length = asteroids.length;
    asteroids[length] = {
        "id": "asteroid" + length,
        "xspeed": 0,
        "yspeed": 0,
        "xpos": -300,
        "ypos": -300,
        "diagonalSpeed": 2,
        "collide": false,
        "count": 0,
        "time": 0,
        "height": 106,
        "width": 39,
        "done": false,
        "curveSpeed": false,
        "explodeSound": new sound("img/explodeSound.mp3"),
        "onPlayground": false

    };
    var asteroidAnim = newGQAnimation("img/asteroids.png", 4, 39, 50, $.gQ.ANIMATION_HORIZONTAL);

    createSpriteInGroup(asteroidGroupName, asteroids[length]["id"], asteroidAnim, asteroids[length]["width"], asteroids[length]["height"]);
    spriteSetX(asteroids[length]["id"], asteroids[length]["xpos"]);
    spriteSetY(asteroids[length]["id"], asteroids[length]["ypos"]);

};
var addLargeMissile = function () {
    var length = largeMissiles.length;
    largeMissiles[length] = {
        "id": "missile" + length,
        "xspeed": 0,
        "yspeed": 0,
        "stillAnim": newGQAnimation("img/missile1.png"),
        "explodeAnim": newGQAnimation("img/explosion.png", 5, 60, 100, $.gQ.ANIMATION_HORIZONTAL),
        "angle": 0,
        "shootTimes": 0,
        "xpos": 0,
        "ypos": 0,
        "height": 20,
        "width": 75,
        "curveSpeed": false,
        "time": 0
    };

    var missile1Anim = newGQAnimation("img/missile1.png");

    missilesShot++;

    createSpriteInGroup(missileGroupName, largeMissiles[length]["id"], missile1Anim, largeMissiles[length]["width"], largeMissiles[length]["height"]);
    spriteSetX(largeMissiles[length]["id"], largeMissiles[length]["xpos"]);
    spriteSetY(largeMissiles[length]["id"], largeMissiles[length]["ypos"]);


};

var addSmallMissile = function () {
    var length = smallMissiles.length;
    smallMissiles[length] = {
        "id": "smallMissile" + length,
        "xspeed": 0,
        "yspeed": 0,
        "stillAnim": newGQAnimation("img/missile2.png"),
        "explodeAnim": newGQAnimation("img/explosion.png", 5, 60, 100, $.gQ.ANIMATION_HORIZONTAL),
        "angle": 0,
        "shootTimes": 0,
        "xpos": 0,
        "ypos": 0,
        "height": 20,
        "width": 75,
        "curveSpeed": false,
        "time": 0
    };

    var missile1Anim = newGQAnimation("img/missile2.png");

    missilesShot++;

    createSpriteInGroup(missileGroupName, smallMissiles[length]["id"], missile1Anim, smallMissiles[length]["width"], smallMissiles[length]["height"]);
    spriteSetX(smallMissiles[length]["id"], smallMissiles[length]["xpos"]);
    spriteSetY(smallMissiles[length]["id"], smallMissiles[length]["ypos"]);


};

var explodeSpeed = 100;
var disappearSpeed = 100;
var addUfo = function () {
    var length = ufos.length;
    ufos[length] = {
        "id": "ufo" + length,
        "xspeed": 0,
        "yspeed": 0,
        "xpos": -100,
        "ypos": -100,
        "diagonalSpeed": 1,
        "originalAnim": newGQAnimation("img/ufo.png", 9, 56, 56, $.gQ.ANIMATION_HORIZONTAL),
        "explodeAnim": newGQAnimation("img/explodeAndDisappear.png", 15, 56, explodeSpeed, $.gQ.ANIMATION_HORIZONTAL),
        "disappearAnim": newGQAnimation("img/ufoExplodeAndDisappear.png", 10, 56, disappearSpeed, $.gQ.ANIMATION_HORIZONTAL),
        "time": 0,
        "count": 0,
        "done": false,
        "height": 56,
        "width": 56,
        "animState": "original",
        "explodeSound": new sound("img/explodeSound.mp3")
    };

    createSpriteInGroup(ufoGroupName, ufos[length]["id"], ufos[length]["originalAnim"], ufos[length]["width"], ufos[length]["height"]);
    spriteSetX(ufos[length]["id"], ufos[length]["xpos"]);
    spriteSetY(ufos[length]["id"], ufos[length]["ypos"]);
};

var enExplodeSpeed = 250;
var addEnemyShip = function () {
    var length = enemyShips.length;
    enemyShips[length] = {
        "id": "enemyShip" + length,
        "xspeed": 0,
        "yspeed": 0,
        "xpos": 800,
        "ypos": 800,
        "time": currentDate(),
        "time1": currentDate(),
        "count": 0,
        "height": 120,
        "width": 100,
        "angle": 0,
        "xDist": 0,
        "yDist": 0,
        "hitTimes": 0,
        "done": false,
        "animState": "originalAnim",
        "enemyShipAnim": newGQAnimation("img/enSpaceShip.png"),
        "anim1": newGQAnimation("img/enShip1.png"),
        "anim2": newGQAnimation("img/enShip2.png"),
        "anim3": newGQAnimation("img/enShip3.png"),
        "anim4": newGQAnimation("img/enShip4.png"),
        "anim5": newGQAnimation("img/explodingEnemyShip.png", 9, 100, enExplodeSpeed, $.gQ.ANIMATION_HORIZONTAL),
        "explodeSound": new sound("img/explodeSound.mp3")
    };

    if (isMultiplayer) {
        enemyShips[length]["xpos"] = 300;
        enemyShips[length]["ypos"] = 300;
    }
    createSpriteInGroup(enemyGroupName, enemyShips[length]["id"], enemyShips[length]["enemyShipAnim"], enemyShips[length]["width"], enemyShips[length]["height"]);
    spriteSetX(enemyShips[length]["id"], enemyShips[length]["xpos"]);
    spriteSetY(enemyShips[length]["id"], enemyShips[length]["ypos"]);
};
var addEnemyMissile = function () {
    var length = enemyMissiles.length;
    enemyMissiles[length] = {
        "id": "enemyMissile" + length,
        "xspeed": 0,
        "yspeed": 0,
        "diagonalSpeed": 4,
        "xpos": 700,
        "ypos": 700,
        "collide": false,
        "count": 0,
        "time": 0,
        "height": 26,
        "width": 7,
        "animState": "green",
        "curveSpeed": false
    };
    var enemyMissileAnim;

    if (parseInt(Math.random() * 2) == 0) {
        enemyMissileAnim = newGQAnimation("img/redMissile.png");
        enemyMissiles[length]["animState"] = "red";
    } else {
        enemyMissileAnim = newGQAnimation("img/enemyMissile.png");
    }


    createSpriteInGroup(enemyMissilesGroupName, enemyMissiles[length]["id"], enemyMissileAnim, enemyMissiles[length]["width"], enemyMissiles[length]["height"]);
    spriteSetX(enemyMissiles[length]["id"], enemyMissiles[length]["xpos"]);
    spriteSetY(enemyMissiles[length]["id"], enemyMissiles[length]["ypos"]);
};

var startOrangeAnim = newGQAnimation("img/startOrange.png");
var startWhiteAnim = newGQAnimation("img/startWhite.png");
var controlsOrangeAnim = newGQAnimation("img/controlsOrange.png");
var controlsWhiteAnim = newGQAnimation("img/controlsWhite.png");
var backButtonAnim = newGQAnimation("img/wordBack.png");
var backButtonPressedAnim = newGQAnimation("img/wordBack1.png");
var backgroundAnim1 = newGQAnimation("img/gameOverBackground.png");
var backgroundAnim2 = newGQAnimation("img/gameOverBackground1.png");

var playAgainOrange = newGQAnimation("img/playAgain.png");
var playAgainWhite = newGQAnimation("img/playAgainWhite.png");


var setup = function () {
    var backgroundWidth = PLAYGROUND_WIDTH;
    var backgroundHeight = 1440;
    var backgroundAnim = newGQAnimation("img/backgroundLong.png");

    createGroupInPlayground(backgroundGroupName);
    createGroupInPlayground(asteroidGroupName);
    createGroupInPlayground(missileGroupName);
    createGroupInPlayground(enemyMissilesGroupName);
    createGroupInPlayground(enemyGroupName);
    createGroupInPlayground(ufoGroupName);
    createGroupInPlayground(textGroupName);
    createGroupInPlayground(splashScreenGroupName);
    createGroupInPlayground(playerGroupName);

    createSpriteInGroup(backgroundGroupName, smallBackgroundInfo["id"], newGQAnimation("img/backgroundSmall.png"), 800, 800);
    spriteSetX(smallBackgroundInfo["id"], smallBackgroundInfo["xpos"]);
    spriteSetY(smallBackgroundInfo["id"], smallBackgroundInfo["ypos"]);

    createSpriteInGroup(backgroundGroupName, backgroundInfo["id"], backgroundAnim, backgroundWidth, backgroundHeight);
    spriteSetY(backgroundInfo["id"], backgroundInfo["ypos"]);

    //Sprites in Player Group
    createSpriteInGroup(playerGroupName, spaceShipInfo["id"], spaceShipInfo["stillAnim"], spaceShipInfo["width"], spaceShipInfo["height"]);
    spriteSetX(spaceShipInfo["id"], spaceShipInfo["xpos"]);
    spriteSetY(spaceShipInfo["id"], spaceShipInfo["ypos"]);

    createTextSpriteInGroup(textGroupName, "lifeCounter", 150, 20, 270, 0);
    sprite("lifeCounter").css("color", "rgb(255, 255, 255)");
    sprite("lifeCounter").css("background-color", "rgba(0, 0, 0, 0)");

    createTextSpriteInGroup(textGroupName, "missilesShot", 140, 20, 500, 0);
    sprite("missilesShot").css("color", "rgb(255, 255, 255)");
    sprite("missilesShot").css("background-color", "rgba(0, 0, 0, 0)");

    createTextSpriteInGroup(textGroupName, "score", 200, 20, 10, 0);
    sprite("score").css("color", "rgb(255, 255, 255)");
    sprite("score").css("background-color", "rgba(0, 0, 0, 0)");


    createTextSpriteInGroup(textGroupName, "accuracy", 140, 20, 500, 20);
    sprite("accuracy").css("color", "rgb(255, 255, 255)");
    sprite("accuracy").css("background-color", "rgba(0, 0, 0, 0)");

    createTextSpriteInGroup(textGroupName, "level", 140, 45, 280, 445);
    sprite("level").css("color", "rgb(255, 255, 255)");
    sprite("level").css("background-color", "rgba(0, 0, 0, 0)");
    sprite("level").css("font-weight", "bold");
    sprite("level").css("font-size", "20pt");

    createSpriteInGroup(splashScreenGroupName, "start", startOrangeAnim, 295, 73);
    spriteSetX("start", 10);
    spriteSetY("start", 300);

    createSpriteInGroup(splashScreenGroupName, rocketInfo["id"], rocketInfo["rocketStillAnim"], rocketInfo["width"], rocketInfo["height"]);
    spriteSetX(rocketInfo["id"], rocketInfo["xpos"]);
    spriteSetY(rocketInfo["id"], rocketInfo["ypos"]);

    createSpriteInGroup(splashScreenGroupName, "controls", controlsOrangeAnim, 150, 29);
    spriteSetX("controls", 72);
    spriteSetY("controls", 375);

    createSpriteInGroup(splashScreenGroupName, "title", newGQAnimation("img/title.png"), 595, 100);
    spriteSetX("title", 22.5);
    spriteSetY("title", 22.5);

    createSpriteInGroup(splashScreenGroupName, "controlsPage", newGQAnimation("img/controlsPage.png"), 640, 480);
    spriteSetX("controlsPage", -640);
    spriteSetY("controlsPage", -480);

    createSpriteInGroup(splashScreenGroupName, "backButton", backButtonAnim, 60, 20);
    spriteSetX("backButton", -640);
    spriteSetY("backButton", -480);

    createSpriteInGroup(splashScreenGroupName, "gameOverScreen", backgroundAnim1, 640, 480);
    spriteSetX("gameOverScreen", -640);

    createSpriteInGroup(splashScreenGroupName, "playAgain", playAgainOrange, 190, 38);
    spriteSetX("playAgain", -1000);
    spriteSetY("playAgain", -1000);

    createSpriteInGroup(splashScreenGroupName, "win", newGQAnimation("img/win.png"), 456, 117);
    spriteSetX("win", -1000);
    spriteSetY("win", -1000);

    createTextSpriteInGroup(textGroupName, "winScreen", 800, 100, 75, 400);
    sprite("winScreen").css("color", "rgb(255, 255, 255)");
    sprite("winScreen").css("background-color", "rgba(0, 0, 0, 0)");
    sprite("winScreen").css("font-weight", "bold");
    sprite("winScreen").css("font-size", "20pt");


}; // end of setup() function. Notice the braces match!
// there should only ever be ONE setup() function!!!


var getTanI = function (num) {
    return Math.atan(num) * 180 / Math.PI;
};

var getTan = function (deg) {
    var rad = deg * Math.PI / 180;
    return Math.tan(rad);
};

var getCosI = function (num) {

    return Math.acos(num) * 180 / Math.PI;
};

var getCos = function (num) {
    var rad = num * Math.PI / 180;
    return Math.cos(rad);
};

var getSin = function (num) {
    var rad = num * Math.PI / 180;
    return Math.sin(rad);
};

var shipIsUpsideDown = function () {
    if (spaceShipInfo["angle"] < -90 || spaceShipInfo["angle"] > 90) {
        return true;
    }
};
var switchNums = function () {
    var hold = spaceShipInfo["xspeed"];
    spaceShipInfo["xspeed"] = spaceShipInfo["yspeed"];
    spaceShipInfo["yspeed"] = hold;
};

var calcSpaceShipMovement = function (button) {
    spaceShipInfo["xspeed"] = getCos(spaceShipInfo["angle"]) * spaceShipInfo["diagonalSpeed"];
    spaceShipInfo["yspeed"] = getSin(spaceShipInfo["angle"]) * spaceShipInfo["diagonalSpeed"];

    if (spaceShipInfo["angle"] < 0 && spaceShipInfo["angle"] > -90) {
        if (button == 'w') {
            spaceShipInfo["xspeed"] *= -1;
            switchNums();
        }
        if (button == 's') {
            spaceShipInfo["yspeed"] *= -1;
            switchNums();
        }
        if (button == 'a') {
            spaceShipInfo["xspeed"] *= -1;
            spaceShipInfo["yspeed"] *= -1;
        }

    } else if (spaceShipInfo["angle"] < -90 && spaceShipInfo["angle"] > -180) {
        if (button == 's') {
            spaceShipInfo["yspeed"] *= -1;
            switchNums();
        }
        if (button == 'w') {
            spaceShipInfo["xspeed"] *= -1;
            switchNums();
        }
        if (button == 'a') {
            spaceShipInfo["xspeed"] *= -1;
            spaceShipInfo["yspeed"] *= -1;
        }
    } else if (spaceShipInfo["angle"] > 0 && spaceShipInfo["angle"] < 90) {
        if (button == 's') {
            spaceShipInfo["yspeed"] *= -1;
            switchNums();
        }
        if (button == 'w') {
            spaceShipInfo["xspeed"] *= -1;
            switchNums();
        }
        if (button == 'a') {
            spaceShipInfo["xspeed"] *= -1;
            spaceShipInfo["yspeed"] *= -1;
        }
//        if (button == 'd'){
//            swicthNums();
//        }
    } else {
        if (button == 'w') {
            spaceShipInfo["xspeed"] *= -1;
        }
        if (button == 's') {
            spaceShipInfo["yspeed"] *= -1;
            switchNums();
        }
        if (button == 'a') {
            spaceShipInfo["xspeed"] *= -1;
            spaceShipInfo["yspeed"] *= -1;
        }
    }
};
var calcMissileSpeed = function (spriteInfo) {
    var desSpeed = 20;
    var increment;
    var tan = getTan(spriteInfo["angle"]);
    var aLength;
    var bLength;

    if (tan > getTan(89)) {
        aLength = 0;
        bLength = 2;
    } else {
        aLength = 2;
        bLength = tan * aLength;
    }
    increment = desSpeed / Math.sqrt((aLength * aLength) + (bLength * bLength));

    spriteInfo["shootTimes"] = 1;

    spriteInfo["xspeed"] = aLength * increment;
    spriteInfo["yspeed"] = bLength * increment;

};


var checkMoveIntuitively = function () {
    if (getKeyState(16)) {
        if (getKeyState(68)) {
            calcSpaceShipMovement('d');
        }
        if (getKeyState(65)) {
            calcSpaceShipMovement('a');
        }
        if (getKeyState(87)) {
            calcSpaceShipMovement('w');

        }
        if (getKeyState(83)) {
            calcSpaceShipMovement('s');

        }


    }
};

var getQuad = function (spriteInfo) {
    if (spriteInfo["xpos"] > 320 && spriteInfo["ypos"] < 240) {
        return 1;
    } else if (spriteInfo["xpos"] <= 320 && spriteInfo["ypos"] < 240) {
        return 2;
    } else if (spriteInfo["xpos"] <= 320 && spriteInfo["ypos"] > 240) {
        return 3;
    } else if (spriteInfo["xpos"] > 320 && spriteInfo["ypos"] > 240) {
        return 4;
    }
};

var moveSpriteBounce = function (spriteInfo) {
    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    if (spriteInfo["xpos"] < 0) {
        spriteInfo["xspeed"] *= -1;
    }
    if (spriteInfo["xpos"] > PLAYGROUND_WIDTH - spriteInfo["width"]) {
        spriteInfo["xspeed"] *= -1;
    }
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);

    spriteInfo["ypos"] = spriteInfo["ypos"] + spriteInfo["yspeed"];
    if (spriteInfo["ypos"] < 0) {
        spriteInfo["yspeed"] *= -1;
    }
    if (spriteInfo["ypos"] > PLAYGROUND_HEIGHT - spriteInfo["height"]) {
        spriteInfo["yspeed"] *= -1;
    }

    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
};
var moveSpriteWrap = function (spriteInfo) {
    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    if (spriteInfo["xpos"] < -1 * spriteInfo["width"]) {
        spriteInfo["xpos"] = PLAYGROUND_WIDTH;
    }
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);

    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    if (spriteInfo["xpos"] > PLAYGROUND_WIDTH) {
        spriteInfo["xpos"] = -1 * spriteInfo["width"];
    }
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);

    spriteInfo["ypos"] = spriteInfo["ypos"] + spriteInfo["yspeed"];
    if (spriteInfo["ypos"] > PLAYGROUND_HEIGHT) {
        spriteInfo["ypos"] = 0 - spriteInfo["height"];
    }
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);

    spriteInfo["ypos"] = spriteInfo["ypos"] + spriteInfo["yspeed"];
    if (spriteInfo["ypos"] < 0 - spriteInfo["height"]) {
        spriteInfo["ypos"] = PLAYGROUND_HEIGHT;
    }
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);



};

var counter1 = 0;
var speedDecrease = 1;
var moveMissile = function (spriteInfo, array) {
    var spriteIndex;
    var speedDecreaseMultiple = 0.6;

    if (spriteInfo != null) {

        if (spriteInfo["curveSpeed"] == true) {
            spriteInfo["xspeed"] = spriteInfo["xspeed"] * speedDecrease;
            spriteInfo["yspeed"] = spriteInfo["yspeed"] * speedDecrease;
            speedDecrease *= speedDecreaseMultiple;
            counter1++;
            if (counter1 > 15) {
                spriteInfo["xpos"] = -200;
                spriteInfo["ypos"] = -200;
                spriteInfo["curveSpeed"] = false;
                counter1 = 0;
            }
        }

        spriteInfo["xpos"] += spriteInfo["xspeed"];
        spriteInfo["ypos"] += spriteInfo["yspeed"];

        if (spriteInfo["xpos"] == -100 && spriteInfo["ypos"] == -100) {
            spriteInfo["shootTimes"] = 0;
        }

        spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
        spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);

        if (spriteInfo["xpos"] > PLAYGROUND_WIDTH + spriteInfo["width"] * Math.sqrt(2) ||
                spriteInfo["xpos"] < 0 - spriteInfo["width"] * Math.sqrt(2) ||
                spriteInfo["ypos"] > PLAYGROUND_HEIGHT + spriteInfo["height"] * Math.sqrt(2) ||
                spriteInfo["ypos"] < 0 - spriteInfo["width"] * Math.sqrt(2)) {

            removeSprite(spriteInfo["id"]);

            var spriteId = spriteInfo["id"];

            if (array == largeMissiles) {
                spriteIndex = spriteId.substring(7);
                array[spriteIndex] = null;
            } else if (array == smallMissiles) {
                spriteIndex = spriteId.substring(12);
                array[spriteIndex] = null;
            } else if (array == enemyMissiles) {
                spriteIndex = spriteId.substring(12);
                array[spriteIndex - 1] = null;
            }


        }

    }
};
var shootMissile = function (spriteInfo) {
    if (spriteInfo != null) {

        if (spriteInfo["shootTimes"] == 0) {
            if (!getKeyState(222)) {
                spriteInfo["angle"] = spaceShipInfo["angle"] + 90;
            }

            spriteRotate(spriteInfo["id"], spriteInfo["angle"]);
            spriteInfo["xpos"] = spaceShipInfo["xpos"] + ((spaceShipInfo["width"] / 2) - spriteInfo["width"] / 2);
            spriteInfo["ypos"] = spaceShipInfo["ypos"] + ((spaceShipInfo["height"] / 2) - spriteInfo["height"] / 2);
        }

        //move at angle
        calcMissileSpeed(spriteInfo);

        if (spriteInfo["angle"] <= 90 && spriteInfo["angle"] >= -90) {
            spriteInfo["xspeed"] *= -1;
            spriteInfo["yspeed"] *= -1;
        }
    }
};
//spaceship dictionary
var spaceShipInfo = {
    "id": "spaceShip",
    "xspeed": 0,
    "yspeed": 0,
    "speedIncrease": 0.5,
    "diagonalSpeed": 5,
    "xpos": 500,
    "ypos": 1000,
    "height": 154,
    "width": 86,
    "angle": 0,
    "angleSpeed": 0,
    "angleSpeedIncrease": 0.25,
    "movingAnim": newGQAnimation("img/spaceshipAnim.png", 3, 86, 100, $.gQ.ANIMATION_HORIZONTAL),
    "rightAnim": newGQAnimation("img/spaceshipRightAnim.png", 3, 86, 100, $.gQ.ANIMATION_HORIZONTAL),
    "leftAnim": newGQAnimation("img/spaceshipLeftAnim.png", 3, 86, 100, $.gQ.ANIMATION_HORIZONTAL),
    "stillAnim": newGQAnimation("img/spaceShip.png"),
    "brokenAnim": newGQAnimation("img/brokenSpaceship.png"),
    "animState": "still",
    "hitTimes": 0,
    "lives": 20,
    "scale": 1
};
var rocketInfo = {
    "id": "rocket",
    "xspeed": 0,
    "yspeed": 0,
    "xpos": 430,
    "ypos": 260,
    "height": 350,
    "width": 200,
    "rocketStillAnim": newGQAnimation("img/launchSpaceShip.png"),
    "takeOffAnim": newGQAnimation("img/takeoffRocket.png", 4, 200, 300, $.gQ.ANIMATION_HORIZONTAL),
    "flyingAnim": newGQAnimation("img/rocketInAir.png", 2, 200, 100, $.gQ.ANIMATION_HORIZONTAL),
    "start": false,
    "time": 0,
    "count": 0

};
var backgroundInfo = {
    "id": "background",
    "xpos": 0,
    "ypos": -960

};
var smallBackgroundInfo = {
    "id": "smallBackground",
    "xpos": -80,
    "ypos": -160,
    "scale": 1 / 1.1
};

var moveSpaceShip = function () {
    var decayRate = 0.9;
    var passLeft = false;
    var passRight = false;


    sprite("lifeCounter").html("<w>Life Remaining: </w>" + spaceShipInfo["lives"]);

    spaceShipInfo["xpos"] += spaceShipInfo["xspeed"];
    spaceShipInfo["ypos"] += spaceShipInfo["yspeed"];
    spaceShipInfo["angle"] += spaceShipInfo["angleSpeed"];

    checkMoveIntuitively();

    if (spaceShipInfo["xpos"] < 0) {
        spaceShipInfo["xpos"] = 0.000001;
        spaceShipInfo["xspeed"] *= 0.2;
        if (smallBackgroundInfo["xpos"] > -5) {
            smallBackgroundInfo["xpos"] = -5;
        }
        smallBackgroundInfo["xpos"] += 2;

    }
    if (spaceShipInfo["ypos"] < 0) {
        spaceShipInfo["ypos"] = 0.0000001;
        spaceShipInfo["yspeed"] *= 0.2;

        if (smallBackgroundInfo["ypos"] > -35) {
            smallBackgroundInfo["ypos"] = -35;
        }

        smallBackgroundInfo["ypos"] += 2;

    }
    if (spaceShipInfo["xpos"] > PLAYGROUND_WIDTH - spaceShipInfo["width"]) {
        spaceShipInfo["xpos"] = PLAYGROUND_WIDTH - spaceShipInfo["width"] - 0.0000001;
        spaceShipInfo["xspeed"] *= 0.2;

        if (smallBackgroundInfo["xpos"] < 645 - 800) {
            smallBackgroundInfo["xpos"] = 645 - 800;
        }

        smallBackgroundInfo["xpos"] -= 2;
    }

    if (spaceShipInfo["ypos"] > PLAYGROUND_HEIGHT - spaceShipInfo["height"]) {
        spaceShipInfo["ypos"] = PLAYGROUND_HEIGHT - spaceShipInfo["height"] - 0.000001;
        spaceShipInfo["yspeed"] *= 0.2;

        if (smallBackgroundInfo["ypos"] < 515 - 800) {
            smallBackgroundInfo["ypos"] = 515 - 800;
        }

        smallBackgroundInfo["ypos"] -= 2;

    }

    spriteSetX(smallBackgroundInfo["id"], smallBackgroundInfo["xpos"]);
    spriteSetY(smallBackgroundInfo["id"], smallBackgroundInfo["ypos"]);


    if (spaceShipInfo["angle"] > 180 && passLeft == false) {
        spaceShipInfo["angle"] = -180;
        passLeft = true;
    }
    if (spaceShipInfo["angle"] < -180 && passRight == false) {
        spaceShipInfo["angle"] = 180;
        passRight = true;
    }

    if (getKeyState(68) || getKeyState(65) || getKeyState(87) || getKeyState(83)) {
        if (spaceShipInfo["animState"] == "still") {
            spriteSetAnimation(spaceShipInfo["id"], spaceShipInfo["movingAnim"]);
            spaceShipInfo["animState"] = "moving";
        }
    }


    if (getKeyState(68)) {
        spaceShipInfo["xspeed"] += spaceShipInfo["speedIncrease"];
    }
    if (getKeyState(87)) {
        spaceShipInfo["yspeed"] -= spaceShipInfo["speedIncrease"];
    }
    if (getKeyState(65)) {
        spaceShipInfo["xspeed"] -= spaceShipInfo["speedIncrease"];
    }
    if (getKeyState(83)) {
        spaceShipInfo["yspeed"] += spaceShipInfo["speedIncrease"];
    }
    if (getKeyState(39)) {
        spaceShipInfo["angleSpeed"] += spaceShipInfo["angleSpeedIncrease"];
        if (spaceShipInfo["animState"] == "still" || spaceShipInfo["animState"] == "right") {
            spriteSetAnimation(spaceShipInfo["id"], spaceShipInfo["leftAnim"]);
            spaceShipInfo["animState"] = "left";
        }
    }

    if (getKeyState(37)) {
        spaceShipInfo["angleSpeed"] -= spaceShipInfo["angleSpeedIncrease"];

        if (spaceShipInfo["animState"] == "still" || spaceShipInfo["animState"] == "left") {
            spriteSetAnimation(spaceShipInfo["id"], spaceShipInfo["rightAnim"]);
            spaceShipInfo["animState"] = "right";
        }
    }
    if (!getKeyState(39) && !getKeyState(37)) {
        spaceShipInfo["angleSpeed"] *= decayRate;
    }

    if (!getKeyState(68) && !getKeyState(65) && !getKeyState(87) && !getKeyState(83) && !getKeyState(39) && !getKeyState(37)) {
        spriteSetAnimation(spaceShipInfo["id"], spaceShipInfo["stillAnim"]);
        spaceShipInfo["animState"] = "still";
        spaceShipInfo["xspeed"] *= decayRate;
        spaceShipInfo["yspeed"] *= decayRate;
    }

    spriteSetX(spaceShipInfo["id"], spaceShipInfo["xpos"]);
    spriteSetY(spaceShipInfo["id"], spaceShipInfo["ypos"]);
    spriteRotate(spaceShipInfo["id"], spaceShipInfo["angle"]);

};
var spaceShipCollidesWithUfo = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);

    var hitSpriteIndex = hitSpriteName.substring(3);

    var hitSpriteInfo = ufos[hitSpriteIndex];

    spaceShipInfo["xspeed"] *= -0.1;
    spaceShipInfo["yspeed"] *= -0.1;

    hitSpriteInfo["done"] = true;

    hitSpriteInfo["xpos"] = -200;
    hitSpriteInfo["ypos"] = -200;

    hitSpriteInfo["xspeed"] = 0;
    hitSpriteInfo["yspeed"] = 0;

    spaceShipInfo["lives"]--;

//    explosionInfo["xpos"] = spaceShipInfo["xpos"] + spaceShipInfo["width"] / 2;
//    explosionInfo["ypos"] = spaceShipInfo["ypos"] + spaceShipInfo["height"] / 2;


};
var spaceShipCollidesWithEnemy = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);

    var hitSpriteIndex = hitSpriteName.substring(12);

    var hitSpriteInfo = enemyMissiles[hitSpriteIndex];

    hitSpriteInfo["xpos"] = -550;
    hitSpriteInfo["ypos"] = -550;

    spaceShipInfo["xspeed"] *= -0.1;
    spaceShipInfo["yspeed"] *= -0.1;

    spaceShipInfo["lives"]--;
};

var spaceShipCollidesWithAsteroid = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);

    var hitSpriteIndex = hitSpriteName.substring(8);

    var hitSpriteInfo = asteroids[hitSpriteIndex];

    spaceShipInfo["xspeed"] *= -0.1;
    spaceShipInfo["yspeed"] *= -0.1;

    hitSpriteInfo["xpos"] = -300;
    hitSpriteInfo["ypos"] = -300;

    spaceShipInfo["lives"]--;
};
var spaceShipCollidesWithEnemyShip = function () {
    spaceShipInfo["xspeed"] *= -1;
    spaceShipInfo["yspeed"] *= -1;

    spaceShipInfo["lives"]--;
};

var checkCollide = function () {
    forEachSpriteGroupCollisionDo(spaceShipInfo["id"], ufoGroupName, spaceShipCollidesWithUfo);
    forEachSpriteGroupCollisionDo(spaceShipInfo["id"], enemyMissilesGroupName, spaceShipCollidesWithEnemy);
    forEachSpriteGroupCollisionDo(spaceShipInfo["id"], asteroidGroupName, spaceShipCollidesWithAsteroid);
    forEachSpriteGroupCollisionDo(spaceShipInfo["id"], enemyGroupName, spaceShipCollidesWithEnemyShip);
};

var calcAsteroidAngle = function (spriteInfo) {
    var xDist;
    var yDist;

    var angle = 0;

    xDist = spaceShipInfo["xpos"] - spriteInfo["xpos"];
    yDist = spaceShipInfo["ypos"] - spriteInfo["ypos"];
    //var diagonal = Math.sqrt((spriteInfo["xspeed"] * spriteInfo["xspeed"]) + (spriteInfo["yspeed"] * spriteInfo["yspeed"]));
    angle = getTanI((spriteInfo["xspeed"] / spriteInfo["yspeed"]) + 90);
    if (getQuad(spriteInfo) == 1) {
        angle = getTanI((spriteInfo["xspeed"] / spriteInfo["yspeed"]) + 180);
    }


    spriteRotate(spriteInfo["id"], angle);

};

var randomBeginSpot = function (spriteInfo, begin) {
    var holdRandomX;
    var holdRandomY;
    if (begin == 1) {
        spriteInfo["ypos"] = parseInt(Math.random() * 480);
        holdRandomX = parseInt(Math.random() * PLAYGROUND_WIDTH);
        if (holdRandomX > PLAYGROUND_WIDTH / 2) {
            spriteInfo["xpos"] = 0 - spriteInfo["width"];
        } else {
            spriteInfo["xpos"] = PLAYGROUND_WIDTH + 1;
        }
    } else if (begin == 0) {
        spriteInfo["xpos"] = parseInt(Math.random() * 640);
        holdRandomY = parseInt(Math.random() * PLAYGROUND_HEIGHT);
        if (holdRandomY > PLAYGROUND_HEIGHT / 2) {
            spriteInfo["ypos"] = 0 - spriteInfo["height"];
        } else {
            spriteInfo["ypos"] = PLAYGROUND_HEIGHT;
        }
    }

};
var time = currentDate();
var moveUfo = function (spriteInfo) {
    var sendInSpeed = 2000;
    var xDist;
    var yDist;
    var diagonal;
    var increment;

    if (spriteInfo["count"] == 0 || spriteInfo["xpos"] == -200) {
        spriteInfo["count"] = 1;

        randomBeginSpot(spriteInfo, parseInt(Math.random() * 2));

        //spriteInfo["time"] = currentDate();
    }

    if (currentDate() > spriteInfo["time"] + sendInSpeed) {

        xDist = spaceShipInfo["xpos"] - spriteInfo["xpos"];
        yDist = spaceShipInfo["ypos"] - spriteInfo["ypos"];
        diagonal = Math.sqrt(((xDist * xDist) + (yDist * yDist)));

        increment = diagonal / spriteInfo["diagonalSpeed"];

        if (spriteInfo["count"] == 1) {
            spriteInfo["xspeed"] = xDist / increment;
            spriteInfo["yspeed"] = yDist / increment;
        }
    }
    if (!spriteInfo["done"]) {
        spriteInfo["xpos"] += spriteInfo["xspeed"];
        spriteInfo["ypos"] += spriteInfo["yspeed"];
    }


    if (spriteInfo["time"] + 1300 < currentDate() && spriteInfo["animState"] == "explodeAnim") {
        spriteInfo["xpos"] = -200;
        spriteInfo["ypos"] = -200;
    }

    var spriteIndex = spriteInfo["id"].substring(4);

    if (spriteInfo["xpos"] == -200 && ufos[spriteIndex] != null) {
        levelUp--;
        removeSprite(ufos[spriteIndex]["id"]);
        ufos[spriteIndex] = null;
    }


    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);




};

var moveAsteroid = function (spriteInfo) {
    var xDist;
    var yDist;
    var diagonal;
    var increment;
    if (spriteInfo["xpos"] > 0 && spriteInfo["ypos"] > 0 && spriteInfo["xpos"] < PLAYGROUND_WIDTH - spriteInfo["width"] && spriteInfo["ypos"] < PLAYGROUND_HEIGHT - spriteInfo["height"]) {
        spriteInfo["onPlayground"] = true;
    } else {
        spriteInfo["onPlayground"] = false;
    }
    if (spriteInfo["count"] == 0 || spriteInfo["xpos"] == -200) {
        spriteInfo["count"] = 1;
        randomBeginSpot(spriteInfo, parseInt(Math.random() * 2));
        xDist = ((spaceShipInfo["xpos"] + (Math.random() * 5) - 10) - spriteInfo["xpos"]);
        yDist = ((spaceShipInfo["ypos"] + (Math.random() * 5) - 10) - spriteInfo["ypos"]);
        diagonal = Math.sqrt(((xDist * xDist) + (yDist * yDist)));
        increment = diagonal / spriteInfo["diagonalSpeed"];
        if (spriteInfo["done"] == false) {
            spriteInfo["xspeed"] = xDist / increment;
            spriteInfo["yspeed"] = yDist / increment;
        }

        if (getQuad(spriteInfo) == 1 || getQuad(spriteInfo) == 4) {
            spriteInfo["angle"] = getCosI(yDist / diagonal);
        } else {
            spriteInfo["angle"] = -1 * getCosI(yDist / diagonal);
        }

        spriteRotate(spriteInfo["id"], spriteInfo["angle"]);
        spriteInfo["time"] = currentDate();
    }
    var spriteIndex = spriteInfo["id"].substring(9);
    if (spriteInfo["xpos"] == -500 && asteroids[spriteIndex] != null) {
        removeSprite(asteroids[spriteIndex]["id"]);
        asteroids[spriteIndex] = null;
    }

    spriteInfo["xpos"] += spriteInfo["xspeed"];
    spriteInfo["ypos"] += spriteInfo["yspeed"];
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
};
var shootEnemyMissile = function (spriteInfo, enemyShipInfo) {
    var increment;
    var diagonal = Math.sqrt(((enemyShipInfo["xDist"] * enemyShipInfo["xDist"]) + (enemyShipInfo["yDist"] * enemyShipInfo["yDist"])));
    increment = diagonal / spriteInfo["diagonalSpeed"];
    spriteInfo["angle"] = enemyShipInfo["angle"];
    spriteRotate(spriteInfo["id"], spriteInfo["angle"]);
    spriteInfo["xpos"] = enemyShipInfo["xpos"] + 46;
    spriteInfo["ypos"] = enemyShipInfo["ypos"] + 47;
    spriteInfo["xspeed"] = enemyShipInfo["xDist"] / increment;
    spriteInfo["yspeed"] = enemyShipInfo["yDist"] / increment;
};
var largeMissileShot = 0;
var smallMissileShot = 0;
var ufoStart = 0;
var asteroidStart = 0;
var enemyShipStart = 0;
var date = currentDate();
var date1 = currentDate();
var date2 = currentDate();
var hitOnce = 0;
var addItemByKey = function () {

    if (getKeyState(222) && hitOnce == 0 //&& date2 + 25000 < currentDate()
            ) {
        for (var i = -180; i < 180; i += 2) {
            addSmallMissile();
            smallMissiles[smallMissiles.length - 1]["angle"] = i;
        }
        hitOnce = 1;
        date2 = currentDate();
    }
    if (!getKeyState(222)) {
        hitOnce = 0;
    }

    if (getKeyState(81) && largeMissileShot == 0 && date + 200 < currentDate()) {
        addLargeMissile();
        largeMissileShot = 1;
        date = currentDate();
    }
    if (!getKeyState(81)) {
        largeMissileShot = 0;
    }

    if (getKeyState(69) && smallMissileShot == 0 && date1 + 200 < currentDate()) {
        addSmallMissile();
        smallMissileShot = 1;
        date1 = currentDate();
    }
    if (!getKeyState(69)) {
        smallMissileShot = 0;
    }
};
var enShipTime = currentDate();
var moveEnemyShip = function (spriteInfo) {
    var diagonal;
    var desSpeed = 1;
    var increment;
    if (isMultiplayer == false) {



        if (spriteInfo["count"] == 0 || spriteInfo["xpos"] == -400) {
            spriteInfo["count"] = 1;
            randomBeginSpot(spriteInfo, parseInt(Math.random() * 2));
            spriteInfo["time"] = currentDate();
        }
        spriteInfo["xDist"] = spaceShipInfo["xpos"] - spriteInfo["xpos"];
        spriteInfo["yDist"] = spaceShipInfo["ypos"] - spriteInfo["ypos"];
        diagonal = Math.sqrt(((spriteInfo["xDist"] * spriteInfo["xDist"]) + (spriteInfo["yDist"] * spriteInfo["yDist"])));
        increment = diagonal / desSpeed;
        if (!spriteInfo["done"] && spriteInfo["animState"] != 5) {
            spriteInfo["xspeed"] = spriteInfo["xDist"] / increment;
            spriteInfo["yspeed"] = spriteInfo["yDist"] / increment;
        }

        if (spriteInfo["animState"] != 5) {
            if (spriteInfo["xDist"] > 0) {
                spriteInfo["angle"] = -1 * getCosI(spriteInfo["yDist"] / diagonal);
            } else {
                spriteInfo["angle"] = getCosI(spriteInfo["yDist"] / diagonal);
            }
        }


        if (spriteInfo["xpos"] > 0 && spriteInfo["ypos"] > 0 && spriteInfo["xpos"] < PLAYGROUND_WIDTH - spriteInfo["width"] && spriteInfo["ypos"] < PLAYGROUND_HEIGHT - spriteInfo["height"]) {
            if (diagonal < 300) {
                spriteInfo["xspeed"] = 0;
                spriteInfo["yspeed"] = 0;
                if (spriteInfo["time"] + 5000 < currentDate()) {
                    addEnemyMissile();
                    shootEnemyMissile(enemyMissiles[enemyMissiles.length - 1], spriteInfo);
                    spriteInfo["time"] = currentDate();
                }
            }
        }

        spriteRotate(spriteInfo["id"], spriteInfo["angle"]);
        spriteInfo["xpos"] += spriteInfo["xspeed"];
        spriteInfo["ypos"] += spriteInfo["yspeed"];
        if (spriteInfo["time1"] + (enExplodeSpeed * 8) - 50 < currentDate() && spriteInfo["hitTimes"] >= 5) {
            spriteInfo["xpos"] = -500;
            spriteInfo["ypos"] = -500;
        }

        var spriteIndex = spriteInfo["id"].substring(9);
        if (spriteInfo["xpos"] == -200 && enemyShips[spriteIndex] != null) {
            removeSprite(enemyShips[spriteIndex]);
            enemyShips[spriteIndex] = null;
        }
    } else {


        if (getKeyState(74)) {
            enemyShips[0]["xspeed"] = -3;
            enemyShips[0]["xpos"] += enemyShips[0]["xspeed"];
            enemyShips[0]["ypos"] += enemyShips[0]["yspeed"];
        }
        if (getKeyState(76)) {
            enemyShips[0]["xspeed"] = 3;
            enemyShips[0]["xpos"] += enemyShips[0]["xspeed"];
            enemyShips[0]["ypos"] += enemyShips[0]["yspeed"];
        }
        if (getKeyState(75)) {
            enemyShips[0]["yspeed"] = 3;
            enemyShips[0]["xpos"] += enemyShips[0]["xspeed"];
            enemyShips[0]["ypos"] += enemyShips[0]["yspeed"];
        }
        if (getKeyState(73)) {
            enemyShips[0]["yspeed"] = -3;
            enemyShips[0]["xpos"] += enemyShips[0]["xspeed"];
            enemyShips[0]["ypos"] += enemyShips[0]["yspeed"];
        }
    }

    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
};
var counter2 = 0;
var speedDecrease1 = 1;
var moveEnemyMissile = function (spriteInfo) {
    var speedDecreaseMultiple = 0.9;
    if (spriteInfo["curveSpeed"] == true) {
        spriteInfo["xspeed"] = spriteInfo["xspeed"] * speedDecrease1;
        spriteInfo["yspeed"] = spriteInfo["yspeed"] * speedDecrease1;
        speedDecrease1 *= speedDecreaseMultiple;
        counter2++;
        if (counter2 > 15) {
            spriteInfo["xpos"] = -200;
            spriteInfo["ypos"] = -200;
            counter2 = 0;
        }
    }
    var spriteIndex = spriteInfo["id"].substring(12);
    if (spriteInfo["xpos"] == -550 && enemyMissiles[spriteIndex] != null) {
        removeSprite(enemyMissiles[spriteIndex]);
        enemyMissiles[spriteIndex] = null;
    }

    spriteInfo["xpos"] += spriteInfo["xspeed"];
    spriteInfo["ypos"] += spriteInfo["yspeed"];
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
};
var asteroidTime = currentDate();
var ufoTime = currentDate();
var enemyShipTime = currentDate();
var sequenceTime = currentDate();
var begin = false;
var newTime = 3000;
var time3;
var runOnce = 0;
var asteroidNum = 1;
var ufoNum = 1;
var enemyShipNum = 0;
var asteroidSpeed = 12000;
var ufoSpeed = 15000;
var enemyShipSpeed = 22500;
var timeCount = 0;
var on = false;
var premiereTemp = true;
var doOnce = 0;
var sequenceTime1 = currentDate();

var enemyShipIncrease = 0.1;
var asteroidIncrease = 0.3;
var ufoIncrease = 0.2;
var sequenceEnemy = function () {
    timeCount++;
//    spriteSetX(smallBackgroundInfo["id"], -80);
//    spriteSetY(smallBackgroundInfo["id"], -160);
    if (asteroidTime + asteroidSpeed < currentDate() && begin == true) {

        asteroidTime = currentDate();
    }
    if (ufoTime + ufoSpeed < currentDate() && begin == true) {


        ufoTime = currentDate();
    }
    if (enemyShipTime + enemyShipSpeed < currentDate() && begin == true) {

        enemyShipTime = currentDate();
    }
//    if (getKeyState(32) && level < 10) {
//        on = true;
//    }
//    if (!getKeyState(32) && on) {
//        on = false;
//        newTime = 100;
//    }
    if (levelUp == 0 && doOnce == 0) {
        sequenceTime = currentDate();
        doOnce = 1;
    }

    if ((levelUp <= 0 && level < 10 && sequenceTime + 2500 < currentDate() && begin == true) || sequenceTime1 + 12000 < currentDate()) {
        if (level < 10) {
            level++;
        }
        if (level < 10) {
            doOnce = 0;

            newTime = 20000;
            smallBackgroundInfo["scale"] *= 1.1;
            sprite(smallBackgroundInfo["id"]).scale(smallBackgroundInfo["scale"]);
            for (var i = 0; i < asteroidNum; i++) {
                addAsteroid();
                asteroidTime += 5000;
            }
            for (var i = 0; i < enemyShipNum; i++) {
                addEnemyShip();
                levelUp++;
                enemyShipTime -= 2000;
            }
            for (var i = 0; i < ufoNum; i++) {
                addUfo();
                levelUp++;
            }
            if (level >= 4) {
                enemyShipNum += enemyShipIncrease;
            }
            if (premiereTemp) {
                ufoNum = 1;
                premiereTemp = false;
            } else {
                ufoNum += ufoIncrease;
            }
            asteroidSpeed *= 0.95;
            ufoSpeed *= 0.95;
            enemyShipSpeed *= 0.95;
            asteroidNum += asteroidIncrease;

            sequenceTime = currentDate();
            sequenceTime1 = currentDate();
        }

    }
    if (level == 10) {
        if (runOnce == 0) {
            time3 = currentDate();
            runOnce = 1;
        }
        winScreen();
        spaceShipInfo["scale"] *= 0.95;
        sprite(spaceShipInfo["id"]).scale(spaceShipInfo["scale"]);
        if (getKeyState(13)) {
            level = 0;
            sprite(spaceShipInfo["id"]).scale(1);
            spriteSetX("win", -1000);
            spriteSetY("win", -1000);
            sprite("winScreen").html("<w> </w>");
        }

    }
};
var multiplayerGame = function () {

    spaceShipInfo["xpos"] = 100;
    spaceShipInfo["ypos"] = 100;
};
var timeRunning;
var timerCount = 0;
var startSplashScreen = true;
var accuracy = " ";
var counter = 0;
var draw = function () {
    if (isMultiplayer && counter == 0) {
        addEnemyShip();
        counter = 1;
    }
    if (gameStart && timerCount == 0) {
        timeRunning = currentDate();
        timerCount = 1;
    }

    var anId1 = 0;
    var asteroidId = 0;
    var asteroidId1 = 0;
    var enemyShipId = 0;
    var enemyShipId1 = 0;
    var anId = 0;
    var ufoIsShot1 = function (collIndex, hitSprite) {
        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(3);
        var hitSpriteInfo = ufos[hitSpriteIndex];
        if (!hitSpriteInfo["done"]) {
            levelUp--;
            largeMissiles[anId]["curveSpeed"] = true;
            largeMissiles[anId]["time"] = currentDate();
            missilesHit++;
            score += 300;
//        largeMissiles[anId]["xpos"] = -200;
//        largeMissiles[anId]["ypos"] = -200;

            hitSpriteInfo["explodeSound"].play();
            hitSpriteInfo["time"] = currentDate();
            spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["explodeAnim"]);
            hitSpriteInfo["animState"] = "explodeAnim";
            hitSpriteInfo["xspeed"] = 0;
            hitSpriteInfo["yspeed"] = 0;
            hitSpriteInfo["done"] = true;
        }
    };
    var ufoIsShot2 = function (collIndex, hitSprite) {
        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(3);
        var hitSpriteInfo = ufos[hitSpriteIndex];
        if (!hitSpriteInfo["done"]) {
            smallMissiles[anId1]["curveSpeed"] = true;
            smallMissiles[anId1]["time"] = currentDate();
            missilesHit++;
            score += 300;
            hitSpriteInfo["xspeed"] = 0;
            hitSpriteInfo["yspeed"] = 0;
            hitSpriteInfo["explodeSound"].play();
            hitSpriteInfo["time"] = currentDate();
            spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["explodeAnim"]);
            hitSpriteInfo["animState"] = "explodeAnim";
            hitSpriteInfo["done"] = true;
        }
    };
    var enemyShipIsShot1 = function (collIndex, hitSprite) {



        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(9);
        var hitSpriteInfo = enemyShips[hitSpriteIndex];
        if (hitSpriteInfo["hitTimes"] < 6) {

            largeMissiles[enemyShipId]["xpos"] = -200;
            largeMissiles[enemyShipId]["ypos"] = -200;
            missilesHit++;
            if (!hitSpriteInfo["done"]) {

                if (hitSpriteInfo["hitTimes"] < 5) {

                    hitSpriteInfo["hitTimes"] = hitSpriteInfo["hitTimes"] + 1;
                    score += 200;
                    hitSpriteInfo["animState"] = hitSpriteInfo["hitTimes"];
                    if (hitSpriteInfo["animState"] != "anim5") {
                        spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["anim" + hitSpriteInfo["hitTimes"]]);
                        hitSpriteInfo["time1"] = currentDate();
                    }
                } else {
                    hitSpriteInfo["hitTimes"] = 5;
                }
                if (hitSpriteInfo["hitTimes"] == 5) {
                    spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["anim5"]);
                    hitSpriteInfo["animState"] = hitSpriteInfo["hitTimes"];
                    hitSpriteInfo["explodeSound"].play();
                }
            }


            if (hitSpriteInfo["hitTimes"] == 5) {
                hitSpriteInfo["xpseed"] = 0;
                hitSpriteInfo["ypseed"] = 0;
                hitSpriteInfo["done"] == true;
                hitSpriteInfo["time1"] = currentDate();
                enemyShipTime = currentDate();
                hitSpriteInfo["hitTimes"] = 6;
                levelUp--;
            }
        }

    };
    var enemyShipIsShot2 = function (collIndex, hitSprite) {
        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(9);
        var hitSpriteInfo = enemyShips[hitSpriteIndex];
        if (hitSpriteInfo["hitTimes"] < 6) {

            smallMissiles[enemyShipId1]["xpos"] = -200;
            smallMissiles[enemyShipId1]["ypos"] = -200;
            missilesHit++;
            if (!hitSpriteInfo["done"]) {

                if (hitSpriteInfo["hitTimes"] < 5) {

                    hitSpriteInfo["hitTimes"] = hitSpriteInfo["hitTimes"] + 1;
                    score += 200;
                    hitSpriteInfo["animState"] = hitSpriteInfo["hitTimes"];
                    if (hitSpriteInfo["animState"] != "anim5") {
                        spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["anim" + hitSpriteInfo["hitTimes"]]);
                        hitSpriteInfo["time1"] = currentDate();
                    }
                } else {
                    hitSpriteInfo["hitTimes"] = 5;
                }
                if (hitSpriteInfo["hitTimes"] == 5) {
                    spriteSetAnimation(hitSpriteInfo["id"], hitSpriteInfo["anim5"]);
                    hitSpriteInfo["animState"] = hitSpriteInfo["hitTimes"];
                    hitSpriteInfo["explodeSound"].play();
                    levelUp--;
                }
            }


            if (hitSpriteInfo["hitTimes"] == 5) {
                hitSpriteInfo["xpseed"] = 0;
                hitSpriteInfo["ypseed"] = 0;
                hitSpriteInfo["done"] == true;
                hitSpriteInfo["time1"] = currentDate();
                enemyShipTime = currentDate();
                hitSpriteInfo["hitTimes"] = 6;
            }
        }


    };
    var asteroidIsShot = function (collIndex, hitSprite) {
        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(8);
        var hitSpriteInfo = asteroids[hitSpriteIndex];
        //largeMissiles[asteroidId]["curveSpeed"] = true;
        //largeMissiles[asteroidId]["time"] = currentDate();

        hitSpriteInfo["explodeSound"].play();
        missilesHit++;
        score += 100;
        hitSpriteInfo["xpos"] = -500;
        hitSpriteInfo["ypos"] = -500;
        hitSpriteInfo["xpseed"] = 0;
        hitSpriteInfo["ypseed"] = 0;
        hitSpriteInfo["done"] == true;
        hitSpriteInfo["time"] = currentDate();
    };
    var asteroidIsShot1 = function (collIndex, hitSprite) {
        var hitSpriteName = spriteId(hitSprite);
        var hitSpriteIndex = hitSpriteName.substring(8);
        var hitSpriteInfo = asteroids[hitSpriteIndex];
//        smallMissiles[asteroidId1]["curveSpeed"] = true;
//        smallMissiles[asteroidId1]["time"] = currentDate();

        hitSpriteInfo["explodeSound"].play();
        missilesHit++;
        score += 100;
        hitSpriteInfo["xpos"] = -500;
        hitSpriteInfo["ypos"] = -500;
        hitSpriteInfo["xpseed"] = 0;
        hitSpriteInfo["ypseed"] = 0;
        hitSpriteInfo["done"] == true;
        hitSpriteInfo["time"] = currentDate();
    };
    if (gameStart == true) {
        accuracy = Math.round((missilesHit / missilesShot) * 100);
        if (accuracy >= 0 && accuracy <= 100) {
            sprite("accuracy").html("<w>Accuracy: </w>" + accuracy + "%");
        }
        sprite("missilesShot").html("<w>Missiles Shot: </w>" + missilesShot);
        sprite("level").html("<w>Level: </w>" + level);
        sprite("score").html("<w>Score: </w>" + score);
        addItemByKey();
        moveSpaceShip();
        var ufoIdx = 0;
        var largeMissileIdx = 0;
        while (largeMissileIdx < largeMissiles.length) {

            if (largeMissiles[largeMissileIdx] != null) {
                shootMissile(largeMissiles[largeMissileIdx]);
            }
            if (largeMissiles[largeMissileIdx] != null) {
                moveMissile(largeMissiles[largeMissileIdx], largeMissiles);
            }

            largeMissileIdx++;
        }

        for (var smallMissileIdx = 0; smallMissileIdx < smallMissiles.length; smallMissileIdx++) {
            if (smallMissiles[smallMissileIdx] != null) {
                shootMissile(smallMissiles[smallMissileIdx]);
            }
            if (smallMissiles[smallMissileIdx] != null) {
                moveMissile(smallMissiles[smallMissileIdx], smallMissiles);
            }

        }

        while (ufoIdx < ufos.length) {
            if (ufos[ufoIdx] != null) {
                moveUfo(ufos[ufoIdx]);
            }
            ufoIdx += 1;
        }

        for (var astIdx = 0; astIdx < asteroids.length; astIdx++) {
            if (asteroids[astIdx] != null) {
                moveAsteroid(asteroids[astIdx]);
            }

        }

        for (var enShipIdx = 0; enShipIdx < enemyShips.length; enShipIdx++) {
            if (enemyShips[enShipIdx] != null) {
                moveEnemyShip(enemyShips[enShipIdx]);
            }

        }
        for (var enMissIdx = 0; enMissIdx < enemyMissiles.length; enMissIdx++) {
            if (enemyMissiles[enMissIdx] != null) {
                moveEnemyMissile(enemyMissiles[enMissIdx]);
            }
        }

        while (anId < largeMissiles.length) {
            if (largeMissiles[anId] != null) {
                forEachSpriteGroupCollisionDo(largeMissiles[anId]["id"], ufoGroupName, ufoIsShot1);
            }
            anId++;
        }
        while (anId1 < smallMissiles.length) {
            if (smallMissiles[anId1] != null) {
                forEachSpriteGroupCollisionDo(smallMissiles[anId1]["id"], ufoGroupName, ufoIsShot2);
            }
            anId1++;
        }

        while (enemyShipId < largeMissiles.length) {
            if (largeMissiles[enemyShipId] != null) {
                forEachSpriteGroupCollisionDo(largeMissiles[enemyShipId]["id"], enemyGroupName, enemyShipIsShot1);
            }
            enemyShipId++;
        }

        while (enemyShipId1 < smallMissiles.length) {
            if (smallMissiles[enemyShipId1] != null) {
                forEachSpriteGroupCollisionDo(smallMissiles[enemyShipId1]["id"], enemyGroupName, enemyShipIsShot2);
            }
            enemyShipId1++;
        }

        while (asteroidId < largeMissiles.length) {
            if (largeMissiles[asteroidId] != null) {
                forEachSpriteGroupCollisionDo(largeMissiles[asteroidId]["id"], asteroidGroupName, asteroidIsShot);
            }
            asteroidId++;
        }
        while (asteroidId1 < smallMissiles.length) {
            if (smallMissiles[asteroidId1] != null) {
                forEachSpriteGroupCollisionDo(smallMissiles[asteroidId1]["id"], asteroidGroupName, asteroidIsShot1);
            }
            asteroidId1++;
        }

        checkCollide();
    }

    if (gameStart == false && startSplashScreen) {
        viewControls();
        moveRocket();
        runSplashScreen();
    } else {
        if (isMultiplayer == false) {
            sequenceEnemy();
        } else {
            multiplayerGame();
        }
        begin = true;
    }
    if (spaceShipInfo["lives"] <= 0) {
        spaceShipInfo["lives"] = 0;
        gameOver();
    }

};
var openControls = false;
var openSplashScreen = true;
var backgroundTime = currentDate();
var gameOver = function () {
    //begin = false;
    if (startSplashScreen == true) {
        gameStart = false;
        spriteSetX("playAgain", 440);
        spriteSetY("playAgain", 432);
        spriteSetX("gameOverScreen", 0);
        if (getMouseX() > 440 && getMouseX() < 630 && getMouseY() > 432 && getMouseY() < 470) {
            spriteSetAnimation("playAgain", playAgainWhite);
            if (getMouseButton1()) {
                document.location.reload();
            }
        } else {
            spriteSetAnimation("playAgain", playAgainOrange);
        }
        spriteSetAnimation(spaceShipInfo["id"], spaceShipInfo["brokenAnim"]);
        if (backgroundTime + 500 < currentDate()) {
            spriteSetAnimation("gameOverScreen", backgroundAnim2);
            backgroundTime = currentDate();
        } else {
            spriteSetAnimation("gameOverScreen", backgroundAnim1);
        }
    }


};
var winScreen = function () {
    spriteSetX("win", 92);
    spriteSetY("win", 181.5);
    sprite("winScreen").html("<w>Press Enter to Play Again\n with Harder Levels</w>");
};
var time4;
var time5;
var runSplashScreen = function () {
    if (openSplashScreen) {

        if (getMouseX() > 10 && getMouseX() < 395 && getMouseY() > 300 && getMouseY() < 373) {
            spriteSetAnimation("start", startWhiteAnim);
            if (getMouseButton1()) {
                changeFromSplashScreen();
                time4 = currentDate();
            }
        } else {
            spriteSetAnimation("start", startOrangeAnim);
        }

        if (getMouseX() > 72 && getMouseX() < 222 && getMouseY() > 375 && getMouseY() < 404) {
            spriteSetAnimation("controls", controlsWhiteAnim);
            if (getMouseButton1()) {
                openControls = true;
            }
        } else {
            spriteSetAnimation("controls", controlsOrangeAnim);
        }
    }

};
var moveRocket = function () {

    if (rocketInfo["start"]) {
        rocketInfo["yspeed"] -= 0.2;
        if (rocketInfo["count"] == 0) {
            rocketInfo["count"] = 1;
            spriteSetAnimation(rocketInfo["id"], rocketInfo["takeOffAnim"]);
        }
        if (rocketInfo["time"] + 1200 < currentDate() && rocketInfo["count"] == 1) {
            spriteSetAnimation(rocketInfo["id"], rocketInfo["flyingAnim"]);
            spaceShipInfo["ypos"] = rocketInfo["ypos"] + 60;
            rocketInfo["count"] = 2;
        }

        if (rocketInfo["ypos"] < 100) {
            rocketInfo["ypos"] = 100;
            backgroundInfo["ypos"] += 10;
            rocketInfo["xpos"] -= 3;
            spaceShipInfo["xpos"] = rocketInfo["xpos"] + 57;
        }
        if (rocketInfo["xpos"] < 220) {
            rocketInfo["xpos"] = 220;
        }
    }

    if (time4 + 3700 < currentDate()) {
        spaceShipInfo["yspeed"] = 0;
        if (backgroundInfo["ypos"] > -10) {
            backgroundInfo["ypos"] = -0.5;
            rocketInfo["start"] = false;
            //rocketInfo["yspeed"] = -12;
        }
    }

    if (rocketInfo["ypos"] < 0 - rocketInfo["height"]) {
        gameStart = true;
        spriteSetX(backgroundInfo["id"], -1000);
        spriteSetX(smallBackgroundInfo["id"], -80);
    }

    rocketInfo["xpos"] += rocketInfo["xspeed"];
    rocketInfo["ypos"] += rocketInfo["yspeed"];
    spriteSetX(spaceShipInfo["id"], spaceShipInfo["xpos"]);
    spriteSetY(spaceShipInfo["id"], spaceShipInfo["ypos"]);
    spriteSetY(backgroundInfo["id"], backgroundInfo["ypos"]);
    spriteSetX(rocketInfo["id"], rocketInfo["xpos"]);
    spriteSetY(rocketInfo["id"], rocketInfo["ypos"]);
};
var changeFromSplashScreen = function () {
    var takeOff = new sound("img/takeOff.mp3");
    rocketInfo["start"] = true;
    rocketInfo["time"] = currentDate();
    takeOff.play();
    spriteSetX("start", -800);
    spriteSetX("controls", -800);
    spriteSetX("title", -640);
};
var viewControls = function () {
    if (openControls) {
        spriteSetX("controlsPage", 0);
        spriteSetY("controlsPage", 0);
        spriteSetX("backButton", 570);
        spriteSetY("backButton", 450);
        if (getMouseX() > 570 && getMouseX() < 630 && getMouseY() > 450 && getMouseY() < 470) {
            spriteSetAnimation("backButton", backButtonPressedAnim);
            if (getMouseButton1()) {
                spriteSetX("controlsPage", -640);
                spriteSetY("controlsPage", -480);
                spriteSetX("backButton", -640);
                spriteSetY("backButton", -480);
                openControls = false;
            }
        } else {
            spriteSetAnimation("backButton", backButtonAnim);
        }
    }

};