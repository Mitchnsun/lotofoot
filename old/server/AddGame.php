<?php
	session_start();

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
	$userid = $_SESSION['userid'];
	
	$timeStamp = strtotime($schedule.' '.$hourSchedule.':'.$minuteSchedule.':00');
	//date("F j, Y, g:i a",$timeStamp);
	
	$query = "INSERT INTO games(id_teamA,id_teamB,schedule,addBy) VALUES(:teamA,:teamB,:schedule,:userid)";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array(
				'teamA' => $teamA,
				'teamB' => $teamB,
				'schedule' => $timeStamp,
				'userid' => $userid
		));
		
	echo '200';
?>