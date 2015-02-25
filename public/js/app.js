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
        var page = App.route(hash).page;
        var id = App.route(hash).id;
        console.log(app);
        if(hash == ""){
            return false;
        }
        if(!$('#' + page).length){
            loadPage();
        }else if(id != ""){
            if($('#' + page).data('id') == id){
                window.location.href = href;
            }else{
               $('#' + page).remove();
               loadPage();
            }
        }else{
            window.location.href = href;
        }

        function loadPage(){
            util.loading();
            $.get(page+"?id=" + id, function (body) {
                $('.x-mask').before($(body).addClass('x-page').attr('id',page));
                if(id !== ""){
                    $('#'+page).data('id',id);
                }
                app.get(hash, '#'+page);
                util.loadingEnd();
                window.location.href = href;
            });
        }
    });

    // 初始化队列
    var init = {
        firstPage: function(){
            var hash = App.hash();
            var page = App.route(hash).page;
            var id = App.route(hash).id;
            if(hash == ""){
                end();
                return false;
            }
            $.get(page + (id == ""? "?" + id : ""), function (body) {
                $('.x-mask').before($(body).addClass('x-page').attr('id',page));
                if(id !== ""){
                    $('#'+page).data('id',id);
                }
                var now = app.get(hash, '#'+page);
                app.current = now;
                now.show(0);
                var id = page;
                if($('#'+id).hasClass('x-cpt-hasBottomBar')){
                    $('#' + $('#'+id).data('bbar')).show();
                }else{
                    $('.x-cpt-bottomBar').hide();
                }
                $('.baiduServiceBottomBar').attr('style', 'display: none !important;');

                end();
            });
            function end(){
                util.loadingEnd(false, function(){
                    $('.x-cpt-menu1').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $('a', this).addClass('animated rubberBand');
                    });
                    $('.x-cpt-menu1').addClass('animated bounceInUp');
                });
            }
        }
    };
    app.init();
    console.log(app);
    util.start(init);
});