<?php
	try{
		require_once('connect_DB.php');
	}
	catch (Exception $e){
		die('Error in AddProno.php - try require connect_DB.php : '.$e->getMessage());
	}
	
	$schedule = $_POST['schedule'];
	$hourSchedule = $_POST['hourSchedule'];
	$minuteSchedule = $_POST['minuteSchedule'];
	$teamA = $_POST['teamA'];
	$teamB = $_POST['teamB'];
	
	$timeStamp = strtotime($schedule.' '.$hourSchedule.':'.$minuteSchedule.':00');
	//date("F j, Y, g:i a",$timeStamp);
	
	$query = "INSERT INTO games(id_teamA,id_teamB,schedule) VALUES(:teamA,:teamB,:schedule)";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array(
				'teamA' => $teamA,
				'teamB' => $teamB,
				'schedule' => $timeStamp
		));
		
	echo '200';
?>