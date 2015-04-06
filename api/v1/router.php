<?php
	class Router {
		private $routes = array(
			"teams" => "teams.php"
		);
		
		public function getClass ($name){
			switch ($name){
				case "teams":
					require_once "teams.php";
					return new Teams();
				default :
					return 404;
			}
		}
	}
?>