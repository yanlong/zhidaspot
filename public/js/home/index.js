require(['home/utils','/widget/onepage-scroll/onepage-scroll.min.js'],function(util, onePage) {

  var animateList = {
    "page1": {
      'reset':function(){  
        
      },
      'go': function(){
        $('.p1-title1-img').css('opacity','0');
        // $('.p1-light-img').css('backgroundPosition',"-280px center");
        $('.p1-title1-img').animate({
          opacity: 1,
          },
          5000, "swing", function() {
            // $('.p1-light-img').animate({
            //   backgroundPosition: "0 50%",
            //   },
            //   5000, function() {
            //   /* stuff to do after animation is complete */
            // });
          // $('.p1-light-img').css('style',"background-position: 0 center; -webkit-transition-property: background-position; transition-property: background-position; -webkit-transition-duration: 5s; transition-duration: 5s;");
        });
      }
    },
    "page2": {
      'reset':function(){

      },
      'go': function(){

      }
    }
  };

  var isIE=!!window.ActiveXObject;
  !isIE && !function(){
    $(".main").onepage_scroll({
       sectionContainer: ".page",
       easing: "ease", 
       animationTime: 1000,
       pagination: true,
       updateURL: false,
       direction: "vertical",
       beforeMove: function(index) {
        console.log(index);
       },
       afterMove: function(index) {
        console.log(index);
       },
       loop: false,
       keyboard: true,
       responsiveFallback: false
    });
    
  }();

  util.loadingEnd();
  animateList['page1'].go();

});