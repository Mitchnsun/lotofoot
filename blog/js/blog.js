var urlHTMLDefault = 'version/blogv0.2.html';

/* DOM Ready and events function */
$(document).ready(function(){
	
	// Initialize
	$.ajax(urlHTMLDefault).done(function(data){
		$('div.content').html(data);
	});
	
	// Events
	$('.version-button').click(function(e){
		events.versionButton(e);
	});
});

// Handle click callback
var events = {
	versionButton : function(e){
		e.preventDefault();
		var url = 'version/blogv' + $(e.currentTarget).attr('ref') + '.html';
		$.ajax(url).done(function(data){
			$('div.content').html(data);
		});
	}
};