<?php
  $response = array(); // initialize JSON (array php)
  $today = time();
	$type = $_GET['type'];
	$season = $_GET['season'];
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$rank = 1;
	
	$queryranking = "SELECT userid FROM ranking WHERE type=:type AND season=:season ORDER BY score DESC, prediction DESC, loss ASC, displayName ASC";
	$req = $bdd -> prepare($queryranking) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute(array("type" => $type, "season" => $season));
	while($result = $req -> fetch()){
		$queryrank = "UPDATE ranking SET rank = :rank WHERE userid = :userid AND type=:type AND season=:season";
		$request = $bdd -> prepare($queryrank) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$request -> execute(array("rank" => $rank, "userid" => $result['userid'], "type" => $type, "season" => $season));
		$rank++;
	};
	
	$response['last_rank'] = $rank;
	// return the JSON
  echo json_encode($response);
?>