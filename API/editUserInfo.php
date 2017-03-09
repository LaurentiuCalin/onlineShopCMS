<?php

session_start();

$newInfo = strtolower($_POST["newInfo"]);
$userId = $_POST["userId"];
$editValueOf = $_POST["newInfoType"];

$jUserFromFile = json_decode(file_get_contents("../json/users.json"));

if ($newInfo != '') {
	for ($i=0; $i < count($jUserFromFile); $i++) { 
		if ($jUserFromFile[$i]->username == $newInfo) {
			$usernameInUse = true;
		}
		if ($jUserFromFile[$i]->email == $newInfo) {
			$emailInUse = true;
		}
	}
	if ($usernameInUse) {
		echo '{"response":"invalid", "error":"Username already in use!"}';
	} elseif ($emailInUse){
		echo '{"response":"invalid", "error":"Email already in use!"}';
	} else {
		for ($j=0; $j < count($jUserFromFile); $j++) { 
			if ($userId == $jUserFromFile[$j]->id && $editValueOf == "username") {
				$jUserFromFile[$j]->username = $newInfo;
				$_SESSION['user'] = $newInfo;
				$_SESSION['userType'] = $jUserFromFile[$j]->type;
				echo '{"response":"valid", "username":"'.$_SESSION["user"].'", "userType":'.$_SESSION["userType"].'}';
			} elseif ($userId == $jUserFromFile[$j]->id && $editValueOf == "email"){
				$newEmail = filter_var($newInfo, FILTER_SANITIZE_EMAIL);
				if(filter_var($newEmail, FILTER_VALIDATE_EMAIL)){
					$jUserFromFile[$j]->email = $newEmail;
					echo '{"response":"valid", "username":"'.$_SESSION["user"].'", "userType":'.$_SESSION["userType"].'}';
				} else {
					echo '{"response":"invalid", "error":"Email is not valid!"}';
				}

			}
		}
		file_put_contents("../json/users.json", json_encode($jUserFromFile, JSON_PRETTY_PRINT));
	}
}

?>