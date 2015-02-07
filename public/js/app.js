require(['page'],function(App) {
    var app = new App();
    $('a').each(function () {
        var hash = App.hash($(this).attr('href'));
        console.log(hash);
        var page = hash.substr(1);
        $.get(page, function (body) {
            $('body').append($(body).addClass('page').attr('id',page));
            app.get(hash, '#'+page)
        })
    });
    app.init();
})