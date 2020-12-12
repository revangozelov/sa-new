(function ($) {
	'use strict';

  // slide time interval
      $('#myCarousel').carousel({
    interval: 7000,
 });
      // Aos plugin
      AOS.init();

      // back to top
      $(window).scroll(function(){
    if($(this).scrollTop()>100){
      $(".back-to-top").fadeIn();
    }else{
      $(".back-to-top").fadeOut();
    }
  });
  $(".back-to-top").click(function(){
    $("html, body").animate({scrollTop:0},1000)
  })

	// Sticky Menu
	$(window).scroll(function () {
		var height = $('.top-header').innerHeight();
		if ($('header').offset().top > 10) {
			$('.top-header').addClass('hide');
			$('.navigation').addClass('nav-bg');
			$('.navigation').css('margin-top', '-' + height + 'px');
		} else {
			$('.top-header').removeClass('hide');
			$('.navigation').removeClass('nav-bg');
			$('.navigation').css('margin-top', '-' + 0 + 'px');
		}
	});

	//Hero Slider
	$('.hero-slider').slick({
		autoplay: true,
		autoplaySpeed: 7500,
		pauseOnFocus: false,
		pauseOnHover: false,
		infinite: true,
		arrows: true,
		fade: true,
		prevArrow: '<button type=\'button\' class=\'prevArrow\'><i class=\'ti-angle-left\'></i></button>',
		nextArrow: '<button type=\'button\' class=\'nextArrow\'><i class=\'ti-angle-right\'></i></button>',
		dots: true
	});
	$('.hero-slider').slickAnimation();


	



 
})(jQuery);



