<?php 

$userId = $_POST["userId"];

$jUserFromFile = json_decode(file_get_contents("../json/users.json"));


for ($i=0; $i < count($jUserFromFile); $i++) { 
	if ($userId == $jUserFromFile[$i]->id) {
		if ($jUserFromFile[$i]->type == 0) {
			$jUserFromFile[$i]->type = 1;
		}elseif ($jUserFromFile[$i]->type == 1) {
			$jUserFromFile[$i]->type = 0;
		}
	}
}

file_put_contents("../json/users.json", json_encode($jUserFromFile, JSON_PRETTY_PRINT));

?>