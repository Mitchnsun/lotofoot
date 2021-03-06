<?php
	function stringOfIds ($array){
		$string = "";
		foreach($array as $game){
			$string .= "'".$game['id_game']."',";
		}
		return rtrim($string, ",");
	}
?>


<?php
  $response = array(); // initialize JSON (array php)
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$response['status'] = 200;
	$response['prono_limit'] = 5;
	$response['unvalidgames'] = array();
	$response['games'] = array();
	
	$querygames = "SELECT * FROM games WHERE scoreA != '' AND scoreB != '' AND validation = 0";
	foreach ($bdd -> query($querygames) as $row) {
		$id = $row['id_game'];
		$data = array(
			"id_game" => $id,
			"teamA" => $row['id_teamA'],
			"teamB" => $row['id_teamB'],
			"scoreA" => $row['scoreA'],
			"scoreB" => $row['scoreB']
		);
		
		$querypronos = "SELECT COUNT(*) FROM pronos WHERE id_game=".$id;
		$result = $bdd -> query($querypronos) -> fetch();
		$data['numberOfPlayers'] = $result['COUNT(*)'];
		
		if($result['COUNT(*)'] < $response['prono_limit']){ // Limit of players
			array_push($response['unvalidgames'],$data);
		}
		
		array_push($response['games'],$data);
	}
	
	// Update pronos
	$queryvalidGame = "UPDATE games SET validation = 1 WHERE id_game IN (".stringOfIds($response['games']).");";
	$req = $bdd  -> prepare($queryvalidGame) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	
	$queryunvalid = "UPDATE pronos SET result = 'X' WHERE id_game IN (".stringOfIds($response['unvalidgames']).");";
	$req = $bdd  -> prepare($queryunvalid) or die(print_r($bdd->errorInfo()));
	$req -> execute();

	// return the JSON
  echo json_encode($response);
?>