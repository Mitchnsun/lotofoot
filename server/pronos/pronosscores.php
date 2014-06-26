<?php 
	function getGame($id,$bdd){
		$querygame = "SELECT * FROM games WHERE id_game=".$id;
		$result = $bdd -> query($querygame) -> fetch();
		$data = array(
			"id_game" => $result['id_game'],
			"scoreA" => $result['scoreA'],
			"scoreB" => $result['scoreB'],
			"extra" => $result['extra']
		);
		return $data;
	}
	
	function stringOfIds ($array){
		$string = "";
		foreach($array as $prono){
			$string .= "'".$prono['id_prono']."',";
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
	$response['pronos'] = array(
		"W" => array(),
		"WE" => array(),
		"WF" => array(),
		"WFE" => array(),
		"D" => array(),
		"DE" => array(),
		"L" => array()
	);
	$response['games'] = array();
	
	$querypronos = "SELECT * FROM pronos WHERE result = ''";
	foreach ($bdd -> query($querypronos) as $row) {
		$id = $row['id_game'];
		$data = array(
			"id_prono" => $row['id_prono'],
			"id_game" => $id,
			"scoreA" => $row['scoreA'],
			"scoreB" => $row['scoreB'],
			"winner" => $row['penalties']
		);
		
		if(!isset($response['games'][$id])){
			$response['games'][$id] = getGame($id,$bdd);
		}
		
		if($response['games'][$id]['scoreA'] == '' || $response['games'][$id]['scoreB'] == ''){
			/* Do nothing the game got not score yet */
		}else if($row['scoreA'] == $response['games'][$id]['scoreA'] && $row['scoreB'] == $response['games'][$id]['scoreB']){
			
			if($row['penalties'] == $response['games'][$id]['extra']){
				$data['result'] = 'WE';
				array_push($response['pronos']['WE'],$data);
			} else {
				$data['result'] = 'W';
				array_push($response['pronos']['W'],$data);
			}
			
		}else if($row['scoreA'] == $row['scoreB'] && $response['games'][$id]['scoreA'] == $response['games'][$id]['scoreB']){
				
			if($row['penalties'] == $response['games'][$id]['extra']){
				$data['result'] = 'DE';
				array_push($response['pronos']['DE'],$data);
			} else {
				$data['result'] = 'D';
				array_push($response['pronos']['D'],$data);
			}

		}else if($row['scoreA'] > $row['scoreB'] && $response['games'][$id]['scoreA'] > $response['games'][$id]['scoreB']){
			$data['result'] = 'D';
			array_push($response['pronos']['D'],$data);
		}else if($row['scoreA'] < $row['scoreB'] && $response['games'][$id]['scoreA'] < $response['games'][$id]['scoreB']){
			$data['result'] = 'D';
			array_push($response['pronos']['D'],$data);
		}else {
			$data['result'] = 'L';
			array_push($response['pronos']['L'],$data);
		}
	}
	
	// Update pronos
	$querywin = "UPDATE pronos SET result = 'W' WHERE id_prono IN (".stringOfIds($response['pronos']['W']).");";
	$querywinfinal = "UPDATE pronos SET result = 'WF' WHERE id_prono IN (".stringOfIds($response['pronos']['WF']).");";
	$querywinextra = "UPDATE pronos SET result = 'WE' WHERE id_prono IN (".stringOfIds($response['pronos']['WE']).");";
	$querylosefinalextra = "UPDATE pronos SET result = 'WFE' WHERE id_prono IN (".stringOfIds($response['pronos']['WFE']).");";
	$querydraw = "UPDATE pronos SET result = 'D' WHERE id_prono IN (".stringOfIds($response['pronos']['D']).");";
	$querydrawextra = "UPDATE pronos SET result = 'DE' WHERE id_prono IN (".stringOfIds($response['pronos']['DE']).");";
	$querylose = "UPDATE pronos SET result = 'L' WHERE id_prono IN (".stringOfIds($response['pronos']['L']).");";
	
	$req = $bdd  -> prepare($querywin) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd -> prepare($querywinfinal) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd -> prepare($querywinextra) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd  -> prepare($querylosefinalextra) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd -> prepare($querydraw) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd -> prepare($querydrawextra) or die(print_r($bdd->errorInfo()));
	$req -> execute();
	$req = $bdd -> prepare($querylose) or die(print_r($bdd->errorInfo()));
	$req -> execute();

	// return the JSON
  echo json_encode($response);
?>