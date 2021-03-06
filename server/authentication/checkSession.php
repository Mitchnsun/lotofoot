<?php
	$response = array(); // initialize JSON (array php)
	
	try{
		require_once('../connect_DB.php');
	}
	catch (Exception $e){
		$response = array(
			"status" => 500,
			"errorCode" => "BD",
			"message" => $e->getMessage()
		);
		echo json_encode($response);
		die();
	}
	
	$response['status'] = 200;
	$today = time();
	
	$userid = $_POST['userid'];
	$sessionid = $_POST['sessionid'];
	
	/* Retrieve user information and check if the session id matches */
	$query = "SELECT userid, email, firstname, lastname, accreditation, sessionid, connectedAt FROM users WHERE userid = :userid AND sessionid = :sessionid";
	$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute(array("userid" => $userid,"sessionid" => $sessionid));
	$count = $req -> rowCount();
	
	if($count == 1){ // the session is retrieved
		$result = $req -> fetch();
		session_start(); // The session is retrieved but a new session id was created
		$_SESSION['userid'] = $userid;

		$user = array(
			"userid" => $result['userid'],
			"email" => $result['email'],
			"firstname" => utf8_encode($result['firstname']),
			"lastname" => utf8_encode($result['lastname']),
			"accreditation" => $result['accreditation'],
			"lastLogedIn" => $result['connectedAt'],
			"sessionid" => $result['sessionid']?$result['sessionid']:session_id(),
			"connectedAt" => $today
		);
		
		$response['user'] = $user;
		$response['sessionRetrieve'] = true;
			
		/* Update user information : the date of connexion */
		$query = "UPDATE users SET connectedAt = :time, sessionid = :sessionid WHERE userid = :userid";
		$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array(
				"time" => $user['connectedAt'],
				"sessionid" => $user['sessionid'],
				"userid" => $user['userid']
		));
	}else{ // No Session found
		$response["errors"] = array("title" => "default", "errorCode" => "NoSessionFound");
		$response['sessionRetrieve'] = false;
	}
	
	// return the JSON
	echo json_encode($response);
?>