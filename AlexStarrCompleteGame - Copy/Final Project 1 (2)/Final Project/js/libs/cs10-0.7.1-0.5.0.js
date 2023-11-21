"use strict";
/*
 * Copyright (c) 2012, 2016, 2017 Carson Cheng. All rights reserved.
 * The use and distribution terms for this software are covered by the
 * Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
 * which can be found in the file EPL-1.0-LICENSE.txt in the LICENSE directory 
 * at the root of this distribution. By using this software in any fashion, you 
 * are agreeing to be bound by the terms of this license.
 * You must not remove this notice, or any other, from this software.
 */
/*
 * cs10 wrapper around gameQuery rev. 0.7.1.
 * makes things more procedural.
 * load this after gameQuery.
 */

var GQ_DEBUG = true;
var setGqDebugFlag = function(debug){
    if (debug){
        GQ_DEBUG = true;
    } else {
        GQ_DEBUG = false;
    }
};

var spriteGroupNameRegEx = /[a-zA-Z0-9_]+[a-zA-Z0-9_-]*/;
var spriteGroupNameFormatOk = function(spriteOrGroupName){
    if (typeof spriteOrGroupName !== "string" && typeof spriteOrGroupName !== "number"){
        return false;
    }
    spriteOrGroupName = spriteOrGroupName.toString();
    var nameMatches = spriteOrGroupName.match(spriteGroupNameRegEx);
    if (nameMatches.length === 0){
        return false;
    }

    return (spriteOrGroupName === nameMatches[0]);
};

var GQ_SIGNALS = {};
var GQ_UNIQUE_ID_COUNTER = 0;

var GQ_PLAYGROUND_WIDTH = 640;
var GQ_PLAYGROUND_HEIGHT = 480;
var PLAYGROUND_WIDTH = GQ_PLAYGROUND_WIDTH; // students are not supposed to use GQ_ variables
var PLAYGROUND_HEIGHT = GQ_PLAYGROUND_HEIGHT;

// Max/Min Safe Playground Integers found by experimenting with GQ 0.7.1 in Firefox 41.0.2 on Mac OS X 10.10.5
var GQ_MIN_SAFE_PLAYGROUND_INTEGER = -(Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
var GQ_MAX_SAFE_PLAYGROUND_INTEGER = (Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER

var GQ_USER_ERROR_MSG_HEAD = "Error in \"myprogram.js\"- ";

var GQ_unique_id = function () {
    return Date.now() + "_" + GQ_UNIQUE_ID_COUNTER++;
};

var setGqPlaygroundDimensions = function (width, height) {
    // this must be executed outside of setup and draw functions
    GQ_PLAYGROUND_HEIGHT = height;
    PLAYGROUND_HEIGHT = height;
    GQ_PLAYGROUND_WIDTH = width;
    PLAYGROUND_WIDTH = width;
    sprite("playground").width(width).height(height);
};


var currentDate = function () {
    return Date.now();
};

var consolePrint = function (txt) {
    // might work only in Chrome or if some development add-ons are installed
    console.log(txt);
};


var throwOnImgLoadError = function (imgUrl) {
    // what this function throws cannot be caught by caller tho...
    var throwableErr = new Error("image file not found: " + imgUrl);
    $("<img/>").on('error', function () {
        if(throwableErr.stack.toString().indexOf("myprogram.js")>=0){
            throwableErr.message = GQ_USER_ERROR_MSG_HEAD+ throwableErr.message;
        }
        throw throwableErr;
    }).attr("src", imgUrl);
};

var newGQAnimation = function (urlOrMap, numberOfFrame, delta, rate, type) {
    if (GQ_DEBUG){
        if (typeof (urlOrMap) === "string") {
            throwOnImgLoadError(urlOrMap);
        }
    }
    
    if (arguments.length === 5) {
        return new $.gQ.Animation({
            imageURL: urlOrMap,
            numberOfFrame: numberOfFrame,
            delta: delta,
            rate: rate,
            type: type
        });
    } else if (typeof (urlOrMap) === "string") {
        return new $.gQ.Animation({imageURL: urlOrMap});
    } else {
        return new $.gQ.Animation(urlOrMap);
    }
};

var createGroupInPlayground = function (groupName, theWidth, theHeight, thePosx, thePosy) {
    if (GQ_DEBUG){
        if (!spriteGroupNameFormatOk(groupName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Group name format is wrong: " + groupName);
        }
        if (spriteExists(groupName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Cannot create duplicate group with name: " + groupName);
        }
    };
    
    if (arguments.length === 1) {
        $.playground().addGroup(groupName, {width: $.playground().width(),
            height: $.playground().height()});
    } else if (arguments.length === 3) {
        $.playground().addGroup(groupName, {width: theWidth,
            height: theHeight});
    } else if (arguments.length === 5) {
        $.playground().addGroup(groupName, {width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy});
    } else if (arguments.length === 2) { // treats arguments[1] as a standard options map
        $.playground().addGroup(groupName, arguments[1]);
    }
};


var createSpriteInGroup = function (groupName, spriteName, theAnimation, theWidth, theHeight, thePosx, thePosy) {
    if (GQ_DEBUG){
        if (!spriteExists(groupName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Group doesn't exist: " + groupName);
        }
        if (!spriteGroupNameFormatOk(spriteName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Sprite name format is wrong: " + spriteName);
        }
        if (arguments.length > 3){
            if (typeof (theAnimation) !== "object" || typeof(theAnimation["imageURL"]) !== "string") {
                throw(GQ_USER_ERROR_MSG_HEAD+"This is not a GameQuery animation: " + theAnimation);
            }
            if (typeof(theWidth) !== "number" || typeof(theHeight) !== "number"){
                throw(GQ_USER_ERROR_MSG_HEAD+"NaN: " + theWidth + " or " + theHeight);
            }
            if (spriteExists(spriteName)){
                throw(GQ_USER_ERROR_MSG_HEAD+"Cannot create duplicate sprite with name: " + spriteName);
            }
        }
    };
    
    if (arguments.length === 5) {
        $("#" + groupName).addSprite(spriteName, {animation: theAnimation,
            width: theWidth,
            height: theHeight});
    } else if (arguments.length === 7) {
        $("#" + groupName).addSprite(spriteName, {animation: theAnimation,
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy});
    } else if (arguments.length === 3) { // treats arguments[2] as a standard options map
        $("#" + groupName).addSprite(spriteName, arguments[2]);
    }
};


var createTextSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, thePosx, thePosy) {
    // to be used like sprite("textBox").text("hi"); // or .html("<b>hi</b>");
    
    if (GQ_DEBUG){
        if (!spriteGroupNameFormatOk(spriteName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Sprite name format wrong: " + spriteName);
        }
        if (!spriteExists(groupName)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Group doesn't exist: " + groupName);
        }
    };
    
    if (arguments.length === 4) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight
        });
    } else if (arguments.length === 6) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy
        });
    }
    $("#" + spriteName).css("background-color", "white") // default to white background for ease of use
                       .css("user-select", "none");
};


var textInputSpriteTextAreaId = function (spriteName) {
    return spriteName + "-textarea";
};
var textInputSpriteSubmitButtonId = function (spriteName) {
    return spriteName + "-button";
};
var textInputSpriteGQ_SIGNALS_Id = function (spriteName) {
    return spriteName + "-submitted";
};
var createTextInputSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, rows, cols, thePosx, thePosy, submitHandler) {
    if (arguments.length === 6) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight);
    } else if (arguments.length === 8 || arguments.length === 9) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight, thePosx, thePosy);
    }
    $("#" + spriteName).css("background-color", "white"); // default to white background for ease of use

    var textareaHtml = '<textarea id="' + textInputSpriteTextAreaId(spriteName) + '" rows="' + rows + '" cols="' + cols + '">hi</textarea>';
    $("#" + spriteName).append(textareaHtml);

    var buttonId = textInputSpriteSubmitButtonId(spriteName);
    var buttonHtml = '<button id="' + buttonId + '" type="button">Submit</button>';
    $("#" + spriteName).append(buttonHtml);

    if (arguments.length === 9) {
        textInputSpriteSetHandler(spriteName, submitHandler);
    } else {
        textInputSpriteSetHandler(spriteName);
    }
};
var textInputSpriteSetHandler = function (spriteName, submitHandler) {
    var realSubmitHandler;
    if (arguments.length === 2) {
        realSubmitHandler = function () {
            submitHandler(textInputSpriteString(spriteName));
            GQ_SIGNALS[textInputSpriteGQ_SIGNALS_Id(spriteName)] = true;
        };
    } else {
        realSubmitHandler = function () {
            GQ_SIGNALS[textInputSpriteGQ_SIGNALS_Id(spriteName)] = true;
        };
    }
    $("#" + textInputSpriteSubmitButtonId(spriteName)).click(realSubmitHandler);
};

var textInputSpriteString = function (spriteName) {
    return $("#" + textInputSpriteTextAreaId(spriteName))[0].value;
};
var textInputSpriteSetString = function (spriteName, str) {
    $("#" + textInputSpriteTextAreaId(spriteName))[0].value = str;
};

var textInputSpriteReset = function (spriteName, textPrompt) {
    if (arguments.length === 1) {
        textInputSpriteSetString(spriteName, "");
    } else if (arguments.length === 2) {
        textInputSpriteSetString(spriteName, textPrompt);
    }
    GQ_SIGNALS[textInputSpriteGQ_SIGNALS_Id(spriteName)] = false;
};

var textInputSpriteSubmitted = function (spriteName) {
    if (GQ_SIGNALS[textInputSpriteGQ_SIGNALS_Id(spriteName)] === true) {
        return true;
    }
    return false;
};



var removeSprite = function (spriteNameOrObj) {
    if (typeof (spriteNameOrObj) !== "object") {
        if (GQ_DEBUG && !spriteExists(spriteNameOrObj)){
            throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteNameOrObj);
        };
        $("#" + spriteNameOrObj).remove();
    } else {
        $(spriteNameOrObj).remove();
    }
};



var sprite = function (spriteName) {
    return $("#" + spriteName);
};

var spriteExists = function (spriteName) {
    return (spriteName == $("#" + spriteName).attr("id")); // spriteName could be given as an int by a student
};

var spriteObject = function (spriteNameOrObj) {
    if (typeof (spriteNameOrObj) !== "object") {
        return $("#" + spriteNameOrObj);
    } else {
        return $(spriteNameOrObj);
    }
};

var spriteId = function (spriteNameOrObj) {
    if (typeof (spriteNameOrObj) !== "object") {
        return $("#" + spriteNameOrObj).attr("id");
    } else {
        return $(spriteNameOrObj).attr("id");
    }
};


var spriteGetX = function (spriteName) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    return $("#" + spriteName).x();
};
var spriteGetY = function (spriteName) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    return $("#" + spriteName).y();
};
var spriteGetZ = function (spriteName) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    return $("#" + spriteName).z();
};
var spriteSetX = function (spriteName, xval) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    $("#" + spriteName).x(xval);
};
var spriteSetY = function (spriteName, yval) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    $("#" + spriteName).y(yval);
};
var spriteSetZ = function (spriteName, zval) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    $("#" + spriteName).z(zval);
};
var spriteSetXY = function (spriteName, xval, yval) {
    $("#" + spriteName).xy(xval, yval);
};
var spriteSetXYZ = function (spriteName, xval, yval, zval) {
    $("#" + spriteName).xyz(xval, yval, zval);
};


var spriteGetWidth = function (spriteName) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    return $("#" + spriteName).w();
};
var spriteGetHeight = function (spriteName) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    return $("#" + spriteName).h();
};
var spriteSetWidth = function (spriteName, wval) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    $("#" + spriteName).w(wval);
};
var spriteSetHeight = function (spriteName, hval) {
    if (GQ_DEBUG && !spriteExists(spriteName)){
        throw(GQ_USER_ERROR_MSG_HEAD+"Sprite doesn't exist: " + spriteName);
    };
    $("#" + spriteName).h(hval);
};
var spriteSetWidthHeight = function (spriteName, wval, hval) {
    $("#" + spriteName).wh(wval, hval);
};


var spriteRotate = function (spriteName, angleDegrees) {
    $("#" + spriteName).rotate(angleDegrees);
};

var spriteScale = function (spriteName, ratio) {
    $("#" + spriteName).scale(ratio);
};


var spriteSetAnimation = function (spriteNameOrObj, aGQAnimation, callbackFunction) {
    if (arguments.length === 2) {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation);
    } else if (arguments.length === 3) {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation, callbackFunction);
    } else if (arguments.length === 1) {
        spriteObject(spriteNameOrObj).setAnimation();
    }
};
var spritePauseAnimation = function (spriteName) {
    $("#" + spriteName).pauseAnimation();
};
var spriteResumeAnimation = function (spriteName) {
    $("#" + spriteName).resumeAnimation();
};


var forEachSpriteSpriteCollisionDo = function (sprite1Name, sprite2Name, collisionHandlingFunction) {
    $("#" + sprite1Name).collision(".gQ_group, #" + sprite2Name).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};

var forEachSpriteGroupCollisionDo = function (sprite1Name, groupName, collisionHandlingFunction) {
    $("#" + sprite1Name).collision("#" + groupName + ", .gQ_sprite").each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};

var forEachSpriteFilteredCollisionDo = function (sprite1Name, filterStr, collisionHandlingFunction) {
    $("#" + sprite1Name).collision(filterStr).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};

var spriteHitDirection = function (sprite1X, sprite1Y, sprite1XSpeed, sprite1YSpeed, sprite1Width, sprite1Height,
        sprite2X, sprite2Y, sprite2XSpeed, sprite2YSpeed, sprite2Width, sprite2Height) {
    var sprite1Info = {
        "x": sprite1X,
        "y": sprite1Y,
        "xspeed": sprite1XSpeed,
        "yspeed": sprite1YSpeed,
        "height": sprite1Height,
        "width": sprite1Width
    };
    var sprite2Info = {
        "x": sprite2X,
        "y": sprite2Y,
        "xspeed": sprite2XSpeed,
        "yspeed": sprite2YSpeed,
        "height": sprite2Height,
        "width": sprite2Width
    };
    return spriteHitDir(sprite1Info, sprite2Info);
};

var spriteHitDir = function (sprite1Info, sprite2Info) {
    /*
     Returns the direction that sprite 1 hits sprite 2 from.
     sprite 1 is relatively left/right/up/down of sprite 2
     
     Hit direction returned could be multiple values (e.g. left and up),
     and is returned by this function as a dictionary as, e.g.
     {
     "left": false,
     "right": false,
     "up": false,
     "down": false
     }
     
     Parameters sprite{1,2}Info are dictionaries with at least these keys:
     {
     "id": "actualSpriteName", // this is not strictly needed
     "x": 500,
     "y": 200,
     "xspeed": -8,  // movement must be by dictionary,
     "yspeed": 0,   // with something like x = x + xspeed
     "height": 74,
     "width": 75
     }
     */

    var percentMargin = 1.1; // positive percent in decimal
    var dir = {
        "left": false,
        "right": false,
        "up": false,
        "down": false
    };

    // current horizontal position
    var s1left = sprite1Info["x"];
    var s1right = s1left + sprite1Info["width"];

    var s2left = sprite2Info["x"];
    var s2right = s2left + sprite2Info["width"];

    // reverse horizontal position by xspeed with percent margin 
    var sprite1XSpeed = sprite1Info["xspeed"] * percentMargin;
    s1left = s1left - sprite1XSpeed;
    s1right = s1right - sprite1XSpeed;

    var sprite2XSpeed = sprite2Info["xspeed"] * percentMargin;
    s2left = s2left - sprite2XSpeed;
    s2right = s2right - sprite2XSpeed;

    if (s1right <= s2left) {
        dir["left"] = true;
    }
    if (s2right <= s1left) {
        dir["right"] = true;
    }


    // current vertical position
    var s1top = sprite1Info["y"];
    var s1bottom = s1top + sprite1Info["height"];

    var s2top = sprite2Info["y"];
    var s2bottom = s2top + sprite2Info["height"];

    // reverse vertical position by yspeed with percent margin
    var sprite1YSpeed = sprite1Info["yspeed"] * percentMargin;
    s1top = s1top - sprite1YSpeed;
    s1bottom = s1bottom - sprite1YSpeed;

    var sprite2YSpeed = sprite2Info["yspeed"] * percentMargin;
    s2top = s2top - sprite2YSpeed;
    s2bottom = s2bottom - sprite2YSpeed;

    if (s1bottom <= s2top) {
        dir["up"] = true;
    }
    if (s2bottom <= s1top) {
        dir["down"] = true;
    }

    return dir;
};

var getKeyState = function (key) {
    return $.gQ.keyTracker[key];
};

var getMouseX = function () {
    return $.gQ.mouseTracker.x;
};
var getMouseY = function () {
    return $.gQ.mouseTracker.y;
};
var getMouseButton1 = function () {
    return $.gQ.mouseTracker[1];
};
var getMouseButton2 = function () {
    return $.gQ.mouseTracker[2];
};
var getMouseButton3 = function () {
    return $.gQ.mouseTracker[3];
};

var disableContextMenu = function () {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    //$("#playground").contextmenu(function(){return false;});
    $("#playground").on("contextmenu.cs10", function () {
        return false;
    });
};
var enableContextMenu = function () {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    $("#playground").off("contextmenu.cs10");
};

var hideMouseCursor = function () {
    $("#playground").css("cursor","none");
};
var showMouseCursor = function () {
    $("#playground").css("cursor","default");
};




var saveDictionaryAs = function (saveAs, dictionary) {
    // requires js-cookie: https://github.com/js-cookie/js-cookie/tree/v2.0.4
    Cookies.set("GQ_" + saveAs, dictionary);
};
var getSavedDictionary = function (savedAs) {
    return Cookies.getJSON("GQ_" + savedAs);
};
var deleteSavedDictionary = function (savedAs) {
    Cookies.remove("GQ_" + savedAs);
};



var createOvalInGroup = function (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    //rotdeg in degrees clockwise on screen (recall y-axis points downwards!)

    if (color === undefined) {
        color = "gray";
    }

    if (groupName === null) {
        $.playground().addSprite(id, {width: 1, height: 1});
    } else {
        createSpriteInGroup(groupName, id, {width: 1, height: 1});
    }


    var border_radius = (w / 2 + "px / " + h / 2 + "px");
    sprite(id)
            .css("background", color)
            .css("border-radius", border_radius)
            .css("-moz-border-radius", border_radius)
            .css("-webkit-border-radius", border_radius);


    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);

    if (rotdeg !== undefined) {
        if (rotOriginX !== undefined && rotOriginY !== undefined) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                    .css("-webkit-transform-origin", rotOrigin)
                    .css("-moz-transform-origin", rotOrigin)
                    .css("-ms-transform-origin", rotOrigin)
                    .css("-o-transform-origin", rotOrigin)
                    .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
var createOval = function (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    createOvalInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
var drawOval = function (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    createOval("GQ_oval_" + GQ_unique_id(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};

var createCircleInGroup = function (groupName, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) {
    createOvalInGroup(groupName, id, x, y, r, r, color, rotdeg, rotOriginX, rotOriginY);
};
var createCircle = function (id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) {
    createCircleInGroup(null, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};
var drawCircle = function (x, y, r, color, rotdeg, rotOriginX, rotOriginY) {
    createCircle("GQ_circle_" + GQ_unique_id(), x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};

var createRectInGroup = function (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    // rotOrigin{X,Y} must be within range of wide w and height h, and relative to coordinate (x,y).

    if (color === undefined) {
        color = "gray";
    }

    if (groupName === null) {
        $.playground().addSprite(id, {width: 1, height: 1});
    } else {
        createSpriteInGroup(groupName, id, {width: 1, height: 1});
    }

    sprite(id).css("background", color);

    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);

    if (rotdeg !== undefined) {
        if (rotOriginX !== undefined && rotOriginY !== undefined) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                    .css("-webkit-transform-origin", rotOrigin)
                    .css("-moz-transform-origin", rotOrigin)
                    .css("-ms-transform-origin", rotOrigin)
                    .css("-o-transform-origin", rotOrigin)
                    .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
var createRect = function (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    createRectInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
var drawRect = function (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) {
    createRect("GQ_rect_" + GQ_unique_id(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};

var createLineInGroup = function (groupName, id, x1, y1, x2, y2, color, thickness) {
    if (color === undefined) {
        color = "gray";
    }
    if (thickness === undefined) {
        thickness = 2;
    }
    var xd = x2 - x1;
    var yd = y2 - y1;
    var dist = Math.sqrt(xd * xd + yd * yd);

    var arcCos = Math.acos(xd / dist);
    if (y2 < y1) {
        arcCos *= -1;
    }
    var rotdeg = arcCos * 180 / Math.PI;

    var halfThick = thickness / 2;
    var drawY1 = y1 - halfThick;

    createRectInGroup(groupName, id, x1, drawY1, dist, thickness, color, rotdeg, 0, halfThick);
};
var createLine = function (id, x1, y1, x2, y2, color, thickness) {
    createLineInGroup(null, id, x1, y1, x2, y2, color, thickness);
};
var drawLine = function (x1, y1, x2, y2, color, thickness) {
    createLine("GQ_line_" + GQ_unique_id(), x1, y1, x2, y2, color, thickness);
};





var createContainerIterator = function (f, start, end, stepsize) {
    var iter = {
        next: null,
        hasNext: null,
        current: 0,
        end: 0,
        keys: null,
        contents: null
    };
    iter.hasNext = function () {
        return (iter.current < iter.end);
    };
    if (arguments.length === 1) {
        iter.keys = Object.getOwnPropertyNames(f);
        iter.current = 0;
        iter.end = iter.keys.length;
        iter.next = function () {
            //var item = [iter.keys[iter.current], iter.contents[iter.current]];
            var itemIdx = iter.keys[iter.current];
            var item = [itemIdx, f[itemIdx]];
            iter.current++;
            return item;
        };
    } else {
        var fx;
        if ("function" === typeof (f)) {
            fx = f;
        } else {
            fx = function (x) {
                return f[x];
            };
        }

        iter.current = start;
        iter.end = end;
        iter.next = function () {
            var item = [iter.current, fx(iter.current)];
            iter.current += stepsize;
            return item;
        };
    }
    return iter;
};
var createGraphWithOptions = function (groupName, id, f, moreOpts) {
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize)
    // fn signature: (groupName, id, f, moreOpts, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, color)
    // fn signature: (groupName, id, f, moreOpts)
    // moreOpts = {"interpolated": trueOrFalse}
    var interpolated = moreOpts["interpolated"];
    
    if (!id) {
        id = "GQ_graph_" + GQ_unique_id();
    }
    if (!groupName) {
        groupName = id + "_group";
        createGroupInPlayground(groupName);
    }
    var group_id = {
        "id": id,
        "group": groupName
    };

    var color;
    var radius_thickness;
    var iter;
    if (arguments.length >= 4 && arguments.length <= 6 && "object" === typeof (f)) {
        color = arguments[4];
        radius_thickness = arguments[5];
        iter = createContainerIterator(f);
    } else if (arguments.length >= 7 && arguments.length <= 9) {
        var start = arguments[4];
        var end = arguments[5];
        var stepsize = arguments[6];
        color = arguments[7];
        radius_thickness = arguments[8];
        iter = createContainerIterator(f, start, end, stepsize);
    }

    if (color == undefined) {
        color = "gray";
    }
    if (radius_thickness == undefined) {
        radius_thickness = 2;
    }

    var currX = null;
    var currY = null;
    while (iter.hasNext()) {
        var item = iter.next();
        var i = item[0];
        var fxi = item[1];

        if (fxi === Infinity) {
            fxi = GQ_MAX_SAFE_PLAYGROUND_INTEGER;
        } else if (fxi === -Infinity) {
            fxi = GQ_MIN_SAFE_PLAYGROUND_INTEGER;
        }

        if (currY === null && fxi != undefined) {
            currX = i;
            currY = fxi;
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            }
        } else if (fxi != undefined) {
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            } else {
                createLineInGroup(group_id["group"], group_id["id"] + "_graph_line_" + currX + "-" + i, currX, currY, i, fxi, color, radius_thickness);
            }
            currX = i;
            currY = fxi;
        }
    }
    return group_id;
};

var createGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, dotRadius)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, {"interpolated": false});
    return createGraphWithOptions.apply(this, args);
};
var createGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, dotRadius)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, {"interpolated": false});
    return createGraphWithOptions.apply(this, opts);
};
var drawGraph = function drawGraph() {
    // fn signature: (f, start, end, stepsize, color, dotRadius)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, dotRadius)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, {"interpolated": false});
    return createGraphWithOptions.apply(this, opts);
};

var createInterpolatedGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, thickness)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, thickness)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, {"interpolated": true});
    return createGraphWithOptions.apply(this, args);
};
var createInterpolatedGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, thickness)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, thickness)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, {"interpolated": true});
    return createGraphWithOptions.apply(this, opts);
    //return createInterpolatedGraphInGroup.apply(this, opts);
};
var drawInterpolatedGraph = function () {
    // fn signature: (f, start, end, stepsize, color, thickness)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, thickness)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, {"interpolated": true});
    return createGraphWithOptions.apply(this, opts);
};
