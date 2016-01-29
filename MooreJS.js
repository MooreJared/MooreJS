/*
 .__  __.          _        ____               _                    _  ._______          __
 |  \/  |         | |      |  _ \             | |                  | | |  __ \ \        / /
 | \  / | __ _  __| | ___  | |_) |_   _       | | __ _ _ __ ___  __| | | |__) \ \  /\  / /
 | |\/| |/ _` |/ _` |/ _ \ |  _ <| | | |  _   | |/ _` | '__/ _ \/ _` | |  ___/ \ \/  \/ /
 | |  | | (_| | (_| |  __/ | |_) | |_| | | |__| | (_| | | |  __/ (_| |_| |      \  /\  /
 |_|  |_|\__,_|\__,_|\___| |____/ \__, |  \____/ \__,_|_|  \___|\__,_(_)_|       \/  \/
 ..................................__/ |...................................................
 .................................|___/....................................................
 GitHub CDN: https://cdn.rawgit.com/MooreJared/MooreJS/master/MooreJS.js
 */

// Finds Window Dimensions
var windowWidth, windowHeight;

windowWidth = $(window).width();
windowHeight = $(window).height();

$(window).resize(function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
});

// Finds Mouse Pos
var mouse = {X: null, Y: null, click: false};

$(document).on("mousemove", function (event) {
    mouse.X = event.pageX;
    mouse.Y = event.pageY;
});

$(document).on("mousedown", function () {
    mouse.click = true;
});

$(document).on("mouseup", function () {
    mouse.click = false;
});

$.fn.center = function (axis, parent, auto) {
    var item = $(this);
    var position = axis;
    var isAuto = auto;
    var positionCss = {};
    if (axis === undefined) {
        console.error("Axis is not defined");
        return ("error");
    } else if (parent === undefined) {
        console.error("Size to parent is not defined");
        return ("error");
    } else {
        if ($(item).css("position") === "absolute") {
            positionCss = {left: "left", top: "top"};
        } else {
            positionCss = {left: "margin-left", top: "margin-top"};
        }

        function centerXY() {
            $(item).css(positionCss.left, ($(parent).width() / 2) - ($(item).width() / 2) + "px");
            $(item).css(positionCss.top, ($(parent).height() / 2) - ($(item).height() / 2) + "px");
        }

        function centerX() {
            $(item).css(positionCss.left, ($(parent).width() / 2) - ($(item).width() / 2) + "px");
        }

        function centerY() {
            $(item).css(positionCss.top, ($(parent).height() / 2) - ($(item).height() / 2) + "px");
        }

        function centerInitialize() {
            switch (position.toUpperCase()) {
                case "XY":
                    centerXY();
                    break;
                case "X":
                    centerX();
                    break;
                case "Y":
                    centerY();
                    break;
            }
        }

        // start ----
        if (typeof isAuto === 'undefined') {
            switch (position.toUpperCase()) {
                case "XY":
                    centerXY();
                    break;
                case "X":
                    centerX();
                    break;
                case "Y":
                    centerY();
                    break;
            }
        } else {
            switch (isAuto.toUpperCase()) {
                case "XY":
                    $(window).resize(function () {
                        centerXY();
                    });
                    centerInitialize();
                    break;
                case "X":
                    $(window).resize(function () {
                        centerX();
                    });
                    centerInitialize();
                    break;
                case "Y":
                    $(window).resize(function () {
                        centerY();
                    });
                    centerInitialize();
                    break;
            }
        }
    }
};

$.fn.drag = function (a) {
    var item = $(this);
    var click = false;
    var offset = {X: null, Y: null};
    var defaultMouse = $(item).css("cursor");
    var config = a;
    var positionCss = {};
    var handle = item;

    if ($(item).css("position") === "absolute") {
        positionCss = {left: "left", top: "top"};
    } else {
        positionCss = {left: "margin-left", top: "margin-top"};
    }

    if (config === undefined) {
        config = {};
    }

    if (config.handle !== undefined) {
        handle = config.handle;
    }

    $(document).on("mousemove", function () {
        if (click) {
            $(item).css(positionCss.left, mouse.X - (offset.X) + "px");
            $(item).css(positionCss.top, mouse.Y - (offset.Y) + "px");
            if (config.onMove !== undefined) {
                config.onMove();
            }
            $('body').css({
                "-webkit-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            });
        }
    });

    $(handle).on("mousedown", function () {
        click = true;
        offset.X = mouse.X - $(item).pos().left;
        offset.Y = mouse.Y - $(item).pos().top;
        $(item).css("cursor", function () {
            if (config.cursor !== undefined) {
                return (config.cursor);
            } else {
                return ("default");
            }
        });
    });

    $(document).on("mouseup", function () {
        click = false;
        $(item).css("cursor", defaultMouse);
        if (config.onRelease !== undefined) {
            config.onRelease();
        }
        $('body').css({
            "-webkit-user-select": "all",
            "-moz-user-select": "all",
            "-ms-user-select": "all",
            "user-select": "all"
        });
    });

    if (item.css("position") === "absolute") {
        if (String($(item).pos().left) === "NaN") {
            $(item).css("left", "0px");
        }

        if (String($(item).pos().top) === "NaN") {
            $(item).css("top", "0px");
        }
    }
};

$.fn.pos = function () {
    var item = $(this);
    var positionCss = {};
    if ($(item).css("position") === "absolute") {
        positionCss = {left: "left", top: "top"};
    } else {
        positionCss = {left: "margin-left", top: "margin-top"};
    }
    var pos = {left: null, top: null};
    pos.left = Number($(item).css(positionCss.left).replace("px", ""));
    pos.top = Number($(item).css(positionCss.top).replace("px", ""));
    return (pos);
};

$.fn.fromTo = function (a) {
    var item = $(this);
    var config = a;
    config.from = {};
    var triggerElement = config.triggerElement;
    var duration = config.duration;
    var animationStyle = config.animationStyle;

    if (triggerElement === undefined) {
        triggerElement = item;
    }

    for (var prop in config.css) {
        config.from[prop] = $(this).css(prop);
    }

    $(triggerElement).on(config.toggleOn, function () {
        $(item).css({
            "-webkit-transition-duration": duration,
            "-webkit-transition-property": "all",
            "-webkit-transition-timing-function": animationStyle,
            "-moz-transition-duration": duration,
            "-moz-transition-property": "all",
            "-moz-transition-timing-function": animationStyle,
            "transition-duration": duration,
            "transition-property": "all",
            "transition-timing-function": animationStyle,
        });
        $(item).css(config.css);
    });

    $(triggerElement).on(config.toggleOff, function () {
        $(item).css(config.from);
    });
};

$.fn.onSize = function (axis, min, max, fn) {
    var item = $(this);
    var func = function () {
        fn();
    };
    var onSize = {min: Number(min), max: Number(max), run: false};
    onSize.axis = axis;

    if (onSize.axis.toLowerCase() === "x") {
        onSize.itemSize = $(item).width();
    } else if (onSize.axis.toLowerCase() === "y") {
        onSize.itemSize = $(item).height();
    } else {
        console.error("Axis is not defined as either 'X' or 'Y'");
    }

    if (onSize.itemSize >= onSize.min && onSize.itemSize <= onSize.max && (onSize.run !== true)) {
        func();
        onSize.run = true;
    }

    $(item).resize(function () {
        if (onSize.axis.toLowerCase() === "x") {
            onSize.itemSize = $(item).width();
        } else if (onSize.axis.toLowerCase() === "y") {
            onSize.itemSize = $(item).height();
        }

        if (onSize.itemSize >= onSize.min && onSize.itemSize <= onSize.max && (onSize.run !== true)) {
            func();
            onSize.run = true;
        }

        if (onSize.itemSize <= onSize.min || onSize.itemSize >= onSize.max) {
            onSize.run = false;
        }
    });
};

$.fn.color = function (a) {
    var item = $(this);
    $(item).css("color", a);
};

$.fn.backgroundColor = function (a) {
    var item = $(this);
    $(item).css("background-color", a);
};

function warningGenerator(title, message, _var) {
    var warning = {amount: 0};
    if (window[_var] === false) {
        window[_var] = true;
        $("<div class='warningBox warningID" + warning.amount + "'> <h4 class='warning'>" + title + "</h4> <h5 class='warningInfo'>" + message + "</h5> <i class='material-icons warningClose warningBtn" + warning.amount + "'>close</i> </div>").prependTo('body');
        $('.warningID' + warning.amount).center("XY", window, "auto");
        $('.warningBtn' + warning.amount).on("click", function () {
            $('.warningID' + warning.amount).remove();
            warning.amount -= 1;
            window[_var] = false;
        });
        $('.warningID' + warning.amount).drag({
            cursor: "move"
        });
    }
}

function log(a) {
    console.log(a);
}

function rand(range) {
    if (range === "undefined") {
        console.error("Rand has no range set. i.e 5");
    } else if ((range) === "bool") {
        if (Math.floor((Math.random() * 2) + 1) === 1) {
            return (true);
        } else {
            return (false);
        }
    } else if ((range.toLowerCase()) === "rgb") {
        return ("rgb(" + (Math.floor((Math.random() * 255) + 1)) + "," + (Math.floor((Math.random() * 255) + 1)) + "," + (Math.floor((Math.random() * 255) + 1)) + ")");
    } else if ((range.toLowerCase()) === "hex") {
        var hex = "";
        var loop = 0;

        while (loop < 6) {
            loop++;
            var bool = rand("bool");
            var randNum = rand(6);

            if (bool) {
                switch (randNum) {
                    case 1:
                        hex += "A";
                        break;
                    case 2:
                        hex += "B";
                        break;
                    case 3:
                        hex += "C";
                        break;
                    case 4:
                        hex += "E";
                        break;
                    case 5:
                        hex += "D";
                        break;
                    case 6:
                        hex += "F";
                        break;
                }
            } else {
                switch (randNum) {
                    case 1:
                        hex += "1";
                        break;
                    case 2:
                        hex += "2";
                        break;
                    case 3:
                        hex += "3";
                        break;
                    case 4:
                        hex += "4";
                        break;
                    case 5:
                        hex += "5";
                        break;
                    case 6:
                        hex += "6";
                        break;
                }
            }
        }
        hex = ("#" + hex);
        return hex;
    }
    else {
        return (Math.floor((Math.random() * range) + 1));
    }
}
