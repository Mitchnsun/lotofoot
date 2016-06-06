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
	$response['errors'] = array();
	$today = time();
	$regex = '/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
	
	// POST Data
	$email = strtolower($_POST['email']);
	$password = crypt($_POST['password'],$email);
	$pseudo = $_POST['pseudo'];
	$firstname = $_POST['firstname'];
	$lastname = isset($_POST['lastname']) ? $_POST['lastname'] : $_POST['pseudo'];
	$accreditation = "Player";
	unset($_POST); // The password no exists in clear anymore
	
	// Check value
	if($email === '' || !preg_match($regex, $email)){
		array_push($response['errors'], 'email');
	}
	if($pseudo == "" && ($firstname == "" || $lastname == "")){
		array_push($response['errors'], 'username');
	}
	
	if(count($response['errors']) > 0){
		echo json_encode($response);
		die();
	}
	
	$checkquery = "SELECT email, pseudo FROM users WHERE email = :email OR (pseudo = :pseudo AND pseudo != '')";
	$req = $bdd -> prepare($checkquery) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
	$req -> execute(array("email" => $email,"pseudo" => $pseudo));
	$count = $req -> rowCount();
	
	if($count > 0){
		while($result = $req -> fetch()){
			if($email == $result['email']){
				array_push($response['errors'], 'email_exists');
			}
			if($pseudo == $result['pseudo']){
				array_push($response['errors'], 'username_exists');
			}
		}
	}else { // Account creation
		$query = "INSERT INTO users(email,pwd,pseudo,firstname,lastname,accreditation,joinAt) VALUES(:email,:pwd,:pseudo,:firstname,:lastname,:accreditation,:joinAt)";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array(
				'email' => $email,
				'pwd' => $password,
				'pseudo' => utf8_decode($pseudo),
				'firstname' => utf8_decode($firstname),
				'lastname' => utf8_decode($lastname),
				'accreditation' => $accreditation,
				'joinAt' => $today
		));
	}
	
	// return the JSON
	echo json_encode($response);
?>