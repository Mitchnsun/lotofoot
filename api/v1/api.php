<?php
	// Lotofoot V1 API
	require_once '../HTTPStatus.php';
	require_once 'router.php';
	$httpStatus = new HTTPStatus();
	$router = new Router();
	
	header('Content-Type: application/json');
	$response = array();// initialize JSON (array php)
	
	try { /* DB */
    require_once ('../connect_DB.php');
  } catch (Exception $e) {
    $response = array("status" => 500, "errorCode" => "BD", "message" => $e -> getMessage());
    echo json_encode($response);
    die();
  }
	
	$path = explode('/', $_SERVER['REQUEST_URI']);
	$target = $path[4];
	$id = $path[5];
	
	if(isset($path[6])){
		$httpStatus -> error(414);
		exit();
	}
	
	if(isset($target)){
		$element = $router -> getClass($target);
		if(is_object($element)){
			$element -> initialize($bdd, $httpStatus, $id);
		} else {
			$httpStatus -> error($element);
		}
	}else {
		$httpStatus -> error(404);
	};
?>