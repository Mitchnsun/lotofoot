<?php 
	function getBonus($id,$bdd){
		$querybonus = "SELECT * FROM bonus WHERE id_bonus=".$id;
		$result = $bdd -> query($querybonus) -> fetch();
		$data = array(
			"id_bonus" => $result['id_bonus'],
			"ready" => $result['ready'],
			"top" => intval($result['top']),
			"first" => $result['first'],
			"second" => $result['second'],
			"third" => $result['third'],
			"fourth" => $result['fourth'],
			"fifth" => $result['fifth']
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
	$response['bonus'] = array();
	$response['pronos'] = array();
	
	$querypronos = "SELECT * FROM pronos_bonus WHERE validation = 0";
	foreach ($bdd -> query($querypronos) as $row) {
		$id = $row['id_bonus'];
		$data = array(
			"id" => $row['id'],
			"userid" => $row['userid'],
			"id_bonus" => $id,
			"first" => $row['first'],
			"second" => $row['second'],
			"third" => $row['third'],
			"fourth" => $row['fourth'],
			"fifth" => $row['fifth']
		);
		
		if(!isset($response['bonus'][$id])){
			$response['bonus'][$id] = getBonus($id,$bdd);
			$response['bonus'][$id]['array'] = array(
					$response['bonus'][$id]['first'],
					$response['bonus'][$id]['second'],
					$response['bonus'][$id]['third'],
					$response['bonus'][$id]['fourth'],
					$response['bonus'][$id]['fifth']
			);
		}
		
		if($response['bonus'][$id]['ready'] == 1){
			
			$data['pos_first'] = array_keys($response['bonus'][$id]['array'], $data['first']);
			$data['pos_second'] = array_keys($response['bonus'][$id]['array'], $data['second']);
			$data['pos_third'] = array_keys($response['bonus'][$id]['array'], $data['third']);
			$data['pos_fourth'] = array_keys($response['bonus'][$id]['array'], $data['fourth']);
			$data['pos_fifth'] = array_keys($response['bonus'][$id]['array'], $data['fifth']);
			
			// Set points for pronos
			$points = 0;
			
			if($response['bonus'][$id]['top'] >= 1 && count($data['pos_first']) > 0){
				$points += count($data['pos_first']);
				if(array_search(0, $data['pos_first']) !== false){
					$points += 4;
				}
			}
			if($response['bonus'][$id]['top'] >= 2 && count($data['pos_second']) > 0){
				$points += count($data['pos_second']);
				if(array_search(1, $data['pos_second']) !== false){
					$points += 4;
				}
			}
			if($response['bonus'][$id]['top'] >= 3 && count($data['pos_third']) > 0){
				$points += count($data['pos_third']);
				if(array_search(2, $data['pos_third']) !== false){
					$points += 4;
				}
			}
			if($response['bonus'][$id]['top'] >= 4 && count($data['pos_fourth']) > 0){
				$points += count($data['pos_fourth']);
				if(array_search(3, $data['pos_fourth']) !== false){
					$points += 4;
				}
			}
			if($response['bonus'][$id]['top'] >= 5 && count($data['pos_fifth']) > 0){
				$points += count($data['pos_fifth']);
				if(array_search(4, $data['pos_fifth']) !== false){
					$points += 4;
				}
			}
			
			$data['points'] = $points;
			
			array_push($response['pronos'],$data);
			
			// Update pronos
			$queryupdate = "UPDATE pronos_bonus SET points = :points, validation = '1' WHERE id = :id;";
			$req = $bdd  -> prepare($queryupdate) or die(print_r($bdd->errorInfo()));
			$req -> execute(array(
					"points" => $points,
					"id" => $row['id']
			));
		}
	}
	
	// return the JSON
  echo json_encode($response);
?>