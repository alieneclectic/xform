// Inline css transitions for Webkit
// Request Animation Frame optimization
// Jason English
// Feb 2013;
// version 1.1

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || //
    window.webkitRequestAnimationFrame || //
    window.mozRequestAnimationFrame || //
    window.oRequestAnimationFrame || //
    window.msRequestAnimationFrame || //
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

(function($) {
    $.fn.xform = function(settings, callback) {

        this.callback = callback;
        this.ticking = false;
        var self = this;

        // set default object
        var config = {
            x : 0,
            y : 0,
            z : 0, //
            time : 0, // miliseconds
            ease : "cubic-bezier(0.140, 0.870, 0.385, 1.000)", // Options: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(0, 0, 0, 0)
            loop : 1, //
            scale : [1, 1, 1], // x, y, z
            opacity : 1, //
            rotate3d : [0, 0, 0, 0], // x, y, z, degrees
            perspective : 1000, //
            origin : [50, 50], // [top, left] in %
            delay : 0
        }; // end config
        if (settings) $.extend(config, settings);

        this.requestTick = function() {
            if (!self.ticking) {// raf optimization : don't call animate if raf has not executed yet
                requestAnimFrame(self.animate);
            }
            self.ticking = true;
        }; // end requestTick

        // insert inline styles for tartget and parent
        this.animate = function() {
            self.ticking = false;

            self.parent().css({
                //"-webkit-perspective" : config.perspective, //
                //"-webkit-perspective-origin" : config.origin[0] + "%" + config.origin[1] + "%" //
            });
            self.css({
                "-webkit-transform-style" : "preserve-3d", //
                "-webkit-transition-duration" : config.time + "ms", //
                "-webkit-animation-iteration-count" : config.loop, //
                "opacity" : config.opacity, //
                "-webkit-transition-timing-function" : config.ease, //
                "-webkit-transform" : "scale3d(" + config.scale[0] + ", " + config.scale[1] + ", " + config.scale[2] + ")" + //
                " translate3d(" + config.x + "px," + config.y + "px," + config.z + "px)" + //
                " rotate3d(" + config.rotate3d[0] + ", " + config.rotate3d[1] + ", " + config.rotate3d[2] + ", " + config.rotate3d[3] + "deg)" //
            });

            // execute callback @ end of transition based on time passed in
            if (config.time > 0) {
                setTimeout(function() {
                    if ( typeof (self.callback) === "function") {
                        self.callback();
                    }
                }, config.time + config.delay);
            };
        };// end animate

        // send the request to animate for each element
        this.each(function() {
            self.requestTick();
        });
        
        return this;
        
    }; // end xform

})(jQuery); 