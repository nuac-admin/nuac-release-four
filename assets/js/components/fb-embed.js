//Resize Facebook feed
$(window).on('resize', function () {
  setTimeout(function () { changeFBPagePlugin() }, 500);
});

$(window).on('load', function () {
  setTimeout(function () { changeFBPagePlugin() }, 1500);
});

changeFBPagePlugin = function () {
  var container_width = Number($('.fb-container').width()).toFixed(0);
  var container_height = Number($('.fb-container').height()).toFixed(0);
  if (!isNaN(container_width) && !isNaN(container_height)) {
    $(".fb-page").attr("data-width", container_width).attr("data-height", container_height);
  }
  if (typeof FB !== 'undefined') {
    FB.XFBML.parse();
  }
};