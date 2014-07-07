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
  
  $response['status'] = 200;
  $today = time();
  $id_bonus = $_GET['id_bonus'];
	
	// Get Bonus
	$querybonus = "SELECT * FROM bonus WHERE id_bonus=:id_bonus";
	$reqbonus = $bdd -> prepare($querybonus) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
	$reqbonus -> execute(array("id_bonus" => $id_bonus));
	$result = $reqbonus -> fetch();
	$response['bonus'] = array(
		"id_bonus" => $result['id_bonus'],
		"name" => $result['name'],
		"id_description" => $result['id_description'],
		"table_link" => $result['table_link'],
		"dead_line" => $result['dead_line'],
		"ready" => $result['ready'],
		"top" => $result['top'],
		"first" => $result['first'],
		"second" => $result['second'],
		"third" => $result['third'],
		"fourth" => $result['fourth'],
		"fifth" => $result['fifth'],
		"type" => $result['type'],
		"season" => $result['season']
	);
	
  $response['pronos'] = array();

  $query = "SELECT * FROM pronos_bonus p INNER JOIN users u ON p.userid = u.userid WHERE p.id_bonus = :id_bonus ORDER BY p.at DESC";
	$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
  $req -> execute(array("id_bonus" => $id_bonus));
  while($data = $req -> fetch()){
    $prono = array(
      "schedule" => date('d/m/Y',$data['at']),
			"scheduleTime" => date('G',$data['at']).'h'.date('i',$data['at']),
      "first" => $data['first'],
      "second" => $data['second'],
      "third" => $data['third'],
      "fourth" => $data['fourth'],
      "userid" => $data['userid'],
      "displayName" => utf8_encode($data['firstname']).' '.utf8_encode($data['lastname'])
    );
		
		array_push($response['pronos'], $prono);
  }
	
  echo json_encode($response);// return the JSON
?>