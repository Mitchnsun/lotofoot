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
  
  if (!isset($_SESSION['userid'])) {// No session exists. Data only available by authentication
    $response['status'] = 401;
    echo json_encode($response);
    exit();
  }
  
  $response['status'] = 200;
  $today = time();
	
  if ($_GET['userid'] == $_SESSION['userid']) {
    $userid = $_GET['userid'];
  
    $query = "SELECT * FROM games WHERE schedule > '$today' ORDER BY schedule";
    // retrieve games that are not played yet
    $response['pronos'] = array();
		
    foreach ($bdd -> query($query) as $row) {
      $querygame = "SELECT count(*) FROM pronos WHERE userid = :userid AND id_game = :id_game";
      // Find if the user already bet on this game
      $reqgame = $bdd -> prepare($querygame) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
      $reqgame -> execute(array('userid' => $userid, 'id_game' => $row['id_game']));
      $result = $reqgame -> fetch();

      if ($result['count(*)'] == 0) {// no bet on this game
        $game = array();
  
        // Game information, id / date / schedule
        $game['id_teamA'] = $row['id_teamA'];
				$game['id_teamB'] = $row['id_teamB'];
        $game['id'] = $row['id_game'];
        $game['date'] = date('d/m/Y', $row['schedule']);
        $game['schedule'] = date('G', $row['schedule']) . 'h' . date('i', $row['schedule']);
  
        array_push($response['pronos'], $game);
      }
    }
  
  } else {// Different user, not authorized
    $response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
  }
  
  // return the JSON
  echo json_encode($response);
?>