<?php
	session_start();
	
	try{
		require_once('../server/connect_DB.php');
	}
	catch (Exception $e){
		die('Error in AddTeam.php - try require connect_DB.php : '.$e->getMessage());
	}
	
	if(!isset($_SESSION['userid'])){
		header('Location:../Auth/');
	}
	else{
		$userid = $_SESSION['userid'];
		$query = "SELECT droit FROM users WHERE userid = :userid";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array('userid' => $userid));
		$result = $req -> fetch();
		if($result['droit'] == 'Joueur'){
			header('Location:../');
		}
	}
	
	
	
	if(isset($_POST['team']) && isset($_POST['country']) && isset($_POST['division'])){
		$team = $_POST['team'];
		$country = $_POST['country'];
		$division = $_POST['division'];
		
		$query = "INSERT INTO teams(name,country,division) VALUES(:name,:country,:division)";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array(
				'name' => $team,
				'country' => $country,
				'division' => $division
		));
	}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loto Foot</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Matthieu Compérat">

    <!-- Le styles -->
    <link href="../assets/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link href="../assets/css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <!--<link rel="shortcut icon" href="../assets/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">-->
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Mailing List</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="../">Home</a></li>
            </ul>
            <div class="nav-collapse pull-right">
              Logout
            </div>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
      	<h2>Add a team</h2><hr>
		<form class="form-inline" method="post" action="AddTeam.php">
			<input type="text" name="team" class="input-small" placeholder="Team">
			<input type="text" name="country" class="input-small" placeholder="Country">
			<input type="text" name="division" class="input-small" placeholder="Division">
			<button type="submit" class="btn">Add</button>
		</form>
		<h3>Last added teams</h3><hr>
		<table class="table">
		<thead><tr><th>Teams</th><th>Country</th><th>Division</th></thead>
		<?php
			$query = "SELECT * FROM teams ORDER BY id_team DESC";
			foreach ($bdd -> query($query) as $row) {
				echo "<tr>";
				echo "<td>".$row['name']."</td>";
				echo "<td>".$row['country']."</td>";
				echo "<td>".$row['division']."</td>";
				echo "</tr>";
			}
		?>
		</table>
      </div> <!-- hero unit /end -->

      <hr>

      <footer>
        <p>&copy; Mailing List Club 2012</p>
      </footer>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="../assets/js/jquery.js"></script>
    <script src="../assets/js/bootstrap.min.js"></script>
	
  </body>
</html>