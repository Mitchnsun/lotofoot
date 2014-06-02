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
      $querygame = "SELECT count(*) FROM pronos WHERE userid = :userid AND id_game = :id_game";
      // Find if the user already bet on this game
      $reqgame = $bdd -> prepare($querygame) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
      $reqgame -> execute(array('userid' => $userid, 'id_game' => $row['id_game']));
      $result = $reqgame -> fetch();
      
      $game = array();
      
      if ($result['count(*)'] == 0) {// no bet on this game
        // Game information, id / date / schedule
        $game['id_teamA'] = $row['id_teamA'];
        $game['id_teamB'] = $row['id_teamB'];
        $game['id'] = $row['id_game'];
        $game['date'] = date('d/m/Y', $row['schedule']);
        $game['schedule'] = date('G', $row['schedule']) . 'h' . date('i', $row['schedule']);
      } else {
        // Game information, id / date / schedule
        $game['id_teamA'] = $row['id_teamA'];
        $game['id_teamB'] = $row['id_teamB'];
        $game['id'] = $row['id_game'];
        $game['prono'] = array(
            "scoreA" => $row['scoreA'],
            "scoreB" => $row['scoreB'],
            "date" => date('d/m/Y', $row['prono_date']),
            "schedule" => date('G', $row['prono_date']) . 'h' . date('i', $row['prono_date'])
        );
        $game['date'] = date('d/m/Y', $row['schedule']);
        $game['schedule'] = date('G', $row['schedule']) . 'h' . date('i', $row['schedule']);
      }
      
      if ($row['schedule'] < $today){
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