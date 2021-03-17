$(function() {
  // Only set the timer if you have a hash
  if(window.location.hash) {
    setTimeout(delayedFragmentTargetOffset, 500);
  }
});
// add scroll offset to fragment target (if there is one)
function delayedFragmentTargetOffset() {
  var offset = $(':target').offset();
  if(offset){
    var scrollto = offset.top - 120; // minus fixed header height
    $('html, body').animate({scrollTop:scrollto}, 0);
  }
};