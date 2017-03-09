<?php 

$jProduct = json_decode('{}');
$jProduct->id = $_POST['productId'];
$jProduct->title = $_POST['productName'];
$jProduct->price =$_POST['productPrice'];
$jProduct->description = $_POST['productDescription'];
$jProduct->type = $_POST['productCategory'];
$jProduct->image = $_POST['productImage'];

$jProductsFromFile = json_decode(file_get_contents("../json/products.json"));

for ($i=0; $i < count($jProductsFromFile); $i++) { 
	if ($jProduct->id == $jProductsFromFile[$i]->id) {
		if ($jProduct->title != '') {
			$jProductsFromFile[$i]->title = $jProduct->title;
		}
		if ($jProduct->price != '') {
			$jProductsFromFile[$i]->price = $jProduct->price;
		}
		if ($jProduct->description != '') {
			$jProductsFromFile[$i]->description = $jProduct->description;
		}
		if ($jProduct->type != '') {
			$jProductsFromFile[$i]->type = $jProduct->type;
		}
		if ($jProduct->image != '') {
			$jProductsFromFile[$i]->image = $jProduct->image;
		}
	}
}

file_put_contents("../json/products.json", json_encode($jProductsFromFile, JSON_PRETTY_PRINT));

?>