<?php
	$response = array();
	// initialize JSON (array php)
	
	try {
		require_once ('../connect_DB.php');
	} catch (Exception $e) {
		$response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
		echo json_encode($response);
		die();
	}
	
	$response['status'] = 200;
	$games = array();
	
	$gameQuery = "SELECT * FROM games ORDER BY schedule DESC LIMIT 25";
	foreach ($bdd -> query($gameQuery) as $row) {
		$game = array(
			addBy => $row['addBy'],
			country => $row['country'],
			id_game => $row['id_game'],
			id_teamA => $row['id_teamA'],
			id_teamB => $row['id_teamB'],
			schedule => date('d/m/Y',$row['schedule']),
			scheduleTime => date('G',$row['schedule']).'h'.date('i',$row['schedule']),
			timestamp => $row['schedule'],
			scoreA => $row['scoreA'],
			scoreB => $row['scoreB'],
			type => $row['type'],
			pronos => array()
		);
		
		/* TODO Improve SQL request (too much calls) */
		$pronoQuery ="SELECT * FROM pronos p INNER JOIN users u ON p.userid = u.userid WHERE p.id_game = '".$game['id_game']."' ORDER BY p.prono_date DESC";
		foreach($bdd -> query($pronoQuery) as $data){
			$user = array(
				accreditation => $data["accreditation"],
				email => $data["email"],
				firstname => utf8_encode($data["firstname"]),
				lastname => utf8_encode($data["lastname"]),
				userid => $data["userid"]
			);
			$prono = array(
				id_game => $data["id_game"],
				id_prono => $data["id_prono"],
				prono_date => date('d/m/Y',$data['prono_date']),
				prono_time => date('G',$data['prono_date']).'h'.date('i',$data['prono_date']),
				timestamp => $data['prono_date'],
				scoreA => $data["scoreA"],
				scoreB => $data["scoreB"],
				by => $user
			);

			array_push($game['pronos'],$prono);
		}
		
		array_push($games,$game);
	}

	$response['games'] = $games;
	
	// return the JSON
	echo json_encode($response);
?>