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
	session_start();
    
  if ($_POST['userid'] == $_SESSION['userid']) {
  	$userid = $_POST['userid'];
    $response['status'] = 200;
		$games = array();
		$today = time();
		
		$gameQuery = "SELECT * FROM games g INNER JOIN pronos p ON g.id_game = p.id_game WHERE g.schedule > '".$today."' AND p.userid = '".$userid."' ORDER BY g.schedule ASC";
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
				type => $row['type'],
				prono => array(
						id_prono => $row['id_prono'],
						userid => $row['userid'],
						scoreA => $row['scoreA'],
						scoreB => $row['scoreB'],
						prono_date => date('d/m/Y',$row['prono_date']),
						prono_time => date('G',$row['prono_date']).'h'.date('i',$row['prono_date'])
				)
			);
			
			array_push($games,$game);
		}

		$response['games'] = $games;
		
 	} else {// Different user, not authorized
      $response['status'] = 401;
      $response["errorCode"] = "Wrong_User";
  }
	
	// return the JSON
	echo json_encode($response);
?>