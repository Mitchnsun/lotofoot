<?php
	$response = array();
	// initialize JSON (array php)
	
	try {
		require_once ('../connect_DB.php');
	} catch (Exception $e) {
		$response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
		echo json_encode($response);
		die();
	}
	
	session_start();
	
	$id_game = $_POST['id_game'];
	$today = time();
	
	$querygame = "SELECT * FROM games WHERE id_game=:id_game";
	$req = $bdd -> prepare($querygame) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
	$req -> execute(array('id_game' => $id_game));
	$result = $req -> fetch();
	
	if ($today > $result['schedule']) {
		$response['today'] = $today;
		$response['schedule'] = $result['schedule'];
		$response['status'] = 403;
		$response["errorCode"] = "data_forbidden";
		echo json_encode($response);
		exit();
	}
	
	if ($_POST['userid'] == $_SESSION['userid']) {
		$scoreA = $_POST['scoreA'];
		$scoreB = $_POST['scoreB'];
		$userid = $_SESSION['userid'];
		$winner = isset($_POST['winner'])?$_POST['winner']:'';
	
		$query = "UPDATE pronos SET scoreA=:scoreA, scoreB=:scoreB, penalties=:winner, prono_date=:prono_date WHERE id_game=:id_game AND userid=:userid";
		$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
		$req -> execute(array(
				'userid' => $userid,
				'id_game' => $id_game,
				'scoreA' => $scoreA,
				'scoreB' => $scoreB,
				'winner' => $winner,
				'prono_date' => $today
		));
	
		$response['status'] = 200;
	
	} else {// Different user, not authorized
		$response['status'] = 401;
		$response["errorCode"] = "Wrong_User";
	}
	// return the JSON
	echo json_encode($response);
?>