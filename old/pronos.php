<?php
	session_start();
	
	if(!isset($_SESSION['userid']) && $_SESSION['userid']!= 0){
		header('Location:Auth/');
	}
	else{
		//print_r($_SESSION);
	}
	
	try{
		require_once('server/connect_DB.php');
	}
	catch (Exception $e){
		die('Error in index.php - try require connect_DB.php : '.$e->getMessage());
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
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link href="assets/css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="assets/css/flick/jquery-ui.min.css" rel="stylesheet">
    <link href="assets/css/pronos.css" rel="stylesheet">

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
              <li><a href="./">Home</a></li>
              <li class="active"><a href="pronos.php">Pronostics</a></li>
            </ul>
            <!--<div class="nav-collapse pull-right">
              Logout
            </div>-->
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
		<h2>Derniers pronostics</h2>
		<hr/>
		<table id="lastPronos" class="table">
			<?php
				//$games tableau à 2 dimensions contenant les matchs pronostiqués
							
				$query = "SELECT * FROM games g INNER JOIN teams t ON g.id_teamA = t.id_team ORDER BY g.schedule DESC";
				foreach ($bdd -> query($query) as $row) {
					$games[$row['id_game']]['id_game'] = $row['id_game'];
					$games[$row['id_game']]['schedule'] = $row['schedule'];
					$games[$row['id_game']]['scoreA'] = $row['scoreA'];
					$games[$row['id_game']]['teamA'] = $row['name'];
				}
				$query = "SELECT * FROM games g INNER JOIN teams t ON g.id_teamB = t.id_team ORDER BY g.schedule DESC";
				foreach ($bdd -> query($query) as $row) {
					$games[$row['id_game']]['teamB'] = $row['name'];
					$games[$row['id_game']]['scoreB'] = $row['scoreB'];
				}
				
				foreach($games as $game){
					echo '<tr style="border-top:solid 5px grey;font-weight:bold;">';
					echo '<td class="schedule">'.date('d/m/Y',$game['schedule']).'</td>';
					echo '<td class="scheduleTime">'.date('G',$game['schedule']).'h'.date('i',$row['schedule']).'</td>';
					echo '<td class="teamA"> '.$game['teamA'].' </td>';
					echo '<td class="separation"> <strong> '.$game['scoreA'].' - '.$game['scoreB'].' </strong> </td>';
					echo '<td class="teamB"> '.$game['teamB'].' </td>';
					echo '</tr>';
					
					$query ="SELECT * FROM pronos p INNER JOIN users u ON p.userid = u.userid WHERE p.id_game = '".$game['id_game']."' ORDER BY p.prono_date DESC";
					foreach($bdd -> query($query) as $prono){
						echo '<tr>';
						echo '<td class="schedule">'.date('d/m/Y',$prono['prono_date']).'</td>';
						echo '<td class="scheduleTime">'.date('G',$prono['prono_date']).'h'.date('i',$prono['prono_date']).'</td>';
						echo '<td class="teamA"> '.$prono['firstname'].' '.$prono['lastname'].' </td>';
						echo '<td class="separation"> <strong> '.$prono['scoreA'].' - '.$prono['scoreB'].' </strong> </td>';
						echo '<td></td>';
						echo '</tr>';
					}
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
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/jquery-ui.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/lotoFoot.js"></script>
	
	<script type="text/javascript">

	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-36979515-1']);
	  _gaq.push(['_setDomainName', 'mcomper.at']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	
	</script>
	
  </body>
</html>
