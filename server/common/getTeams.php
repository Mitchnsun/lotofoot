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
    
    $club = array(); // For club
    $international = array(); // For the international teams
    
    $query = "SELECT * FROM teams ORDER BY name ASC";
    foreach ($bdd -> query($query) as $row) { // Fetch each team on the database
        $country = $row['country'];
        $data = array(
                "country" => $row['country'],
                "league" => $row['division'],
                "name" => $row['name'],
                "id" => $row['id_team']
        );
        
        if($row['type'] == 'club'){ // Build clubs list
            if(isset($club[$country])){
                array_push($club[$country]['recs'], $data);
            }else{
                $club[$country] = array(); //create the array if it does not exist
                $club[$country]['recs'] = array(); // list of the teams
                $club[$country]['id'] = $country; // country id
                array_push($club[$country]['recs'], $data);
            }    
        }elseif($row['type'] == 'international'){
            array_push($international, $data);
        }
    }
    
    $response['clubs'] = $club;
    $response['international'] = $international;
    
    $response['status'] = 200;
    
    // return the JSON
    echo json_encode($response);
?>