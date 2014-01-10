<?php
    $response = array(); // initialize JSON (array php)
    
    try {
        require_once ('../connect_DB.php');
    } catch (Exception $e) {
        $response = array("status" => 500, "errorCode" => "Base de Données", "message" => $e -> getMessage());
        echo json_encode($response);
        die();
    }
    
    session_start();
    
    $userid = (isset($_SESSION['userid'])) ? $_SESSION['userid'] : 0 ;
    $type = $_POST['type'];
    $version = $_POST['version'];
    $choice = $_POST['choice'];
    $today = time();

    // Find if the user already vote
    // 0 : anonymous user
    if($userid != 0){
      $query = "SELECT count(*) FROM polls WHERE userid = :userid AND type = :type AND version = :version";
      $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "Base de données", "message" => $bdd -> errorInfo())));
      $req -> execute(array(
          'userid' => $userid,
          'type' => $type,
          'version' => $version
      ));
      $result = $req -> fetch();
    }
    
    if ($choice != null && $result['count(*)'] == 0) { // set a new entry
      $query = "INSERT INTO polls(type,version,choice,userid,voteTime) VALUES(:type,:version,:choice,:userid,:voteTime)";
      $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "Base de données", "message" => $bdd -> errorInfo())));
      $req -> execute(array(
              'type' => $type,
              'version' => $version,
              'choice' => $choice,
              'userid' => $userid,
              'voteTime' => $today,
      ));
    }
    
    //get the poll results
    $query = "SELECT choice,userid FROM polls WHERE type = :type AND version = :version";
    $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "Base de données", "message" => $bdd -> errorInfo())));
    $req -> execute(array(
        'type' => $type,
        'version' => $version
    ));
    
    $results = $req -> fetchAll(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
    $list = array();
    foreach ($results as $key => $value) {
      $arr = array('label' => $key, 'recs' => $value);
      $list[$key] = $arr;
    }
    
    $response['results'] = $list;
    
    $response['status'] = 200;
    
    // return the JSON
    echo json_encode($response);
?>