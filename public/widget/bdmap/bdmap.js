define(function () {
  return {
    parseAddr: function (str) {
        if (str === '') {
            return '';
        }
        return str.split('_')[1];
    },
    navGuide: function(){
      var $mpMap = $('.mp-map');
      var parseAddr = this.parseAddr;
      var mapInfo = $mpMap.data('info');
      var address = mapInfo.address;
      var street = address.street;
      var addr = parseAddr(address.province) + parseAddr(address.city) + parseAddr(address.regional);
      var location = mapInfo.point.lng + ',' + mapInfo.point.lat;
      var width = $('.mp-map').width();
      var dom = [
          '<img src="http://api.map.baidu.com/staticimage',
          '?width=' + (width-2),
          '&height=172',
          '&center=' + location,
          '&markers=' + location,
          '&zoom=14',
          '&markerStyles=-1,',
          'http://s1.map.bdimg.com/components/static/components/elements/lbs-map/images/marker_b6b848e.png,',
          '-1&scale=2" style="width:' + (width-2) + 'px',
          '">'
      ];
      
      $mpMap.append(dom.join('', ','));

      var mapurl = [
          'http://api.map.baidu.com/marker',
          '?location=' + mapInfo.point.lat + ',' + mapInfo.point.lng,
          '&title=' + street,
          '&content=' + addr,
          '&output=html&src=lbscomponents|lbscomponents'
      ];
      //百度框内不显示地图顶导
      if ($mpMap.data('box')) {
          mapurl.push('&hidenav=1');
      }

      $('.start-routes').attr('href', encodeURI(mapurl.join('', ',')));
    }
  }
});