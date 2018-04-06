// main.js

(function() {

	$('.page-nav__hamburger').on('click', function() {
		console.log('clicking the link');
		$('.page-nav__ul').toggle();
	});

})();