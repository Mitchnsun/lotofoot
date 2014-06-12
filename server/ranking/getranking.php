<?php
  $response = array(); // initialize JSON (array php)
  $today = time();
	$type = 'CM2014';
	$season = 2;
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['users'] = array();
	
	$queryranking = "SELECT * FROM ranking WHERE type=:type AND season=:season ORDER BY score DESC, prediction DESC, loss ASC, displayName ASC";
	$req = $bdd -> prepare($queryranking) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute(array("type" => $type, "season" => $season));
	while($result = $req -> fetch()){
		$user = array(
				'update' => date('d/m/Y',$result['at'])." ".date('G',$result['at']).'h'.date('i',$result['at']),
		    'at' => $result['at'],
		    'type' => utf8_encode($result['type']),
		    'rank' => $result['rank'],
		    'userid' => $result['userid'],
		    'displayName' => utf8_encode($result['displayName']),
		    'win' => $result['win'],
		    'draw' => $result['draw'],
		    'loss' => $result['loss'],
		    'total' => $result['total'],
		    'score' => $result['score'],
		    'prediction' => $result['prediction'],
		    'pointByProno' => $result['pointByProno'],
		    'luckyRatio' => $result['luckyRatio'],
		    'season' => $result['season']
    );
		array_push($response['users'],$user);
	}
	
	// return the JSON
  echo json_encode($response);
?>