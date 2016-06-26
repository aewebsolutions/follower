/**
 * Follower JQuery Plugin. 
 * Define an element as follower and see it always.
 * Copyright Angel Espro 2015 - http://www.aesolucionesweb.com.ar
 * 
 * If there were more than one follower, they must be absolute or fixed positioned by default
 * 
 * Methods: 
 *  play, stop, update
 *  
 * Events (Jquery events):
 *  followerResize(e)
 *  followerGetTop(e)
 *  followerGetBottom(e)
 *  followerReady(e, instance)
 *  followerStop(e, instance)
 *  followerPlay(e, instance)
 */
;
(function ($) {

    function Follower(el, options) {
        this.el = el instanceof $ ? el : $(el);
        if (this.el.length === 0)
            return;

        this.parent;
        this.notFollowClassname = 'notfollow';
        this.minTop;
        this.maxTop;
        this.height;
        this.originalTop = null;
        this.originalLeft = null;
        this.following = false;

        var defaults = {
            center: false, // center content in the middle of container
            padding: 0, //padding top when scrolling
            breakpoint: 900, //in px. Set a max value for stop following
            height : '' //e.g., '100%', '200px', '10em' 
        }
        this.settings = $.extend(true, {}, defaults, options);

        //private properties
        var self = this,
            $body = $('body'),
            $window = $(window);

        //private methods
        var init = function () {
            self.parent = self.el.offsetParent();
            
            setOriginalPosition();
            
            if($window.width() < self.settings.breakpoint)
                self.following = true;
            
            addContext();
            self.update();
            $window.on('resize', onResizing);
            self.el.trigger('followerReady', self);
        };
        
        var setOriginalPosition = function(){
            var inStyle = self.el[0].style.position;
            var pos = self.el.css('position');
            if(pos !== 'absolute'){
                self.el.css('position', 'absolute');
                self.originalTop = parseInt(self.el.css('top')) || 0;
                self.originalLeft = parseInt(self.el.css('left')) || 0;
                self.el[0].style.position = inStyle ? inStyle : '';
            }else{
                self.originalTop = parseInt(self.el.css('top')) || 0;
                self.originalLeft = parseInt(self.el.css('left')) || 0;
            }
            console.log(self.originalLeft)
        };
        
        var onResizing = function () {
            if (self.el.data('resizefollower'))
                clearTimeout(self.el.data('resizefollower'));
            var timeout = setTimeout(function () {
                self.update();
                self.el.removeData('resizefollower');
            }, 300);
            self.el.data('resizefollower', timeout);
        };
        
        var addContext = function () {
            self.el.addClass('follower');
            if (self.settings.center)
                self.el.addClass('follower-center-content');
            self.el.wrapInner('<div class="follower-content"></div>').wrapInner('<div class="follower-content-wr"></div>');
            if (self.settings.scroll)
                self.el.addClass('follower-scroll');
        };

        //public methods
        this.update = function(){
            if ($window.width() < self.settings.breakpoint) {
                if (self.following === true)
                    self.stop();
                return false;
                
            } else if (self.following === false) {
                self.play();
            }
            
            self.setSize();
            self.setPosition();
        };
        
        
        this.close = function (callback) {
            $window.off('scroll', self.setPosition);
            self.el.detach();
            if (typeof callback === 'function')
                callback();
        };

        /**
         * stop following.
         */
        this.stop = function () {
            self.following = false;
            $window.off('scroll', self.setPosition);
            self.el.removeClass('fixed').addClass('not-following');
            self.el.attr('style', '')
            
            self.el.trigger('followerStop', self)
        }
        /**
         * start following.
         */
        this.play = function () {
            self.following = true;
            self.el.removeClass('not-following');
            self.setSize();
            self.setPosition();
            $window.on('scroll', self.setPosition);
            
            self.el.trigger('followerPlay', self)
        };
        
        this.setPosition = function () {
            var scrollTop = $body.scrollTop();
            
            if (scrollTop > self.maxTop) {
                if (self.el.hasClass('fixed'))
                    self.el.trigger('followerGetBottom');
                self.el.removeClass('fixed');
                self.el.css({
                    position: 'absolute', 
                    top: self.maxTop - self.parent.offset().top + self.settings.padding,
                    left : self.originalLeft
                });

            } else if (scrollTop > self.minTop){
                if(!self.el.hasClass('fixed')) {
                    self.el.addClass('fixed');
                    self.el.css({
                        position: 'fixed',
                        top: self.settings.padding,
                        left : self.originalLeft + self.parent.offset().left + parseInt(self.parent.css('border-left-width'))
                    });
                }
            
            } else if(scrollTop <= self.minTop){
                if(self.el.hasClass('fixed')) 
                    self.el.trigger('followerGetTop');
                
                self.el.removeClass('fixed');
                self.el.css({
                    position: 'absolute',
                    top: self.originalTop, 
                    left : self.originalLeft
                });
            }

        };
        
        this.setSize = function () {
            var pH = self.parent.outerHeight(),
                parentTop = self.parent.offset().top,
                wH = $window.height(),
                contentH = self.el.find('.follower-content').outerHeight();

            //Define properties: minTop, height and maxTop
            self.minTop = parentTop + self.originalTop - self.settings.padding + parseInt(self.parent.css('border-top-width'));
            
            var heightString = $.trim(self.settings.height);
            var heightNum = parseInt(heightString);
            
            if(heightString !== '' && heightNum){
                var isInPercentage = heightString.substr(heightString.length - 1) === '%';
                
                if(isInPercentage){
                    var fullHeight = wH - self.settings.padding;
                    var maxHeight = fullHeight * heightNum/100;
                    self.height = (maxHeight < pH) ? maxHeight : pH;
                    if (self.height - contentH < 0 && !self.settings.scroll)
                        self.height = contentH;
                    
                    console.log('self.height: '+self.height )
                }else{
                    self.height = heightString;
                }
            }else {
                self.height = self.el.height();
            }

           
            self.maxTop = pH + parentTop - self.el.height() - self.originalTop - self.settings.padding - parseInt(self.parent.css('border-top-width')) - parseInt(self.parent.css('border-bottom-width'));
            

            //Set Css
            self.el.height(self.height);
            //self.el.css('top', self.minTop);

            self.el.trigger('followerResize');
        }
        
        //Auto init
        init();
    }

    //jQuery Plugin

    var pluginName = 'follower';
    var Plugin = Follower;

    $.fn[pluginName] = function (options) {
        var args = arguments;
        
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            if(options === 'instance'){
                if(!this.length)
                    return null;
                return $.data(this[0], pluginName);
            }
            
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                var instance = $.data(this[0], pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            
            } else {
                return this.each(function () {
                    var instance = $.data(this, pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };
    $.fn[pluginName].getters = [];

})(jQuery);