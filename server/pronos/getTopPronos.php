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
  
  $response['status'] = 200;
  $today = time();
  $id_bonus = $_GET['id_bonus'];
  $response['pronos'] = array();

  $query = "SELECT * FROM pronos_bonus p INNER JOIN users u ON p.userid = u.userid WHERE p.id_bonus = '".$id_bonus."' ORDER BY p.at DESC";
  foreach($bdd -> query($query) as $data){
    $prono = array(
      "at" => $data['at'],
      "first" => $data['first'],
      "second" => $data['second'],
      "third" => $data['third'],
      "fourth" => $data['fourth'],
      "data" => $data
    );
    $prono['displayName'] = $data['firstname'].' '.$data['lastname'];
    $prono['display_name'] = '&&'.$data['firstname'].' '.$data['lastname'];
    if($data['pseudo'] != ''){
      $prono['display_name'] = '##'.$data['pseudo'];
    }
    
    array_push($response['pronos'], $prono);
  }
  
  echo json_encode($response);// return the JSON
?>