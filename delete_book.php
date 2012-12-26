<?php

	require("common.php");

	// Save the cleaned input data
	$delete_uid = mysql_real_escape_string($_POST['delete_uid']);

	// delete book from reading list
	$query = "DELETE FROM books WHERE uid=$delete_uid";
	$cquery = "DELETE FROM comments WHERE book_uid=$delete_uid";
	
	mysql_query($query);
	mysql_query($cquery);
	
	echo $delete_uid;
?>