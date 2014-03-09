$(document).ready(function() {
    $( "#schedule" ).datepicker({ dateFormat: "yy-mm-dd" });
});

function addProno(){
	
	$.post('server/AddGame.php',{schedule:$("#schedule").val(),hourSchedule:$("#hourSchedule").val(),
	minuteSchedule:$("#minuteSchedule").val(),teamA:$("#teamA").val(),teamB:$("#teamB").val()}, function(msg){
		if(msg == '200'){
			$("#AddProno").modal('hide');
			$("#schedule").val('');
			$("#hourSchedule").val('');
			$("#minuteSchedule").val('');
			$("#teamA").val('');
			$("#teamB").val('');
		}
	});

}

function updateProno(){
	$.post('server/tablePronos.php',function(data){
		$("#pronosToDo").html(data);
	});
}

function updateLastProno(){
	$.post('server/lastPronos.php',function(data){
		$("#lastPronos").html(data);
	});
}

function bet(){
	var pronos = $(".rowGame");
	var scores = $(".selectScore");
	for(i = 0; i<pronos.length; i++){
		$.post('server/AddProno.php',{id_game : $(pronos[i]).attr('ref'), scoreA : $(scores[i*2]).val(), scoreB : $(scores[i*2+1]).val()},
		function(msg){
			if(msg == '200'){
				updateProno();
				updateLastProno();
			}
		});
	}
}