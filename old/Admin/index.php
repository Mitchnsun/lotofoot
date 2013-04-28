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
		$query = "SELECT accreditation FROM users WHERE userid = :userid";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array('userid' => $userid));
		$result = $req -> fetch();
		if($result['accreditation'] == 'Joueur'){
			header('Location:../');
		}
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
    <link href="assets/css/flick/jquery-ui.min.css" rel="stylesheet">

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
      	<h2>Admin panel</h2><hr>
			<form class="form-inline">
				<input type="text" id="schedule" class="input-small" placeholder="Date">
				<select id="hourSchedule" class="input-mini">
					<?php
						for($i=0;$i<24;$i++)
						{
							if($i<10){echo '<option value="0'.$i.'">0'.$i.'</option>';}
							else{echo '<option value="'.$i.'">'.$i.'</option>';}
						}
					?>
				</select> h <select id="minuteSchedule" class="input-mini">
					<?php
						for($i=0;$i<60;$i++)
						{
							if($i<10){echo '<option value="0'.$i.'">0'.$i.'</option>';}
							else{echo '<option value="'.$i.'">'.$i.'</option>';}
						}
					?>
				</select>
				<select id="teamA" class="input-small">
					<option value="0"></option>
				<?php
					$query = "SELECT * FROM teams ORDER BY name ASC";
					foreach ($bdd -> query($query) as $row) {
						echo "<option value='".$row['id_team']."'>".$row['name']."</option>";
					}
				?>
				</select>
				<select id="teamB" class="input-small">
					<option value="0"></option>
				<?php
					$query = "SELECT * FROM teams ORDER BY name ASC";
					foreach ($bdd -> query($query) as $row) {
						echo "<option value='".$row['id_team']."'>".$row['name']."</option>";
					}
				?>
				</select>
				<button type="button" class="btn btn-success" onclick="return bet();">Add</button>
			</form>
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
    <script src="../assets/js/jquery-ui.js"></script>
    <script src="../assets/js/bootstrap.min.js"></script>
    <script src="../assets/js/lotoFoot.js"></script>
	
  </body>
</html>