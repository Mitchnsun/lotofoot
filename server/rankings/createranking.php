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
  $date = DateTime::createFromFormat('d/m/Y', '01/07/2013');
	$timeStamp = date_format($date, 'U');
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['from'] = $timeStamp;
	$response['games'] = array();
	
	$querygames = "SELECT id_game FROM games WHERE schedule > :time";
	$req = $bdd -> prepare($querygames) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
	$req -> execute(array("time" => $response['from']));
	while($result = $req -> fetch()){
		array_push($response['games'],$result['id_game']);
	}
	
	$queryusers = "SELECT userid, firstname, lastname FROM users";
	foreach($bdd -> query($queryusers) as $user){
		$resultsUser = array();
		$querypronos = "SELECT result, COUNT(1) AS 'count' FROM pronos WHERE userid = :userid AND id_game IN (".stringOfIds($response['games']).") GROUP BY result";
		$req = $bdd -> prepare($querypronos) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
		$req -> execute(array("userid" => $user['userid']));
		while ($row = $req -> fetch()) {
			$resultsUser[$row['result']] = $row['count'];
		}
		$response[$user['firstname'].' '.$user['lastname']] = array('result' => $resultsUser, 'userid' => $user['userid']);
	}
	
	
	
	// return the JSON
  echo json_encode($response);
?>