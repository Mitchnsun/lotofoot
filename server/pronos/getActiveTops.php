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
	$userid = $_GET['userid'];
	
	if($userid != $_SESSION['userid']){
		$response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
		echo json_encode($response);// return the JSON
		die();
	}
	
	// Get Bonus
	$querybonus = "SELECT * FROM bonus WHERE dead_line > :today";
	$reqbonus = $bdd -> prepare($querybonus) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
	$reqbonus -> execute(array("today" => $today));
	
	$response['bonus'] = array();
	
	while($result = $reqbonus -> fetch()){
		$bonus = array(
			"id_bonus" => $result['id_bonus'],
			"table_link" => $result['table_link'],
			"dead_line" => $result['dead_line'],
			"schedule" => date('d/m/Y',$result['dead_line']),
			"scheduleTime" => date('G',$result['dead_line']).'h'.date('i',$result['dead_line']),
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
		
		$query = "SELECT * FROM pronos_bonus WHERE id_bonus = :id_bonus AND userid = :userid ORDER BY at DESC";
		$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $bdd->errorInfo())));
	  $req -> execute(array(
	  		"id_bonus" => $bonus['id_bonus'],
	  		"userid" => $userid
	  ));
		
	  if($data = $req -> fetch()){
	    $prono = array(
	    	"id_prono" => $data['id'],
	      "schedule" => date('d/m/Y',$data['at']),
				"scheduleTime" => date('G',$data['at']).'h'.date('i',$data['at']),
	      "first" => $data['first'],
	      "second" => $data['second'],
	      "third" => $data['third'],
	      "fourth" => $data['fourth'],
	      "fifth" => $data['fourth'],
	      "validation" => $data['validation'],
	      "points" => $data['points']
	    );
		
			$bonus['prono'] = $prono;
  	}
  	
		array_push($response['bonus'], $bonus);
	}
	
	$response['time'] = $today;
	
  echo json_encode($response);// return the JSON
?>