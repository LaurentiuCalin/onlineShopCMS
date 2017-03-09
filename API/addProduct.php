<?php 

$jNewProduct = json_decode('{}');
$jNewProduct->id = uniqid();
$jNewProduct->title = $_POST['productName'];
$jNewProduct->price = $_POST['productPrice'];
$jNewProduct->description = $_POST['productDescription'];
$jNewProduct->type = $_POST['productCategory'];
$jNewProduct->image = $_POST['productImage'];

$jProductsFromFile = json_decode(file_get_contents("../json/products.json"));

array_push($jProductsFromFile, $jNewProduct);

file_put_contents("../json/products.json", json_encode($jProductsFromFile, JSON_PRETTY_PRINT));
?>