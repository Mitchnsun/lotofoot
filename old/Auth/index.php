<?php
	try{
		require_once('../server/connect_DB.php');
	}
	catch (Exception $e){
		die('Error in Auth/index.php - try require connect_DB.php : '.$e->getMessage());
	}
	
	if(isset($_POST['userEmail']) && isset($_POST['userPwd'])){
		$userEmail = $_POST['userEmail'];
		$userPwd = crypt($_POST['userPwd'],$userEmail);
		unset($_POST); // The password no exists in clear anymore
		
		$query = "SELECT userid FROM users WHERE email = '$userEmail' AND pwd = '$userPwd'";
		$req = $bdd -> prepare($query) or die(print_r($bdd->errorInfo()));
		$req -> execute(array($userEmail,$userPwd));
		$count = $req -> rowCount();
		
		$wrong_pwd = true;
		if($count == 1){
			session_start();
			$result = $req -> fetch();
			$_SESSION['userid'] = $result['userid'];
			header('Location:../');
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Se connecter</title>
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
            
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
        <form class="form-horizontal" method="post" action="index.php">
		  <div class="control-group">
			<label class="control-label" for="userEmail">Email</label>
			<div class="controls">
			  <input type="text" name="userEmail" id="userEmail" placeholder="Email">
			</div>
		  </div>
		  <div class="control-group">
			<label class="control-label" for="userPwd">Password</label>
			<div class="controls">
			  <input type="password" name="userPwd" id="userPwd" placeholder="Password">
			</div>
		  </div>
		  <div class="control-group">
			<div class="controls">
			  <!--<label class="checkbox">
				<input type="checkbox"> Remember me
			  </label>-->
			  <button type="submit" class="btn">Sign in</button>
			</div>
		  </div>
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
    <script src="../assets/js/bootstrap.min.js"></script>
	
  </body>
</html>