<?php
  $response = array(); // initialize JSON (array php)
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	session_start();
  
  if (!isset($_SESSION['userid'])) {// No session exists. Data only available by authentication
    $response['status'] = 401;
    echo json_encode($response);
    exit();
  }else {
  	$response['status'] = 200;
  	$games = $_POST['games'];	
  }
	
	// return the JSON
  echo json_encode($response);
?>