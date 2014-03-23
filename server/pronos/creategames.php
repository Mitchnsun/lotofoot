<?php
  $response = array(); // initialize JSON (array php)
  
  try {
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	session_start();
  
  if (!isset($_SESSION['userid'])) {// No session exists. Data only available by authentication
    $response['status'] = 401;
    echo json_encode($response);
    exit();
  }else {
  	$response['status'] = 200;
		$today = time();
  	$userid = $_SESSION['userid'];
  	$query = "INSERT INTO games(type,country,id_teamA,id_teamB,schedule,addBy) 
  						VALUES(:type,:country,:teamA,:teamB,:schedule,:userid)";
		
  	$games = $_POST['games'];
		foreach($games as $game){
			$strDate = $game['date'].' '.$game['hour'].':'.$game['minute'];
			$date = DateTime::createFromFormat('d/m/Y H:i', $strDate);
			$timeStamp = date_format($date, 'U');
			$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
			$req -> execute(array(
					'type' => $game['type'],
					'country' => $game['country'],
					'teamA' => $game['teamA']['id'],
					'teamB' => $game['teamB']['id'],
					'schedule' => $timeStamp,
					'userid' => $userid
			));
		}
  }
	
	// return the JSON
  echo json_encode($response);
?>