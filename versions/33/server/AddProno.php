<?php
	session_start();
	
	try{
		require_once('connect_DB.php');
	}
	catch (Exception $e){
		die('Error in AddProno.php - try require connect_DB.php : '.$e->getMessage());
	}
	
	$id_game = $_POST['id_game'];
	$scoreA = $_POST['scoreA'];
	$scoreB = $_POST['scoreB'];
	$userid = $_SESSION['userid'];

	$today = time();
	
	$query = "INSERT INTO pronos(userid,id_game,scoreA,scoreB,prono_date) VALUES(:userid,:id_game,:scoreA,:scoreB,:prono_date)";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array(
				'userid' => $userid,
				'id_game' => $id_game,
				'scoreA' => $scoreA,
				'scoreB' => $scoreB,
				'prono_date' => $today
		));
		
	echo '200';
?>