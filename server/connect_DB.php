<?php
	$host = 'localhost';
	$db_name = 'LotoFoot';
	$db_login = 'LotoFoot';
	$db_pwd = 'mySQLdikwLotoFoot';
	
	try{
		$bdd = new PDO('mysql:host='.$host.';dbname='.$db_name,$db_login,$db_pwd);
	}
	catch(Exception $e){
		$response = array(
			"status" => 500,
			"errorCode" => "BD",
			"message" => $e->getMessage()
		);
		echo json_encode($response);
		die();
	}
?>