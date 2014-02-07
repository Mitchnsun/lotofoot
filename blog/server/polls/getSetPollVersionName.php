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
    
    $type = $_POST['type'];
    $version = $_POST['version'];
    
    // Must be logged to vote
    if(isset($_SESSION['userid'])){
      $userid = $_SESSION['userid'];
      $choice = $_POST['choice'];
      $today = time();
  
      // Find if the user already vote
      $query = "SELECT * FROM polls WHERE userid = :userid AND type = :type AND version = :version ORDER BY voteTime DESC";
      $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "Base de données", "message" => $bdd -> errorInfo())));
      $req -> execute(array(
          'userid' => $userid,
          'type' => $type,
          'version' => $version
      ));
      $result = $req -> fetch();

      if ($choice != null && $result['voteTime'] + 24*60*60 < $today) { // set a new entry
        $query = "INSERT INTO polls(type,version,choice,userid,voteTime) VALUES(:type,:version,:choice,:userid,:voteTime)";
        $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "Base de données", "message" => $bdd -> errorInfo())));
        $req -> execute(array(
                'type' => $type,
                'version' => $version,
                'choice' => $choice,
                'userid' => $userid,
                'voteTime' => $today,
        ));
        
        $response['status'] = 200;
        
      }else {
        $response['status'] = 403;
      }
      
    }else { // Try to vote without login
      $response['status'] = 401;
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

    // return the JSON
    echo json_encode($response);
?>