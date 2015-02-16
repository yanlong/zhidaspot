define(function() {
  var clsname = '.x-mask';

  return {
    loading: function(fn){
      fn && fn();
      $(clsname)
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
    parseAddr: function (str) {
        if (str === '') {
            return '';
        }
        return str.split('_')[1];
    }
  }
});