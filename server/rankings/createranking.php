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
	$type = 'Overall';
	$season = 2;
  $startDate = DateTime::createFromFormat('d/m/Y', '01/07/2013');
	$timeStamp = date_format($startDate, 'U');
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['from'] = $timeStamp;
	$response['at'] = $today;
	$response['games'] = array();
	$response['users'] = array();
	
	$querygames = "SELECT id_game FROM games WHERE schedule > :time";
	$req = $bdd -> prepare($querygames) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute(array("time" => $response['from']));
	while($result = $req -> fetch()){
		array_push($response['games'],$result['id_game']);
	}
	
	$queryusers = "SELECT userid, firstname, lastname FROM users";
	foreach($bdd -> query($queryusers) as $user){
		$resultsUser = array('W' => 0, 'D' => 0, 'L' => 0);
		$querypronos = "SELECT result, COUNT(1) AS 'count' FROM pronos WHERE userid = :userid AND id_game IN (".stringOfIds($response['games']).") GROUP BY result";
		$req = $bdd -> prepare($querypronos) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array("userid" => $user['userid']));
		while ($row = $req -> fetch()) {
			$resultsUser[$row['result']] = intval($row['count']);
		}
		
		$total =  $resultsUser['W'] + $resultsUser['D'] + $resultsUser['L'];
		$score =  $resultsUser['W'] * 3 + $resultsUser['D'];
		
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
				'prediction' => floatval($prediction),
				'pointByProno' => floatval($pointByProno),
				'luckyRatio' => floatval($luckyRatio),
				'displayName' => utf8_encode($user['firstname'].' '.$user['lastname'])
				)
		);
	}

	// Delete previous ranking
	$queryDelete = "DELETE FROM rankings WHERE type=:type AND season=:season";
	$req = $bdd -> prepare($queryDelete) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
	$req -> execute(array('type' => $type, 'season' => $season));
	
	foreach($response['users'] as $user){
		$query = "INSERT INTO rankings (at,type,userid,displayName,win,draw,loss,total,score,prediction,pointByProno,luckyRatio,season) 
				VALUES (:at,:type,:userid,:displayName,:win,:draw,:loss,:total,:score,:prediction,:pointByProno,:luckyRatio,:season)";
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
		    'prediction' => $user['prediction'],
		    'pointByProno' => $user['pointByProno'],
		    'luckyRatio' => $user['luckyRatio'],
		    'season' => $season
    ));
	}
	
	// return the JSON
  echo json_encode($response);
?>