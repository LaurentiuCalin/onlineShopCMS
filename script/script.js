
/**

	TODO:
	- User search product
	- User wishlist
	- User change password
	- Admin search product/user
	- Admin welcome page
	- Admin send validation reminder
	- Admin add categories
	- Display single category products
	- Delete from cart
	- Total cart price
	- Verified email landing page
	- Encript passwords

	*/


	var addToCartAudio = new Audio('sound/arpeggio.mp3');

/*=====================================
=            Check session            =
=====================================*/
var sessionUserType = null;
var loggedUser = null;

$(document).ready(function(){
	$.ajax({
		"url":"API/checkSession.php",
		"method":"POST"
	}).done(function(sData){
		if (!sData) {
			displayDefaultContent();
		}else{
			var jData = JSON.parse(sData);
			sessionUserType = jData.userType;
			loggedUser = jData.username;
			if (jData.userType == 1) {
				displayAdminContent();
			} else{
				displayUserContent();
			}
		}
	})
});

/*=====  End of Check session  ======*/


/*=============================
=            Login            =
=============================*/

$(document).on("click", "#loginBtnModal", function(){
	var inputUsername = $("#inputUsername").val();
	var inputPassword = $("#inputPassword").val();

	$.ajax({
		"url":"API/login.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{
			username:inputUsername,
			password:inputPassword
		}
	}).done(function(sData){
		$("#inputUsername").val('');
		$("#inputPassword").val('');
		if (!sData) {				
			$("#failedLoginAlert").css("display","block");
		} else{
			var jData = JSON.parse(sData);
			sessionUserType = jData.userType;
			loggedUser = jData.username;
			$("#loginModal").modal("hide"); 
			if (jData.userType == 1) {
				displayAdminContent();
			} else{
				displayUserContent();
			}
		}
	});
});

/*=====  End of Login  ======*/


/*==============================
=            Logout            =
==============================*/

$(document).on("click", "#logoutBtn", function(){
	$.ajax({
		"url":"API/logout.php"
	}).done(function(Data){
		sessionUserType = null;
		loggedUser = null;
		displayDefaultContent();
	});
});

/*=====  End of Logout  ======*/


/*=====================================
=            Register user            =
=====================================*/

$(document).on("click", "#registerBtnModal", function(){
	var inputRegisterUsername = $("#inputRegisterUsername").val();
	var inputRegisterPassword = $("#inputRegisterPassword").val();
	var inputRegisterEmail = $("#inputRegisterEmail").val();

	if (inputRegisterUsername=='' || inputRegisterPassword=='' || inputRegisterEmail=='') {
		$("#failedRegisterAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("All fields are required");
	}else if (inputRegisterUsername.length < 4){
		$("#failedRegisterAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("Username must have at least 4 characters");
	}else if (inputRegisterPassword.length < 4){
		$("#failedRegisterAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("Passoword must have at least 4 characters");
	}else{
		$.ajax({
			"url":"API/register.php",
			"method":"POST",
			"date-type":"JSON",
			"data":{
				username:inputRegisterUsername,
				password:inputRegisterPassword,
				email:inputRegisterEmail
			}
		}).done(function(sData){
			$("#inputRegisterUsername").val('');
			$("#inputRegisterPassword").val('');
			$("#inputRegisterEmail").val('');
			var jData = JSON.parse(sData);
			if (jData.validation) {
				$("#failedRegisterAlert").css("display", "block");
				$("#failedRegisterAlert > div").text(jData.validation);
			}else{
				$("#registerModal").modal("hide"); 
				sessionUserType = jData.userType;
				loggedUser = jData.username;
				if (jData.userType == 1) {
					displayAdminContent();
				} else{
					displayUserContent();
					notifyValidateEmail();
				}
			}
		})
	}

});

/*=====  End of Register user  ======*/

/*=======================================
=            User send email            =
=======================================*/

$(document).on("click", "#sendEmailBtnModal", function(){
	if ($("#senderEmail").val() != '' && $("#senderName").val() != '' && $("#emailMessage").val() != '' && $("#emailSubject").val() != '') {
		var email = $("#senderEmail").val();
		var name = $("#senderName").val();
		var message = $("#emailMessage").val();
		var subject = $("#emailSubject").val();
		$.ajax({
			"url":"API/sendEmail.php",
			"method":"POST",
			"data-type":"JSON",
			"data":{
				email:email,
				emailFrom:name,
				emailSubject:message,
				emailMessage:subject
			}
		}).done(function(sData){
			if (sData == "Message sent!") {
				$("#sendEmailModal").modal("hide");
				swal(
					sData,
					'',
					'success'
					)
			}else{
				swal(
					sData,
					'',
					'error'
					)
			};
		});
	}else{
		$("#failedSendEmailAlert").css("display", "block");
		$("#failedSendEmailAlert > div").text("All fields are required");
	}
});

/*=====  End of User send email  ======*/


/*====================================
=            Get products            =
====================================*/
$(document).ready(getProducts());
function getProducts(){
	var containerProducts = $("#container-products").html();
	var singleProduct = '<div class="col-sm-6 col-md-4 singleProduct" data-id="{{id}}">\
	<div class="thumbnail">\
	<img src="{{productImgLink}}" alt="{{productTitle}} product image" id="">\
	<div class="caption">\
	<h3 id="productTitle">{{productTitle}}</h3>\
	<h5 id="productPrice">{{productPrice}}</h5>\
	<p id="productDescription">{{productDescription}}</p>\
	<p><a class="btn btn-primary" id="addToCartBtn">Add to cart</a>{{addToWishlistBtn}}</p>\
	</div>\
	</div>\
	</div>';

	setInterval(function(){
		$.ajax({
			"url":"json/products.json",
			"method":"POST",
			"data-type":"JSON",
			"cache":false
		}).done(function(jData){
			containerProducts = $("#container-products").html('');
			for (var i = jData.length - 1; i >= 0 ; i--) {
				if (sessionUserType == 0) {
					whishlistBtn = '<a href="#" class="btn btn-default disabled" id="addToWishlistBtn">Add to wishlist<a>';
				}else{
					whishlistBtn = '';
				}
				tempSingleProduct = singleProduct.replace("{{id}}", jData[i].id).replace("{{productImgLink}}", jData[i].image).replace("{{productTitle}}", jData[i].title).replace("{{productPrice}}", jData[i].price).replace("{{productTitle}}", jData[i].title).replace("{{productDescription}}", jData[i].description).replace("{{addToWishlistBtn}}", whishlistBtn);
				$("#container-products").append(tempSingleProduct);
			};
		});
	}, 1000);
}

/*=====  End of Get products  ======*/

/*====================================
=            Default Cart            =
====================================*/

var aCartItems = [];

function checkLocalStorage(){
	if (localStorage.sItems) {
		var sCartFromLocalStorage = localStorage.sItems;
		aCartItems = JSON.parse(sCartFromLocalStorage);
		var itemsInCart = $("#cartModal").find("tbody").html('');
		singleItem = '<tr>\
		<td class="col-md-1">{{i}}</td>\
		<td class="col-md-2">{{Product}}</td>\
		<td class="col-md-1">{{Price}}</td>\
		<td class="col-md-1" data-itemId="{{id}}">\
		<i class="fa fa-trash-o fa-fw"></i>\
		</td>\
		</tr>';

		for (i=0; i < aCartItems.length; i++) {
			tempSingleItem = singleItem.replace("{{i}}", i+1).replace("{{Product}}", aCartItems[i].sItemName).replace("{{Price}}", aCartItems[i].sItemPrice);
			itemsInCart.append(tempSingleItem);
		};

	};
}

checkLocalStorage();

/*----------  Add items to cart  ----------*/

function addItemToCart(itemId){
	jCartItem = {};
	jCartItem.iItemId = itemId.parent().parent().parent().parent().data("itemId");
	jCartItem.sItemName = itemId.parent().parent().children("#productTitle").text();
	jCartItem.sItemPrice = itemId.parent().parent().children("#productPrice").text();

	aCartItems.push(jCartItem);

	var sCartItems = JSON.stringify(aCartItems);
	localStorage.sItems = sCartItems;
	checkLocalStorage();
	swal(
		'Product added to cart!',
		'',
		'success'
		);
}

$(document).on("click", "#addToCartBtn", function(){
	addToCartAudio.play();
	addItemToCart($(this))
})

/*=====  End of Default Cart  ======*/


/*====================================
=            User section            =
====================================*/

/*----------  Display settings  ----------*/
function displaySettings(){
	var userSettingRow = '<tr>\
	<td id="usernameCell">{{username}}</td>\
	<td id="emailCell">{{email}}  {{isValid}}</td>\
	<td data-id="{{id}}">\
	<div class="btn-group">\
	<a class="btn btn-primary dropdown-toggle" id="userSettingMenu" data-toggle="dropdown" href="#">\
	<span class="fa fa-cog fa-fw"></span>\
	<span class="fa fa-caret-down" title="Toggle dropdown menu"></span>\
	</a>\
	<ul class="dropdown-menu">\
	<li id="editUsername"><a href="#"><i class="fa fa-pencil fa-fw"></i> Change username</a></li>\
	<li id="editEmail"><a href="#"><i class="fa fa-pencil fa-fw"></i> Change email</a></li>\
	<li id="editPassword"><a href="#"><i class="fa fa-pencil fa-fw"></i> Change password</a></li>\
	</ul>\
	</div>\
	</td>\
	</tr>';

	$.ajax({
		"url":"json/users.json",
		"method":"GET",
		"data-type":"JSON",
		"cache":false
	}).done(function(jData){
		for (var i = 0; i < jData.length; i++) {
			if (jData[i].username == loggedUser) {
				if (jData[i].isVerified == 0) {
					isVerified = '<span class="text-danger"> | not validated</span> <span class="fa fa-times fa-fw text-danger"></span>';
				}else{
					isVerified = "";
				}
				tempUserSetting = userSettingRow.replace("{{username}}", loggedUser).replace("{{email}}", jData[i].email).replace("{{id}}", jData[i].id).replace("{{isValid}}", isVerified);
				$("#userSettingTable").append(tempUserSetting);
			};
		};
	})

}

/*----------  Edit info  ----------*/
bEdit = 0;
function editUserInfo(thisUser, editField){

	var inputEditField = '<div class="col-md-4 pull-right">\
	<form>\
	<input type="text" placeholder="{{userInformation}}" class="form-control" id="{{userInformation}}">\
	</input>\
	<i id="approveEdit" class="fa fa-check fa-2x fa-fw"></i>\
	<i id="cancelEdit" class="fa fa-times fa-2x fa-fw"></i>\
	</form>\
	</div>\
	<span id="editInfoAlert" class="text-danger"></span>';

	var fieldToEdit = editField;

	if (fieldToEdit == "#usernameCell" && bEdit == 0) {
		bEdit = 1;
		$("#userSettingMenu").addClass("disabled");
		temp = inputEditField.replace("{{userInformation}}", "new name").replace("{{userInformation}}", "newUsername");
		$(fieldToEdit).append(temp);
	}
	if(fieldToEdit == "#emailCell" && bEdit == 0) {
		bEdit = 1;
		$("#userSettingMenu").addClass("disabled");
		temp = inputEditField.replace("{{userInformation}}", "new email").replace("{{userInformation}}", "newEmail");
		$(fieldToEdit).append(temp);
	}
	editUserId = thisUser.parent().parent().parent().data("id");

	$("#cancelEdit").click(function(){
		bEdit = 0;
		$("#userSettingMenu").removeClass("disabled");
		$("#content").load("userView/userAccountSettings.html");
		displaySettings();
	});
	$("#approveEdit").click(function(){
		if (fieldToEdit == "#usernameCell") {
			newValue = $("#newUsername").val();
		}else if (fieldToEdit == "#emailCell") {
			newValue = $("#newEmail").val();
		};
		if (newValue == '') {
			bEdit = 0;
			$("#userSettingMenu").removeClass("disabled");
			$("#content").load("userView/userAccountSettings.html");
			displaySettings();
		}else if(newValue != '' && fieldToEdit == "#usernameCell"){
			if (newValue.length < 4 ) {
				$("#editInfoAlert").css("display", "block");
				$("#editInfoAlert").text("You need at least 4 characters");
			}else{
				editValueOf = "username";
				finishEdit(editUserId, newValue, editValueOf);
			};
		}else if(newValue != '' && fieldToEdit == "#emailCell"){
			editValueOf = "email";
			finishEdit(editUserId, newValue, editValueOf);
		}
	})

}

function finishEdit(thisUserId, newUserValue, jValue){
	$.ajax({
		"url":"API/editUserInfo.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{
			newInfo:newUserValue,
			userId:thisUserId,
			newInfoType:jValue
		}
	}).done(function(sData){
		$("#newUser").val('');
		$("#newEmail").val('');
		var jData = JSON.parse(sData);

		if (jData.response == "valid") {
			sessionUserType = jData.userType;
			loggedUser = jData.username;
			bEdit = 0;
			$("#userSettingMenu").removeClass("disabled");
			swal(
				jValue+' changed!',
				'',
				'success'
				)
			if (jData.userType == 1) {
				displayAdminContent();
			} else{
				$("#content").load("userView/userAccountSettings.html");
				displaySettings();
			}
		}else if(jData.response == "invalid"){
			swal(
				jData.error,
				'',
				'error'
				)
		}
	})
}

/*----------  Display products  ----------*/
$(document).on("click", "#products", function(){
	$("#content").load("userView/userContent.html");
	getProducts();
});

/*----------  Display settings  ----------*/
$(document).on("click", "#userSettings", function(){
	$("#content").load("userView/userAccountSettings.html");
	displaySettings();
});

/*----------  Edit info  ----------*/
$(document).on("click", "#editUsername", function(){
	editInfo = "#usernameCell";
	editUserInfo($(this), editInfo);
})
$(document).on("click", "#editEmail", function(){
	editInfo = "#emailCell";
	editUserInfo($(this), editInfo);
})
$(document).on("click", "#editPassword", function(){
	editInfo = "password";
	editUserInfo($(this), editInfo);
})

/*=====  End of User section  ======*/


/*=====================================
=            Admin section            =
=====================================*/

/*----------  Display products  ----------*/
function displayProducts(){
	var singleProductView = '<tr>\
	<td class="col-md-1">{{i}}</td>\
	<td class="col-md-1">{{Product}}</td>\
	<td class="col-md-1">{{Price}}</td>\
	<td class="col-md-5">{{Description}}</td>\
	<td class="col-md-1">{{Category}}</td>\
	<td class="col-md-1"><img id="productAdminImg" src="{{Image}}"></td>\
	<td class="col-md-2" data-id="{{id}}">\
	<div class="btn-group">\
	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">\
	<span class="fa fa-bars fa-fw"></span>\
	<span class="fa fa-caret-down" title="Toggle dropdown menu"></span>\
	</a>\
	<ul class="dropdown-menu">\
	<li id="editProduct" data-toggle="modal" data-target="#editProductModal"><a href="#"><i class="fa fa-pencil fa-fw"></i> Edit information</a></li>\
	<li class="divider"></li>\
	<li id="deleteProduct"><a href="#"><i class="fa fa-trash-o fa-fw"></i> Delete</a></li>\
	</ul>\
	</div>\
	</td>\
	</tr>';

	$.ajax({
		"url":"json/products.json",
		"method":"GET",
		"data-type":"JSON",
		"cache":false
	}).done(function(jData){
		var containerProducts = $("tbody").html('');
		for(var i = 0; i < jData.length; i++){
			tempSingleProduct = singleProductView.replace("{{id}}", jData[i].id).replace("{{i}}", i+1).replace("{{Product}}", jData[i].title).replace("{{Price}}", jData[i].price).replace("{{Description}}", jData[i].description).replace("{{Category}}", jData[i].type).replace("{{Image}}", jData[i].image);


			$("tbody").append(tempSingleProduct);
		}
	});
}

/*----------  Add product  ----------*/
function addProduct(){

	var newProductName = $("#newProductName").val();
	var newProductPrice = $("#newProductPrice").val();
	var newProductDescription = $("#newProductDescription").val();
	var newProductCategory = $("#newProductCategory").val();
	var newProductImage = $("#newProductImage").val();

	if (newProductImage == '') {
		newProductImage = "http://rensink.org/wp-content/themes/qaengine16/img/default-thumbnail.jpg";
	};

	if (newProductName == '') {
		$("#failedAddProductAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("Name is required");
	}else if(newProductPrice == ''){
		$("#failedAddProductAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("Price is required");
	}else if(newProductCategory == ''){
		$("#failedAddProductAlert").css("display", "block");
		$("#failedRegisterAlert > div").text("Category is required");
	}else{
		$.ajax({
			"url":"API/addProduct.php",
			"method":"POST",
			"data-type":"JSON",
			"data":{
				productName:newProductName,
				productPrice:newProductPrice,
				productDescription:newProductDescription,
				productCategory:newProductCategory,
				productImage:newProductImage
			}
		}).done(function(sData){
			$("#newProductName").val('');
			$("#newProductPrice").val('');
			$("#newProductDescription").val('');
			$("#newProductCategory").val('');
			$("#newProductImage").val('');
			$("#addProductModal").modal("hide");
			swal(
				'Product added!',
				'',
				'success'
				)
			displayProducts();
		})
	}
}

/*----------  Edit product  ----------*/
function editProduct(productObjectId){

	var newProductName = $("#editProductName").val();
	var newProductPrice = $("#editProductPrice").val();
	var newProductDescription = $("#editProductDescription").val();
	var newProductCategory = $("#editProductCategory").val();
	var newProductImage = $("#editProductImage").val();
	$.ajax({
		"url":"API/editProduct.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{
			productId:productObjectId,
			productName:newProductName,
			productPrice:newProductPrice,
			productDescription:newProductDescription,
			productCategory:newProductCategory,
			productImage:newProductImage
		}
	}).done(function(sData){
		$("#editProductName").val('');
		$("#editProductPrice").val('');
		$("#editProductDescription").val('');
		$("#editProductCategory").val('');
		$("#editProductImage").val('');
		$("#editProductModal").modal("hide");
		swal(
			'Product saved!',
			'',
			'success'
			)
		displayProducts();
	})
	
}

/*----------  Delete product  ----------*/
function deleteProduct(thisObj){
	var objectId = thisObj.parent().parent().parent().data("id");
	$.ajax({
		"url":"API/deleteProduct.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{productId:objectId}
	}).done(function(jData){
		swal(
			'Product deleted!',
			'',
			'success'
			)
		displayProducts();		
	})
}

/*----------  Display users  ----------*/
function displayUsers(){
	var singleUserView = '<tr>\
	<td>{{i}}</td>\
	<td>{{type}}</td>\
	<td>{{username}}</td>\
	<td>{{email}}  {{isValid}}</td>\
	<td data-id="{{id}}">\
	<div class="btn-group">\
	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">\
	<span class="fa fa-bars fa-fw"></span>\
	<span class="fa fa-caret-down" title="Toggle dropdown menu"></span>\
	</a>\
	<ul class="dropdown-menu">\
	<li id="deleteUser"><a href="#"><i class="fa fa-trash-o fa-fw"></i> Delete</a></li>\
	<li class="divider"></li>\
	<li id="changeType"><a href="#"><i class="fa fa-{{lockType}}"></i> Change to {{userType}}</a></li>\
	</ul>\
	</div>\
	</td>\
	</tr>';

	$.ajax({
		"url":"json/users.json",
		"method":"GET",
		"data-type":"JSON",
		"cache":false
	}).done(function(jData){
		var containerUsers = $("tbody").html('');
		for(var i = 0; i < jData.length; i++){
			if (jData[i].type == 1) {
				userType = "administrator";
				lockType = "lock";
				changeToUserType = "user";
			}else{
				userType = "user";
				lockType = "unlock";
				changeToUserType = "administrator";
			};
			if (jData[i].isVerified == 0) {
				isVerified = '<span class="text-danger"> | not validated</span> <span class="fa fa-times fa-fw text-danger"></span>';
			}else{
				isVerified = "";
			}
			tempSingleUser = singleUserView.replace("{{id}}", jData[i].id).replace("{{i}}", i+1).replace("{{type}}", userType).replace("{{isValid}}", isVerified).replace("{{username}}", jData[i].username).replace("{{email}}", jData[i].email).replace("{{lockType}}", lockType).replace("{{userType}}", changeToUserType);


			$("tbody").append(tempSingleUser);
		}
	});
}

/*----------  Delete user  ----------*/
function deleteUser(thisObj){
	var objectId = thisObj.parent().parent().parent().data("id");
	$.ajax({
		"url":"API/deleteUser.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{userId:objectId}
	}).done(function(jData){
		if (jData == "deleted") {
			swal(
				'User deleted!',
				'',
				'success'
				)
			displayUsers();
		}else{
			swal(
				'Operation failed!',
				jData,
				'error'
				)
		};		
	})
}

/*----------  Change user type  ----------*/

function changeUserType(thisObj){
	var objectId = thisObj.parent().parent().parent().data("id");
	$.ajax({
		"url":"API/changeUserType.php",
		"method":"POST",
		"data-type":"JSON",
		"data":{userId:objectId}
	}).done(function(jData){
		swal(
			'User type chaged!',
			'',
			'success'
			)
		displayUsers();
	})
}

/*----------  Manage products  ----------*/
$(document).on("click", "#manageProductsBtn", function(){
	$("#content").load("adminView/manageProducts.html");
	displayProducts();
});

/*----------  Add product  ----------*/

$(document).on("click", "#addProductBtnModal", function(){
	addProduct();
});

/*----------  Edit product  ----------*/

$(document).on("click","#editProduct", function(){
	displayEditModal($(this));
});

function displayEditModal(productEditId){
	productObjectId = productEditId.parent().parent().parent().data("id");
	$("#editProductBtnModal").click(function(){
		editProduct(productObjectId);
		// delete window.productObjectId;
	});
}

/*----------  Delete product  ----------*/
$(document).on("click", "#deleteProduct", function(){
	deleteProduct($(this));
});

/*----------  Manage users  ----------*/
$(document).on("click", "#manageUsersBtn", function(){
	$("#content").load("adminView/manageUsers.html");
	displayUsers();
});

/*----------  Delete user  ----------*/
$(document).on("click", "#deleteUser", function(){
	deleteUser($(this));
});

/*----------  Change user type  ----------*/
$(document).on("click", "#changeType", function(){
	changeUserType($(this));
});

/*=====  End of Admin section  ======*/

/*======================================
=            Switch content            =
======================================*/

function displayDefaultContent(){
	$("#content").load("defaultView/defaultContent.html");	
	$("#navigation").load("defaultView/defaultNav.html");
	$(".footer-style").css("display","block");
	$(".navbar-default").css("background","none");
	$(".navbar").addClass("navbar-fixed-top");
}
function displayAdminContent(){
	$("#content").load("adminView/adminPanel.html");
	$("#navigation").load("adminView/adminNav.html");
	$(".footer-style").css("display","none");
	$(".navbar-default").css("background","#212121");
	$(".navbar").removeClass("navbar-fixed-top");
}
function displayUserContent(){
	$("#content").load("userView/userContent.html");
	$("#navigation").load("userView/userNav.html");
	$(".footer-style").css("display","block");
	$(".navbar-default").css("background","#212121");
	$(".navbar").removeClass("navbar-fixed-top");
}

/*=====  End of Switch content  ======*/


/*===================================
=            Display Map            =
===================================*/

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: {lat: 50.877378, lng: 6.013394}
	});

	var mapInfoWindow = '<div class="page-header"><h2>Visit us anytime!</h2></div><p>Nullam molestie consequat sapien a finibus. Nullam lobortis libero felis, eget euismod mi condimentum quis. In sed risus dolor. Nunc ac nulla ex.</p>';

	var infowindow = new google.maps.InfoWindow({
		content: mapInfoWindow,
		maxWidth: 400
	});
	var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
	var marker = new google.maps.Marker({
		position: {lat: 50.877378, lng: 6.013394},
		map: map,
		title: 'Our home',
		icon: image
	});
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
}

/*=====  End of Display Map  ======*/

/*==================================================
=            User register notification            =
==================================================*/

function notifyValidateEmail() {
	var title = "Welcome!";
	var options = {
		body: "Please check your email for validation",
		sound: "sound/arpeggio.mp3",
		icon: "images/logo.png"
	}
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
        	alert("This browser does not support desktop notification"); 
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification(title, options);
          setTimeout(notification.close.bind(notification), 5000); 
      }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
        	Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
            	var notification = new Notification(title, options);
            	setTimeout(notification.close.bind(notification), 5000); 
            }
        });
        }
      // At last, if the user has denied notifications, and you 
      // want to be respectful there is no need to bother them any more.
  }

  function spawnNotification() {
  	var options = {
  		body: theBody,
  		icon: theIcon
  	}
  	var n = new Notification(theTitle,options);
  	setTimeout(n.close.bind(n), 5000); 
  }

  /*=====  End of User register notification  ======*/
