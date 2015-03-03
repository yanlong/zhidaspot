define(function() {
  var clsname = '.x-mask';

  return {
    loading: function(fn){
      fn && fn();
      $(clsname).css('display','block');
      $(clsname + '-loading').css('display','block');
    },
    loadingEnd: function(stop, fn){
      $(clsname + '-loading').css('display','none');
      $(clsname).css('background','rgba(0,0,0,.5)');
      !stop && $(clsname).css('display','none');
      fn && fn();
    },
    start: function(queue){
      for(var i in queue){
        queue[i]();
      };
    },
    _pageInit: function(page){
        var list = {
            getQQwithTel:function(){
              console.log($('#bbar1').find('[data-for-qq]'));
              $('#bbar1').find('[data-for-qq]').attr("href", 'http://wpa.qq.com/msgrd?v=3&uin=' + $("#"+page).data("qq") + '&site=qq&menu=yes');
              $('#bbar1').find('[data-for-tel]').attr("href", 'tel:' + $("#"+page).data("tel"));
            },
            test2:function(){
              
            }
        };
        return list;
    }
  }
});