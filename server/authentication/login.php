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
	
	if(isset($_POST['userEmail']) && isset($_POST['userPwd'])){
		$userEmail = strtolower($_POST['userEmail']);
		$userPwd = crypt($_POST['userPwd'],$userEmail);
		unset($_POST); // The password no exists in the session anymore
		
		/* Check user and password in the databse and retrieve the user information */
		$query = "SELECT userid, email, firstname, lastname, accreditation, connectedAt FROM users WHERE email = :userEmail AND pwd = :userPwd";
		$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
		$req -> execute(array("userEmail" => $userEmail,"userPwd" => $userPwd));
		$count = $req -> rowCount();

		if($count == 1){ // the user and pwd are correct
			session_start();
			$result = $req -> fetch();
			$_SESSION['userid'] = $result['userid'];
			$user = array(
				"userid" => $result['userid'],
				"email" => $result['email'],
				"firstname" => $result['firstname'],
				"lastname" => $result['lastname'],
				"accreditation" => $result['accreditation'],
				"lastLogedIn" => $result['connectedAt'],
				"sessionid" => session_id(),
				"connectedAt" => $today
			);
			$response['user'] = $user;
			
			/* Update user information : sessionid and the date of connexion */
			$query = "UPDATE users SET sessionid = :sessionid, connectedAt = :time WHERE userid = :userid";
			$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
			$req -> execute(array(
					"sessionid" => $user['sessionid'],
					"time" => $user['connectedAt'],
					"userid" => $user['userid']
			));
			
		}else{// No match found
			$response["errors"] = array("title" => "default", "errorCode" => "IncorrectLogin");
		}
	}else{ // missing mandatory fields
		$response["errors"] = array("title" => "default", "errorCode" => "EmptyLogIn");
	}
	
	// return the JSON
	echo json_encode($response);
?>