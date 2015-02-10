require(['util','page'],function(util, App) {
    var app = new App();
    app.init();

    $('a').each(function () {
        var hash = App.hash($(this).attr('href'));
        console.log(hash);
        var page = hash.substr(1);
        $.get(page, function (body) {
            $('body').append($(body).addClass('page').attr('id',page));
            app.get(hash, '#'+page)
        })
    });

    util.loadingEnd(false, function(){
        $('.x-cpt-menu1').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $('a', this).addClass('animated rubberBand');
        });
        $('.x-cpt-menu1').addClass('animated bounceInUp');
    });

});