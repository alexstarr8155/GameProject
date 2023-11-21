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
 * cs10 wrapper around gameQuery rev. 0.7.1 startup code.
 * hides stuff to make myprogram.js easier to learn.
 * this script auto-loads myprogram.js.
 */

$(function () {
    var localLibsOnly = true; // set false to use CDN libs if available, esp. if hot patching desired

    // Avoid console.log errors in browsers that lack a console (i.e. IE)
    // see: http://stackoverflow.com/questions/7742781/why-javascript-only-works-after-opening-developer-tools-in-ie-once
    // for more complete solution, see: https://github.com/h5bp/html5-boilerplate/blob/master/src/js/plugins.js
    if(!window.console) {
        console={log: function(){}};
    }
    
    var urlExist = function (url, callback){ // callback is called with whether url exists (boolean)
        if (localLibsOnly){
            callback(false);
            return;
        }
    
        // see: https://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
        var http = new XMLHttpRequest();
        http.open('HEAD', url, true);
        http.onload = function(e){
            if (http.readyState === 4) {
                callback( http.status!==404 );
            }
        }
        http.onerror = function (e) {
            callback(false);
        };
        http.send(null);
    };

    var loadCss = function (url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.type = 'text/css';
        link.media = 'all';
        link.href = url;

        link.onreadystatechange = callback;
        link.onload = callback;

        head.appendChild(link);
        //console.log("Loaded css: " + url);
    };

    var loadScript = function (url, callback) {
        // see: https://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onreadystatechange = callback;
        script.onload = callback;

        head.appendChild(script);
        //console.log("Loaded script: " + url);
    };
    
    var loadRsrc = function(loader, scriptName, cdnUrl, fallbackUrl, callback){
        // loader must be like loadScript(url, callback), or loadCss(url, callback)
        callback = callback || function(){};
        urlExist(cdnUrl, function(theUrlExists){
            if (theUrlExists){
                loader(cdnUrl, function(){
                    console.log('Using online CDN: ' + scriptName);
                    callback();
                });
            } else {
                loader(fallbackUrl, function(){
                    console.log('Using fallback lib: ' + scriptName);
                    callback();
                });
            }
        });
    };

    // main
    var cs10libname = "cs10-0.7.1-0.5.0.js";
    var gitTag = "v5.8";
    loadRsrc(loadScript, cs10libname,
             "https://gitcdn.xyz/cdn/ccheng/JQGQ-Project-Template/" + gitTag + "/js/libs/" + cs10libname, // use gitcdn.xyz/cdn instead of /repo to get specific hash instead of latest commit
             "js/libs/" + cs10libname, function(){
             // GitCDN will take up to 2 hours to propagate file changes
        //consolePrint("Using: " + cs10libname);

        sprite("playground").playground({
            height: GQ_PLAYGROUND_HEIGHT,
            width: GQ_PLAYGROUND_WIDTH,
            keyTracker: true,
            mouseTracker: true
        });

        var studentProgramName = "myprogram.js";
        loadScript("js/" + studentProgramName, function () {
            console.log("Running: " + studentProgramName);
            
            setup();

            var REFRESH_RATE = 41;
            $.playground().registerCallback(draw, REFRESH_RATE);
            $.playground().startGame();
        });
    });
});
