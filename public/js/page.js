define(function(require) {

    function Page(hash, el) {
        this.$el = $(el);
        this.hash = hash;
        this.$el.hide();
    }

    Page.prototype.show = function(duration) {
        this.showAnimation(duration);
    }

    Page.prototype.hide = function(duration) {
        this.hideAnimation(duration);
    }

    Page.prototype.handleShowComplete = function() {
        this.$el.css({
            "-webkit-transition": "",
            "-webkit-transform": "",
            position: ""
        });
        $("html").css({
            overflowX: ""
        });
    };

    Page.prototype.showAnimation = function(duration) {
        this.scrollTop = document.body.scrollTop;
        var e = $(window).width();
        this.$el.css({
            display: "block",
            zIndex: 250,
            position: "fixed",
            "-webkit-transform": "translateX(" + e + "px)",
            "transform": "translateX(" + e + "px)",
            "-ms-transform": "translateX(" + e + "px)"
        });
        this.$el.size() && this.$el.get(0).clientLeft;
        this.$el.css({
            "-webkit-transition": ".3s -webkit-transform ease-in-out",
            "-webkit-transform": "none",
            "transition": ".3s transform ease-in-out",
            "transform": "none",
            "-ms-transition": ".3s -webkit-transform ease-in-out",
            "-ms-transform": "none"
        });
        setTimeout($.proxy(this.handleShowComplete, this), duration)
    };

    Page.prototype.hideAnimation = function(duration) {
        var n = $(window).width();
        this.$el.css({
            "-webkit-transform": "none",
            "transform": "none",
            "-ms-transform": "none"
        });
        this.$el.size() && this.$el.get(0).clientLeft;
        this.$el.css({
            "-webkit-transition": ".3s -webkit-transform ease-in-out",
            "-webkit-transform": "translateX(" + n + "px)",
            "transition": ".3s transform ease-in-out",
            "transform": "translateX(" + n + "px)",
            "-ms-transition": ".3s -webkit-transform ease-in-out",
            "-ms-transform": "translateX(" + n + "px)"
        });
        window.scrollTo(0, this.scrollTop);
        setTimeout($.proxy(this.handleHideComplete, this), duration)
    }

    function App() {
        this.pages = {};
        this.current = null;
    }

    Page.prototype.handleHideComplete = function() {
        this.$el.hide();
        $("html").css({
            overflowX: ""
        });
    };

    App.prototype.get = function(hash, el) {
        this.pages[hash] = new Page(hash, el);
    }

    App.prototype.init = function() {
        var self = this;
        var duration = 300;
        window.onhashchange = function(e) {
            var hash = App.hash();
            var pages = self.pages;
            if (!hash || !pages[hash]) {
                // hide current
                self.current && self.current.hide(duration);
                self.current = null;

                $('.x-cpt-bottomBar').hide();
                
            } else {
                // hide current 
                self.current && self.current.hide(duration);
                pages[hash].show(duration); // show targe

                //for bottomBar
                var id = App.route(hash).page;
                if($('#'+id).hasClass('x-cpt-hasBottomBar')){
                    $('#' + $('#'+id).data('bbar')).show();
                }else{
                    $('.x-cpt-bottomBar').hide();
                }
                $('.baiduServiceBottomBar').attr('style', 'display: none !important;');

                self.current = pages[hash];
            }
        }

        $(window).trigger('hashchange');
    }

    App.hash = function (url) {
        url = url || location.href;
        var hash = url.lastIndexOf('#') !== -1 ? url.substr(url.lastIndexOf('#')+1) : '';
        return hash;
    }

    App.route = function (hash) {
        var ar = hash.substr(1).split('/');
        return {
            "page": ar[0],
            'id': ar[1] || ""
        };
    }

    return App;
})
