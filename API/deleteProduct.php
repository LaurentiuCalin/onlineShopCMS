<?php 

$productId = $_POST["productId"];

$jProductsFromFile = json_decode(file_get_contents("../json/products.json"));

for ($i=0; $i < count($jProductsFromFile); $i++) { 
	if ($productId == $jProductsFromFile[$i]->id) {
		$deleteProduct = $i;
		array_splice($jProductsFromFile, $deleteProduct, 1);

		echo "deleted";
	}
}

file_put_contents("../json/products.json", json_encode($jProductsFromFile, JSON_PRETTY_PRINT));

?>