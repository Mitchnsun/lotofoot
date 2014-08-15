<?php
  $response = array();// initialize JSON (array php)
  
  try {
    require_once ('../../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
  
  $teams = array();
	
  $query = "SELECT * FROM teams ORDER BY name ASC";
  foreach ($bdd -> query($query) as $row) { // Fetch each team on the database
    $data = array(
		    "country" => $row['country'],
		    "type" => $row['type'],
		    "league" => utf8_encode($row['division']),
		    "name" => utf8_encode($row['name']),
		    "id" => $row['id_team']
    );
		
    array_push($teams, $data);
  }
  
  $response['teams'] = $teams;
  $response['status'] = 200;
	
  // return the JSON
  echo json_encode($response);
?>