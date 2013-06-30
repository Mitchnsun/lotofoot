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
    
    $teams = array();
    
    $query = "SELECT * FROM teams ORDER BY name ASC";
    foreach ($bdd -> query($query) as $row) { // Fetch each team on the database
        $country = $row['country'];
        $data = array(
                "country" => $row['country'],
                "league" => $row['division'],
                "name" => $row['name'],
                "id" => $row['id_team']
        );
        if(isset($teams[$country])){
            array_push($teams[$country], $data);
        }else{
            $teams[$country] = array(); //create the array if it does not exist
            array_push($teams[$country], $data);
        }
    }
    
    $response['teams'] = $teams;
    
    $response['status'] = 200;
    
    // return the JSON
    echo json_encode($response);
?>