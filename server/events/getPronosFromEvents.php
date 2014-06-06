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

  $response['status'] = 200;
  $events = $_GET['events'];
  $today = time();
  
  if ($_GET['userid'] == $_SESSION['userid']) {
    $userid = $_GET['userid'];
  
    $query = "SELECT * FROM games WHERE competition = '$events' ORDER BY schedule";
    // retrieve all games from the events
    $response['games'] = array();
    
    foreach ($bdd -> query($query) as $row) {
      $querygame = "SELECT * FROM pronos WHERE userid = :userid AND id_game = :id_game";
      // Find if the user already bet on this game
      $reqgame = $bdd -> prepare($querygame) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
      $reqgame -> execute(array('userid' => $userid, 'id_game' => $row['id_game']));
      $result = $reqgame -> fetch();
      
      $game = array();
      // Game information, id / date / schedule
      $game['id_teamA'] = $row['id_teamA'];
      $game['id_teamB'] = $row['id_teamB'];
      $game['scoreA'] = $row['scoreA'];
      $game['scoreB'] = $row['scoreB'];
      $game['id_game'] = $row['id_game'];
      $game['date'] = date('d/m/Y', $row['schedule']);
      $game['schedule'] = date('G', $row['schedule']) . 'h' . date('i', $row['schedule']);
      $game['stage'] = $row['stage'];
      
      if (isset($result['id_prono'])) {// bet on this game
        $game['prono'] = array(
            "id_prono" => $result['id_prono'],
            "scoreA" => $result['scoreA'],
            "scoreB" => $result['scoreB'],
            "date" => date('d/m/Y', $result['prono_date']),
            "schedule" => date('G', $result['prono_date']) . 'h' . date('i', $result['prono_date'])
        );
        $game['result'] = $result;
      }
      
      if ($row['schedule'] > $today){
        $game['bet'] = TRUE;
      }else {
        $game['bet'] = FALSE;
      }
      
      array_push($response['games'], $game);
    }
  
  } else {// Different user, not authorized
    $response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
  }
  
  // return the JSON
  echo json_encode($response);
?>