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
        $id_prono = $_POST['id_prono'];
        $scoreA = $_POST['scoreA'];
        $scoreB = $_POST['scoreB'];
        $userid = $_SESSION['userid'];
    
        $today = time();
    
        $query = "UPDATE pronos SET scoreA=:scoreA, scoreB=:scoreB, prono_date=:prono_date WHERE id_prono=:id_prono AND userid=:userid";
        $req = $bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BD", "message" => $bdd -> errorInfo())));
        $req -> execute(array(
                'userid' => $userid,
                'id_prono' => $id_prono,
                'scoreA' => $scoreA,
                'scoreB' => $scoreB,
                'prono_date' => $today
        ));
    
        $response['status'] = 200;
    
    } else {// Different user, not authorized
        $response['status'] = 401;
        $response["errorCode"] = "Wrong_User";
    }
    // return the JSON
    echo json_encode($response);
?>