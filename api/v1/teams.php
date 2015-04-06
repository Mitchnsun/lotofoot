<?php
	class Teams {
		private $bdd;
		private $httpStatus;
		private $availableMethods = array(
			"GET" => 100,
			"DELETE" => 405
		);
		public function initialize($bdd, $httpStatus, $id){
			$this -> bdd = $bdd;
			$this -> httpStatus = $httpStatus;
			$status = $this -> availableMethods[$_SERVER['REQUEST_METHOD']];
			
			if($status != 100){
				$this -> httpStatus -> error($status);
				exit();
			}
			
			switch($_SERVER['REQUEST_METHOD']){
				case "GET":
					$this -> get($id);
					break;
				default:
					$this -> httpStatus -> error(501);
			}
		}
		/*** Private functions ***/
		private function get($id){
			if(isset($id)){
				$this -> fetch($id);
			} else {
				$this -> fetchAll();
			}
		}
		
		/**
		 * Return JSON a list of object or one object if id defined
		 * GET /teams/:id
		 */
		private function fetchAll(){
			$teams = array();
	
		  $query = "SELECT * FROM teams ORDER BY name ASC";
		  foreach ($this -> bdd -> query($query) as $row) { // Fetch each team on the database
		    $data = array(
			    "country" => $row['country'],
			    "type" => $row['type'],
			    "league" => utf8_encode($row['division']),
			    "name" => utf8_encode($row['name']),
			    "id" => $row['id_team']
		    );
				
		    array_push($teams, $data);
		  }
			
		  // return the JSON
		  echo json_encode($teams);
		}
		private function fetch($id){
			$team = array();
		  $query = "SELECT * FROM teams WHERE id_team = :id";
			$req = $this -> bdd -> prepare($query) or die(json_encode(array("status" => 500, "errorCode" => "BDLogin", "message" => $this -> bdd->errorInfo())));
			$req -> execute(array("id" => $id));
			$count = $req -> rowCount();
			
			if($count == 1){
				$result = $req -> fetch();
				$team = array(
					"id" => $result['id_team'],
					"type" => $result['type'],
					"name" => utf8_encode($result['name']),
			    "country" => $result['country'],
			    "league" => utf8_encode($result['division'])
		    );
				// return the JSON
		  	echo json_encode($team);
			} else {
				$this -> httpStatus -> error(404);
			}

		  
		}
	}
?>