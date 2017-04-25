$(window).load(function () {

var size = 2;
var button = 1;
var button_class = "active-effect";
var $container = $('#gallery-content');
    
$container.isotope({itemSelector : '#gallery-content>div'});


function check_button(){
	$('.portfolio-category li').removeClass(button_class);
	if(button==1)
		$("#filter-all").addClass(button_class);
	if(button==2)
		$("#filter-mobile").addClass(button_class);
	if(button==3)
		$("#filter-desktop").addClass(button_class);
	if(button==4)
		$("#filter-web").addClass(button_class);
}
$("#filter-all").click(function() { $container.isotope({ filter: '.all' }); button = 1; check_button(); });
$("#filter-mobile").click(function() {  $container.isotope({ filter: '.mobile' }); button = 2; check_button();  });
$("#filter-desktop").click(function() {  $container.isotope({ filter: '.desktop' }); button = 3; check_button();  });
$("#filter-web").click(function() {  $container.isotope({ filter: '.web' }); button = 4; check_button();  });
check_button();
});