<?php 

$email = $_GET['email'];
$key = $_GET['key'];

$jUserFromFile = json_decode(file_get_contents("../json/users.json"));

for ($i=0; $i < count($jUserFromFile); $i++) { 
	if ($key == $jUserFromFile[$i]->key && $jUserFromFile[$i]->isVerified == 0)
	{
		$jUserFromFile[$i]->isVerified = 1;
		file_put_contents("../json/users.json", json_encode($jUserFromFile, JSON_PRETTY_PRINT));
		echo "Validated";
		exit;
	}elseif($key == $jUserFromFile[$i]->key && $jUserFromFile[$i]->isVerified == 1){
		echo "Already valid!";
		exit;
	}
}

?>