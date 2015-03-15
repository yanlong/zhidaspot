require(['/widget/slider/idangerous.swiper.min.js', '/widget/bdmap/bdmap.js'], function (Swiper, bdmap) {
    $(function(){

      $('.swiper-container, .swiper-slide').css({
        'display': 'block',
        'width': $(window).width() + 'px',
        'height': '200px'
      });

      var mySwiper = $('.swiper-container').swiper({
        //Your options here:
        mode:'horizontal',
        loop: true,
        autoplay: 3000,
        pagination: '.pagination',
        //etc..
      });
    });

    bdmap.navGuide();
});
