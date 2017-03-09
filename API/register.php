<?php 

session_start();

$jNewUser = json_decode('{}');
$jNewUser->id = uniqid();
$jNewUser->type = 0;
$jNewUser->isVerified = 0;
$jNewUser->key = md5(microtime().rand());
$jNewUser->username = strtolower($_POST["username"]);
$jNewUser->password = $_POST["password"];
$jNewUser->email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);

$jUserFromFile = json_decode(file_get_contents("../json/users.json"));

if (!empty($jNewUser)) {

	if(filter_var($jNewUser->email, FILTER_VALIDATE_EMAIL)){
		$emailIsValid = true;
	}
	for ($i=0; $i < count($jUserFromFile); $i++) { 
		if ($jNewUser->email == $jUserFromFile[$i]->email) {
			$emailInUse = true; 
		}
		if ($jNewUser->username == $jUserFromFile[$i]->username) {
			$usernameInUse = true;
		}
	}
	if ($usernameInUse) {
		echo '{"validation":"Username is taken"}';
	} elseif (!$emailIsValid) {
		echo '{"validation":"Email is not valid"}';
	} elseif ($emailInUse) {
		echo '{"validation":"Email is already used"}';
	} elseif ($emailIsValid && !$emailInUse && !$usernameInUse) {

		// /*=============================================
		// =            Send validation email            =
		// =============================================*/
		
		// $to = $jNewUser->email;
		// $subject = "Verify your account";
		// $message = "http://www.laurd.xyz/WebDevExam/verify.php?email=".$jNewUser->email."&key=".$jNewUser->key;
		// $headers = "From: durnea.calin@laurd.xyz";
		// mail($to, $subject, $message, $headers);
		
		// /*=====  End of Send validation email  ======*/
		

		$_SESSION["user"] = $jNewUser->username;
		$_SESSION["userType"] = $jNewUser->type;

		array_push($jUserFromFile, $jNewUser);

		file_put_contents("../json/users.json", json_encode($jUserFromFile, JSON_PRETTY_PRINT));

		echo '{"username":"'.$_SESSION["user"].'", "userType":'.$_SESSION["userType"].'}';
	}
}

?>

