<?php

$sUsername = strtolower($_POST["username"]);
$sPassword = $_POST["password"];

$jUsers = json_decode(file_get_contents("../json/users.json"));

for ($i=0; $i < count($jUsers); $i++) { 
	if ($sUsername == $jUsers[$i]->username && $sPassword == $jUsers[$i]->password) {
		session_start();
		$_SESSION["user"] = $sUsername;
		$_SESSION["userType"] = $jUsers[$i]->type;
		echo '{"username":"'.$_SESSION["user"].'", "userType":'.$_SESSION["userType"].'}';
	}
	else{
		echo false;
	}
}

?>