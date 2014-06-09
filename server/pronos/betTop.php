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
  
  if ($_POST['userid'] == $_SESSION['userid']) {
    $response['status'] = 200;
    $today = time();
    $id_bonus = 1;
    $choices = $_POST['choices'];
    $userid = $_SESSION['userid'];
    
    if(count($choices) < 4){
      $response['errorCode'] = "teams_errorMsg";
      echo json_encode($response);
      die();
    }
    if($today > 1403042399){
      $response['errorCode'] = "time_errorMsg";
      echo json_encode($response);
      die();
    }

    $query = "SELECT count(*) FROM pronos_bonus WHERE userid=:userid AND id_bonus=:id_bonus";
    $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
    $req -> execute(array('userid' => $userid, 'id_bonus' => $id_bonus));
    $result = $req -> fetch();
    
    if ($result['count(*)'] == 0) {
      $query = "INSERT INTO pronos_bonus (id_bonus,userid,first,second,third,fourth,at) VALUES (:id_bonus,:userid,:first,:second,:third,:fourth,:at)";
      $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
      $req -> execute(array(
        'id_bonus' => $id_bonus,
        'userid' => $userid,
        'first' => $choices['first'],
        'second' => $choices['second'],
        'third' => $choices['third'],
        'fourth' => $choices['fourth'],
        'at' => $today
      ));
    } else{
      $query = "UPDATE pronos_bonus SET first=:first, second=:second, third=:third, fourth=:fourth, at=:at WHERE userid=:userid AND id_bonus=:id_bonus";
      $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd->errorInfo())));
      $req -> execute(array(
        'id_bonus' => $id_bonus,
        'userid' => $userid,
        'first' => $choices['first'],
        'second' => $choices['second'],
        'third' => $choices['third'],
        'fourth' => $choices['fourth'],
        'at' => $today
      ));
    }

  } else {
    // Different user, not authorized
    $response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
  }
  // return the JSON
  echo json_encode($response);
?>