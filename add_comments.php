<?php

	require("common.php");

	// Check for presence of input parameters else die("warning")
	if(!isset($_POST['comment']))
	{
		die("some parameter was not set");
	}
	
	// Save the cleaned input data
	$comment = mysql_real_escape_string($_POST['comment']);
	$book_uid = mysql_real_escape_string($_POST['book_uid']);

	// Make sure data is reasonable length
	if(strlen($comment) > 512)
	{
		die("Comment too long");
	}

	// Add comment into comment list
	$query = "INSERT INTO comments (book_uid, comment) VALUES('$book_uid', '$comment')";
	mysql_query($query);
	
	echo $book_uid;
?>