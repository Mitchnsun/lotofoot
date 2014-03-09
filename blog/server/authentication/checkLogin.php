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
  
  session_start();
  
  $response['status'] = 200;
  $today = time();
  
  if (isset($_SESSION['userid'])) {
    $response['logged'] = true;
    $response['userid'] = $_SESSION['userid'];
  }
  else{
    $response['logged'] = false;
  }
  
  // return the JSON
  echo json_encode($response);
?>