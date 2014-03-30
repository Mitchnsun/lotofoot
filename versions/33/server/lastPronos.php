<?php
	session_start();
	
	try{
		require_once('connect_DB.php');
	}
	catch (Exception $e){
		die('Error in index.php - try require connect_DB.php : '.$e->getMessage());
	}
	
	$userid = $_SESSION['userid'];

	$today = time();
	
	$query = sprintf("SELECT * FROM pronos WHERE userid = '%d' ORDER BY prono_date DESC, id_prono DESC LIMIT 25",$userid);
	foreach ($bdd -> query($query) as $row) {
		echo '<tr>';
		echo '<td class="schedule">'.date('d/m/Y',$row['prono_date']).'</td>';
		echo '<td class="scheduleTime">'.date('G',$row['prono_date']).'h'.date('i',$row['prono_date']).'</td>';
		
		$querygame = "SELECT * FROM games WHERE id_game = ?";
		$reqgame = $bdd -> prepare($querygame) or die(print_r($bdd->errorInfo()));
		$reqgame -> execute(array($row['id_game']));
		$game = $reqgame -> fetch();
		
		$queryTeam = "SELECT name FROM teams WHERE id_team = ?";
		$reqTeam = $bdd -> prepare($queryTeam) or die(print_r($bdd->errorInfo()));
		$reqTeam -> execute(array($game['id_teamA']));
		$result = $reqTeam -> fetch();
		
		echo '<td class="teamA"> '.utf8_encode($result['name']).' </td>';
		echo '<td class="scoreA">'.$row['scoreA'].'</td>
		<td class="separation"> <strong> - </strong> </td>
		<td class="scoreB">'.$row['scoreB'].'</td>';
		 
		$queryTeam = "SELECT name FROM teams WHERE id_team = ?";
		$reqTeam = $bdd -> prepare($queryTeam) or die(print_r($bdd->errorInfo()));
		$reqTeam -> execute(array($game['id_teamB']));
		$result = $reqTeam -> fetch();
		
		echo '<td class="teamB"> '.utf8_encode($result['name']).' </td>';
		echo '</tr>';
	}

?>