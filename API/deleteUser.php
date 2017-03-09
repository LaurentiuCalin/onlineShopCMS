<?php 

$userId = $_POST["userId"];

$jUserFromFile = json_decode(file_get_contents("../json/users.json"));

for ($i=0; $i < count($jUserFromFile); $i++) { 
	if ($userId == $jUserFromFile[$i]->id && $jUserFromFile[$i]->type != 1) {
		$deleteUser = $i;
		array_splice($jUserFromFile, $deleteUser, 1);

		echo "deleted";
	}elseif ($userId == $jUserFromFile[$i]->id && $jUserFromFile[$i]->type == 1) {
		echo "You don't have permission";
	}
}

file_put_contents("../json/users.json", json_encode($jUserFromFile, JSON_PRETTY_PRINT));

?>