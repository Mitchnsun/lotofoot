<?php
session_start();

if (!isset($_SESSION['userid'])) {
	header('Location:Auth/');
} else {
	//print_r($_SESSION);
}

try {
	require_once ('server/connect_DB.php');
} catch (Exception $e) {
	die('Error in index.php - try require connect_DB.php : ' . $e -> getMessage());
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
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </a>
					<a class="brand" href="#">Mailing List</a>
					<div class="nav-collapse collapse">
						<ul class="nav">
							<li class="active">
								<a href="./">Home</a>
							</li>
							<li>
								<a href="pronos.php">Pronostics</a>
							</li>
							<li>
                <a href="/lotofoot/blog">Blog</a>
              </li>
							<!--<li><a href="#">Stats ML</a></li>
							<li><a href="#">Profil</a></li>-->
							<!--<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
							<ul class="dropdown-menu">
							<li><a href="#">Action</a></li>
							<li><a href="#">Another action</a></li>
							<li><a href="#">Something else here</a></li>
							<li class="divider"></li>
							<li class="nav-header">Nav header</li>
							<li><a href="#">Separated link</a></li>
							<li><a href="#">One more separated link</a></li>
							</ul>
							</li>-->
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
				<h2>Paris du jour</h2>
				<hr/>
				<p>
					<?php
					$today = time();
					echo date("F j, Y, g:i a", $today);
					?>
				</p>
				<table id="pronosToDo" class="table">
					<?php
					include ('server/tablePronos.php');
					?>
				</table>
				<button type="button" class="btn btn-success btn-large" onclick="return bet();">
					Parier
				</button>
				<hr/>
				<h2>Mes 25 derniers pronostics</h2>
				<hr/>
				<table id="lastPronos" class="table">
					<?php
					include ('server/lastPronos.php');
					?>
				</table>
			</div>
			<!-- hero unit /end -->

			<!-- Modal -->
			<div id="AddProno" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalProno" aria-hidden="true">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
						×
					</button>
					<h3 id="modalProno">Lancer un pronostic</h3>
				</div>
				<div class="modal-body">
					<form class="form-inline">
						<input type="text" id="schedule" class="input-small" placeholder="Date">
						<select id="hourSchedule" class="input-mini">
							<?php
							for ($i = 0; $i < 24; $i++) {
								if ($i < 10) {echo '<option value="0' . $i . '">0' . $i . '</option>';
								} else {echo '<option value="' . $i . '">' . $i . '</option>';
								}
							}
							?>
						</select>
						h
						<select id="minuteSchedule" class="input-mini">
							<?php
							for ($i = 0; $i < 60; $i++) {
								if ($i < 10) {echo '<option value="0' . $i . '">0' . $i . '</option>';
								} else {echo '<option value="' . $i . '">' . $i . '</option>';
								}
							}
							?>
						</select>
						<select id="teamA" class="input-small">
							<option value="0"></option>
							<?php
							$query = "SELECT * FROM teams ORDER BY name ASC";
							foreach ($bdd -> query($query) as $row) {
								echo "<option value='" . $row['id_team'] . "'>" . $row['name'] . "</option>";
							}
							?>
						</select>
						<select id="teamB" class="input-small">
							<option value="0"></option>
							<?php
							$query = "SELECT * FROM teams ORDER BY name ASC";
							foreach ($bdd -> query($query) as $row) {
								echo "<option value='" . $row['id_team'] . "'>" . $row['name'] . "</option>";
							}
							?>
						</select>
					</form>
				</div>
				<div class="modal-footer">
					<button class="btn" data-dismiss="modal" aria-hidden="true">
						Fermer
					</button>
					<button class="btn btn-primary" onclick="return addProno();">
						Enregistrer
					</button>
				</div>
			</div>
			<!-- Example row of columns -->
			<div class="row">
				<div class="span4">
					<h3>Classement</h3>
					<p>
						<!--<ul>
						<li><span class="badge badge-success">1</span> Matthieu</li>
						<li><span class="badge badge-warning">2</span> Vincent</li>
						<li><span class="badge badge-warning">3</span> Philippe</li>
						</ul>-->
						Ce module n'est pas encore fonctionnel, veuillez patienter. Pour plus d'informations sur l'avancement, consulter le <a href="/lotofoot/blog">blog</a>
					</p>
					<p>
						<a class="btn" href="#">Détails &raquo;</a>
					</p>
				</div>
				<div class="span4">
					<h3>Lancer un pronostic</h3>
					<p>
						<a href="#AddProno" role="button" class="btn" data-toggle="modal">Lancer</a>
					</p>
				</div>
			</div>

			<hr>

			<footer>
				<p>
					&copy; Mailing List Club 2012
				</p>
			</footer>

		</div>
		<!-- /container -->

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
				var ga = document.createElement('script');
				ga.type = 'text/javascript';
				ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(ga, s);
			})();

		</script>

	</body>
</html>
