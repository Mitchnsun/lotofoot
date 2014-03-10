<?php
	/* Production */
	$host = 'localhost';
	$db_name = 'lotofoot';
	$db_login = 'LotoFoot';
	$db_pwd = 'mySQLdikwLotoFoot';
    
    /* Development */
    /*$host = 'localhost';
    $db_name = 'LotoFoot';
    $db_login = 'root';
    $db_pwd = '';*/
	
	try{
		$bdd = new PDO('mysql:host='.$host.';dbname='.$db_name,$db_login,$db_pwd);
	}
	catch(Exception $e){
		$response = array(
			"status" => 500,
			"errorCode" => "BD",
			"files" => "connect_DB.php",
			"message" => $e->getMessage()
		);
		echo json_encode($response);
		die();
	}
?>