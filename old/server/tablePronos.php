<?php
	session_start();
	
	try{
		require_once('connect_DB.php');
	}
	catch (Exception $e){
		die('Error in index.php - try require connect_DB.php : '.$e->getMessage());
	}

	$today = time();
	$userid = $_SESSION['userid'];
	
	$query = "SELECT * FROM games WHERE schedule > '$today' ORDER BY schedule";
	foreach ($bdd -> query($query) as $row) {
		
		$querygame = "SELECT count(*) FROM pronos WHERE userid = :userid AND id_game = :id_game";
		$reqgame = $bdd -> prepare($querygame) or die(print_r($bdd->errorInfo()));
		$reqgame -> execute(array(
					'userid' => $userid,
					'id_game' => $row['id_game']
		));
		$result = $reqgame -> fetch();

		if($result['count(*)'] == 0){
		
			echo '<tr class="rowGame" ref="'.$row['id_game'].'">';
			echo '<td class="schedule">'.date('d/m/Y',$row['schedule']).'</td>';
			echo '<td class="scheduleTime">'.date('G',$row['schedule']).'h'.date('i',$row['schedule']).'</td>';
			
			$queryTeam = "SELECT name FROM teams WHERE id_team = ?";
			$reqTeam = $bdd -> prepare($queryTeam) or die(print_r($bdd->errorInfo()));
			$reqTeam -> execute(array($row['id_teamA']));
			$result = $reqTeam -> fetch();
			
			echo '<td class="teamA"><label class="control-label" for="prono'.$row['id_teamA'].$row['id_game'].'"> '.$result['name'].' </label></td>';
			echo '<td class="scoreA"><select class="input-mini selectScore" id="prono'.$row['id_teamA'].$row['id_game'].'">';
			for($i=0;$i<10;$i++){
				echo '<option value="'.$i.'">'.$i.'</option>';
			}
			echo '</select></td>
			<td class="separation"> <strong> - </strong> </td>
			<td class="scoreB"><select class="input-mini selectScore" id="prono'.$row['id_teamB'].$row['id_game'].'">';
			for($i=0;$i<10;$i++){
				echo '<option value="'.$i.'">'.$i.'</option>';
			}
			echo '</select></td>';
			 
			$queryTeam = "SELECT name FROM teams WHERE id_team = ?";
			$reqTeam = $bdd -> prepare($queryTeam) or die(print_r($bdd->errorInfo()));
			$reqTeam -> execute(array($row['id_teamB']));
			$result = $reqTeam -> fetch();
			
			echo '<td class="teamB"><label class="control-label" for="prono'.$row['id_teamB'].'"> '.$result['name'].' </label></td>';
			echo '</tr>';
		}
	}
?>