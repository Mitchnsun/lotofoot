<?php
	$response = array();
	
	try{
		require_once('connect_DB.php');
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
	
	if(isset($_POST['userEmail']) && isset($_POST['userPwd'])){
		$userEmail = $_POST['userEmail'];
		$userPwd = crypt($_POST['userPwd'],$userEmail);
		unset($_POST); // The password no exists in the session anymore
		
		$query = "SELECT userid, email, firstname, lastname, droit FROM users WHERE email = '$userEmail' AND pwd = '$userPwd'";
		$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array($userEmail,$userPwd));
		$count = $req -> rowCount();

		if($count == 1){
			session_start();
			$result = $req -> fetch();
			$_SESSION['userid'] = $result['userid'];
			$response['sessionid'] = session_id();
			$user = array(
				"userid" => $result['userid'],
				"email" => $result['email'],
				"firstname" => $result['firstname'],
				"lastname" => $result['lastname'],
				"droit" => $result['droit'],
			);
			$response['user'] = $user;
		}else{// No match found
			$response["errors"] = array("title" => "default", "errorCode" => "IncorrectLogin");
		}
	}else{
		$response["errors"] = array("title" => "default", "errorCode" => "EmptyLogIn");
	}
	
	echo json_encode($response);
?>