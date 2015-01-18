<?php
  $response = array(); // initialize JSON (array php)
  $today = time();
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['rankings'] = array();
	
	$queryranking = "SELECT DISTINCT type, season FROM ranking WHERE 1 ORDER BY season ASC, type ASC";
	$req = $bdd -> prepare($queryranking) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute();
	while($result = $req -> fetch()){
		$ranking = array(
				'type' => $result['type'],
		    'season' => $result['season']
    );
		array_push($response['rankings'],$ranking);
	}
	
	// return the JSON
  echo json_encode($response);
?>