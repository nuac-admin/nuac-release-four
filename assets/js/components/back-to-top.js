if ( ($(window).height() + 100) < $(document).height() ) {
    $('#top-link-block').removeClass('hidden').affix( {
        // how far to scroll down before link "slides" into view
        offset: {top:100}					} );
};
$('#backToTopBtn').click(function(){
    $('html,body').animate({scrollTop:0},'slow');return false;
});