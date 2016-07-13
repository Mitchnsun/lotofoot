<?php
	function stringOfIds ($array){
		$string = "";
		foreach($array as $game){
			$string .= "'".$game."',";
		}
		
		return rtrim($string, ",");
	}
?>

<?php
  $response = array(); // initialize JSON (array php)
  $today = time();
	$type = $_POST['type']; // could be the game's type or competition. Overall means all games
	$season = $_POST['season'];
	$startDate = date_format(DateTime::createFromFormat('d/m/Y', $_POST['startDate']), 'U');
	$endDate = date_format(DateTime::createFromFormat('d/m/Y', $_POST['endDate']), 'U');
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['time'] = array("from" => $startDate, "to" => $endDate);
	$response['at'] = $today;
	$response['id_bonus'] = array();
	$response['games'] = array();
	$response['users'] = array();
	
  if ($type == "Overall") {
	  $querybonus = "SELECT id_bonus FROM bonus WHERE season=:season";
    $req = $bdd -> prepare($querybonus) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
    $req -> execute(array("season" => $season));
  } else {
    $querybonus = "SELECT id_bonus FROM bonus WHERE type=:type AND season=:season";
    $req = $bdd -> prepare($querybonus) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
    $req -> execute(array("type" => preg_replace('/[0-9]/', '', $type),"season" => $season));
  }
	while($result = $req -> fetch()){
		array_push($response['id_bonus'],$result['id_bonus']);
	}
	
	if($type == "Overall"){
		$querygames = "SELECT id_game FROM games WHERE schedule > :from AND schedule < :to";
		$req = $bdd -> prepare($querygames) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array("from" => $response['time']['from'], "to" => $response['time']['to']));
	}else {
		$querygames = "SELECT id_game FROM games WHERE schedule > :from AND schedule < :to AND (type=:type OR competition=:type)";
		$req = $bdd -> prepare($querygames) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array("from" => $response['time']['from'], "to" => $response['time']['to'], "type" => $type));
	}

	while($result = $req -> fetch()){
		array_push($response['games'],$result['id_game']);
	}
	
	$queryusers = "SELECT userid, firstname, lastname FROM users";
	foreach($bdd -> query($queryusers) as $user){
		$resultsUser = array(
				'W' => 0,
				'WF' => 0,
				'WE' => 0,
				'WFE' => 0,
				'D' => 0,
				'DE' => 0,
				'L' => 0
		);
		$querypronos = "SELECT result, COUNT(1) AS 'count' FROM pronos WHERE userid = :userid AND id_game IN (".stringOfIds($response['games']).") GROUP BY result";
		$req = $bdd -> prepare($querypronos) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array("userid" => $user['userid']));
		while ($row = $req -> fetch()) {
			$resultsUser[$row['result']] = intval($row['count']);
		}
		
		/* Add penalties prono on W and D */
		$resultsUser['W'] = $resultsUser['W'] + $resultsUser['WF'] + $resultsUser['WE'] + $resultsUser['WFE'];
		$resultsUser['D'] = $resultsUser['D'] + $resultsUser['DE'];
		
		$total = $resultsUser['W'] + $resultsUser['D'] + $resultsUser['L'];
		$bonus = $resultsUser['WF'] * 2 + $resultsUser['WE'] + $resultsUser['WFE'] * 3 + $resultsUser['DE'];
		
		/* Get bonus points from prono bonus */
		$querypronobonus = "SELECT points FROM pronos_bonus WHERE userid=:userid AND validation='1' AND id_bonus IN (".stringOfIds($response['id_bonus']).")";
		$reqbonus = $bdd -> prepare($querypronobonus) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$reqbonus -> execute(array("userid" => $user['userid']));
		while ($data = $reqbonus -> fetch()) {
			$bonus += $data['points'];
		}
		
		$score = $resultsUser['W'] * 3 + $resultsUser['D'] + $bonus;
		
		if($total > 0){
			$prediction = ($resultsUser['W'] + $resultsUser['D'])*100 / $total;
			$pointByProno = $score / $total;
		}else{
			$prediction = 0;
			$pointByProno = 0;
		}
		
		if($resultsUser['W'] + $resultsUser['D'] > 0){
			$luckyRatio = 100 * ($resultsUser['W'] / ($resultsUser['W'] + $resultsUser['D']));
		}else{
			$luckyRatio = 0;
		}
		
		array_push($response['users'],array(
				'result' => $resultsUser,
				'userid' => intval($user['userid']),
				'total' => intval($total),
				'score' => intval($score),
				'bonus' => intval($bonus),
				'prediction' => floatval($prediction),
				'pointByProno' => floatval($pointByProno),
				'luckyRatio' => floatval($luckyRatio),
				'displayName' => utf8_encode($user['firstname'].' '.$user['lastname'])
			)
		);
	}

	// Delete previous ranking
	$queryDelete = "DELETE FROM ranking WHERE type=:type AND season=:season";
	$req = $bdd -> prepare($queryDelete) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
	$req -> execute(array('type' => $type, 'season' => $season));
	
	foreach($response['users'] as $user){
		if($user['total'] > 0){
			$query = "INSERT INTO ranking (at,type,userid,displayName,win,draw,loss,total,score,bonus,prediction,pointByProno,luckyRatio,season) 
					VALUES (:at,:type,:userid,:displayName,:win,:draw,:loss,:total,:score,:bonus,:prediction,:pointByProno,:luckyRatio,:season)";
			$req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
		  $req -> execute(array(
			    'at' => $today,
			    'type' => $type,
			    'userid' => $user['userid'],
			    'displayName' => utf8_decode($user['displayName']),
			    'win' => $user['result']['W'],
			    'draw' => $user['result']['D'],
			    'loss' => $user['result']['L'],
			    'total' => $user['total'],
			    'score' => $user['score'],
			    'bonus' => $user['bonus'],
			    'prediction' => $user['prediction'],
			    'pointByProno' => $user['pointByProno'],
			    'luckyRatio' => $user['luckyRatio'],
			    'season' => $season
	    ));
		}
	}
	
	// return the JSON
  echo json_encode($response);
?>