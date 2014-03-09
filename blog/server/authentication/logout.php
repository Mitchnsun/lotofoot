<?php
	$response = array(); // initialize JSON (array php)

  session_start();
	
  if(session_destroy()){
    unset($_SESSION);
    $response['status'] = 200;
  }else{
    $response['status'] = 500;
  }

	// return the JSON
	echo json_encode($response);
?>