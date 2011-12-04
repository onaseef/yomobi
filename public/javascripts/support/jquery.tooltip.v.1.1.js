/**
*
*	simpleTooltip jQuery plugin, by Marius ILIE
*	visit http://dev.mariusilie.net for details
*
**/
(function($){

$.fn.simpletooltip = function(tooltipText,tooltipClassName){
	return this.each(function() {
		
		$this = $(this).unbind('.tooltip');
		if (tooltipText === false) return;
		tooltipClassName = tooltipClassName || '';

		var text = tooltipText || $this.attr("title");
		$this.attr("title", "");
		if(text != undefined) {
			$this
				.bind('mouseenter.tooltip',{ text:text, className:tooltipClassName },hoverInHandler)
				.bind('mouseleave.tooltip',{ text:text, className:tooltipClassName },hoverOutHandler)
				.bind('mousemove.tooltip',mousemoveHandler)
			;
		}
	});
};

var hoverInHandler = function (e) {
// alert('AHHHH '+e.data.text);
	var tipX = e.pageX + 12;
	var tipY = e.pageY + 12;
	$("body").append("<div id='simpleTooltip' class='" + e.data.className + 
									 "' style='position: absolute; z-index: 9999; display: none;'>" + e.data.text + "</div>");
	if ($.browser.msie) var tipWidth = $("#simpleTooltip").outerWidth(true);
	else var tipWidth = $("#simpleTooltip").width();
	$("#simpleTooltip").width(tipWidth);
	$("#simpleTooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
};

var hoverOutHandler = function (e) {
	$("#simpleTooltip").remove();
};

var mousemoveHandler = function (e) {
	var tipX = e.pageX + 12;
	var tipY = e.pageY + 12;
	var tipWidth = $("#simpleTooltip").outerWidth(true);
	var tipHeight = $("#simpleTooltip").outerHeight(true);
	if(tipX + tipWidth > $(window).scrollLeft() + $(window).width()) tipX = e.pageX - tipWidth;
	if($(window).height()+$(window).scrollTop() < tipY + tipHeight) tipY = e.pageY - tipHeight;
	$("#simpleTooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
};

})(jQuery);