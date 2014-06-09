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

    $query = "INSERT INTO pronos_bonus (id_bonus,userid,first,second,third,fourth,at) VALUES (:id_bonus,:userid,:first,:second,:third,:fourth,:at)";
    $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
    $req -> execute(array(
      'id_bonus' => 1,
      'userid' => $userid,
      'first' => $choices['first'],
      'second' => $choices['second'],
      'third' => $choices['third'],
      'fourth' => $choices['fourth'],
      'at' => $today
    ));

  } else {
    // Different user, not authorized
    $response['status'] = 401;
    $response["errorCode"] = "Wrong_User";
  }
  // return the JSON
  echo json_encode($response);
?>