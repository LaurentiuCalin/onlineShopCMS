<?php 

session_start();

if (isset($_SESSION["user"])) {
	echo '{"username":"'.$_SESSION["user"].'", "userType":'.$_SESSION["userType"].'}';
}

?>