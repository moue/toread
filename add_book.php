<?php

	require("common.php");

	// Save the cleaned input data
	$title = mysql_real_escape_string($_POST['title']);
	$author = mysql_real_escape_string($_POST['author']);
	$image_url = mysql_real_escape_string($_POST['image_url']);

	// Make sure data is reasonable length
	if(strlen($image_url) > 512 || strlen($title) > 256 || strlen($author) > 512)
	{
		die("title, author, or image url too long");
	}

	// Add book into reading list
	$query = "INSERT INTO books (author, title, image_url) VALUES('$author','$title','$image_url')";
	mysql_query($query);
	
	$uid = mysql_insert_id();
	echo $uid;
?>