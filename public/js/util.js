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
    }
  }
});