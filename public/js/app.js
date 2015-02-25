require(['util','page'],function(util, App) {
    var app = new App();


    // $('a.x-jump').each(function () {
    //     var hash = App.hash($(this).attr('href'));
    //     console.log(hash);
    //     var page = hash.substr(1);
        // if(hash == ""){
        //     return false;
        // }
        // if(!$('#' + page).length){
        //     $.get(page, function (body) {
        //         $('.x-mask').before($(body).addClass('x-page').attr('id',page));
        //         app.get(hash, '#'+page);
        //     });
        // }
    // });
    
    $('body').on('click', 'a.x-jump', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        var hash = App.hash(href);
        console.log(hash);
        var page = hash.substr(1);
        if(hash == ""){
            return false;
        }
        if(!$('#' + page).length){
            util.loading();
            $.get(page, function (body) {
                $('.x-mask').before($(body).addClass('x-page').attr('id',page));
                app.get(hash, '#'+page);
                util.loadingEnd();
                window.location.href = href;
            });
        }else{
            window.location.href = href;
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
            $('body').on('click', '.x-btn-back', function(event) {
                event.preventDefault();
                window.history.go(-1);
            });
        }
    };
    app.init();
    console.log(app);
    util.start(init);
});