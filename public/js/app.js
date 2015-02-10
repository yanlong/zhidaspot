require(['util','page'],function(util, App) {
    var app = new App();
    app.init();

    $('a.x-jump').each(function () {
        var hash = App.hash($(this).attr('href'));
        console.log(hash);
        var page = hash.substr(1);
        if(hash == ""){
            return false;
        }
        if(!$('#' + page).length){
            $.get(page, function (body) {
                $('.x-mask').before($(body).addClass('x-page').attr('id',page));
                app.get(hash, '#'+page);

                require(['pages/' + page], function (mod) {
                    mod && mod();
                });
            });
        }
    });

    // 初始化队列
    var init = {
        pagePreview: function(){
            util.loadingEnd(false, function(){
                $('.x-cpt-menu1').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $('a', this).addClass('animated rubberBand');
                });
                $('.x-cpt-menu1').addClass('animated bounceInUp');
            });
        },
        backBtn: function (){
            $('body').on('click', '.btn-back', function(event) {
                event.preventDefault();
                window.history.go(-1);
            });
        }
    };
    util.start(init);
});