<?php 

$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$emailFrom = $_POST['emailFrom'];
$emailSubject = $_POST['emailSubject'];
$emailMessage = $_POST['emailMessage'];

$recipient = "durnea.calin@laurd.xyz";

$subject = "New mail from laurd.xyz| name: ".$emailFrom;

$emailContent = "Name: ".$emailFrom."\nEmail: ".$email."\n\nMessage: \n".$emailMessage."\n";
$emailHeaders = "From: ".$emailFrom." <".$email.">";

if(filter_var($email, FILTER_VALIDATE_EMAIL) && mail($recipient, $subject, $emailContent, $emailHeaders)){
	echo "Message sent!";
}else{
	echo "The entered email is not vaild";
}
?>