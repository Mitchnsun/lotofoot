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
  
  if ($_POST['userid'] != $_SESSION['userid']) {
  	// Different user, not authorized
    $response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
		echo json_encode($response);
		die();
  }
	
  $response['status'] = 200;
  $today = time();
  $id_bonus = $_POST['id'];
  $choices = $_POST['choices'];
  $userid = $_SESSION['userid'];
	
	$querybonus = "SELECT * FROM bonus WHERE id_bonus=:id";
	$request = $bdd -> prepare($querybonus) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
  $request -> execute(array('id' => $id_bonus));
  
  if(!$bonus = $request -> fetch()){
  	// This bonus doesn't exist
  	$response['status'] = 500;
  	$response['errorCode'] = "data_existence";
    echo json_encode($response);
    die();
  }
  
  if(count($choices) < $bonus['top']){
    $response['errorCode'] = "teamsBonus_errorMsg";
    echo json_encode($response);
    die();
  }
  if($today > $bonus['dead_line']){
    $response['errorCode'] = "timeBonus_errorMsg";
    echo json_encode($response);
    die();
  }

  $query = "SELECT count(*) FROM pronos_bonus WHERE userid=:userid AND id_bonus=:id_bonus";
  $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
  $req -> execute(array('userid' => $userid, 'id_bonus' => $id_bonus));
  $result = $req -> fetch();
  
  if ($result['count(*)'] == 0) {
    $query = "INSERT INTO pronos_bonus (id_bonus,userid,first,second,third,fourth,fifth,at) VALUES (:id_bonus,:userid,:first,:second,:third,:fourth,:fifth,:at)";
    $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
    $req -> execute(array(
      'id_bonus' => $id_bonus,
      'userid' => $userid,
      'first' => $choices['first'],
      'second' => $choices['second'],
      'third' => $choices['third'],
      'fourth' => $choices['fourth'],
      'fifth' => $choices['fifth'],
      'at' => $today
    ));
  } else{
    $query = "UPDATE pronos_bonus SET first=:first, second=:second, third=:third, fourth=:fourth, fifth=:fifth, at=:at WHERE userid=:userid AND id_bonus=:id_bonus";
    $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
    $req -> execute(array(
      'id_bonus' => $id_bonus,
      'userid' => $userid,
      'first' => $choices['first'],
      'second' => $choices['second'],
      'third' => $choices['third'],
      'fourth' => $choices['fourth'],
      'fifth' => $choices['fifth'],
      'at' => $today
    ));
  }

  // return the JSON
  echo json_encode($response);
?>