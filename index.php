<?php
	require("common.php");
	
	// Set a query that would return all the books from the table
	$query = "SELECT * FROM books";
	
	// Change query to filter posts by if the keyword is found in the comments associated with the post
	
	// Perform query
	$result = mysql_query($query);
?>

<!DOCTYPE html>
<html >
	<head>
		<title>Book Club</title>
		<meta charset='utf-8'>
		<link href="styles.css" rel="stylesheet" type="text/css" />
		<script src="http://code.jquery.com/jquery-1.7.1.js" type="text/javascript"></script>
		<script src="http://code.jquery.com/jquery-1.7.1.min.js" type="text/javascript"></script>
		<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css" />
		<script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
		<script src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js"></script>
		<script src="addbooks.js" type="text/javascript"></script>
	</head>
	<body>
		<div data-role="page">
			<div data-role="header">
				<h1>Booklist</h1>
			</div>
			<div data-role="content">
			<!-- ADD BOOK FORM!! -->        
				<h2>Add book to list</h2>
				<form id="addbook" name="addbook"> 
					<input type="text" name="title" id="title" class="required" placeholder="Title"/><br />
					<input type="text" name="author" id="author" class="required" placeholder="Author"/><br />
					<input type="text" name="image_url" id="image_url" placeholder="Image Url"/><br />
					<input type="submit" value="Post" /> 
				</form>
				
				<div id="booklist">
					<?php
						// Display every result from the query with title linked to url, and description
						while($row = mysql_fetch_array($result))
						{
							$book_uid = $row['uid'];
							?>
							
							<!-- assign an id to each book in the book list -->
							<div class="book" id="<?php echo $book_uid; ?>">
								
								<!-- display book info -->
								<div class="info">
									<img src="<?php echo $row['image_url']; ?>" class="cover" /><br />
									<h2><?php echo $row['title']; ?><br />
									<?php echo $row['author']; ?></h2>
								</div>
								
								
								<!-- display every comment that belongs to the book id -->
								
								<div class="show_comments">
									<button>Comment(s)</button>
								</div>
								<div class="comment_list">
									
									<div class="listview">
										<?php
											// set a query that returns all the comments associated with each of the books
											$comments_query = "SELECT book_uid, comment FROM comments INNER JOIN books ON comments.book_uid=books.uid WHERE books.uid=$book_uid";
											$comments_result = mysql_query($comments_query);
			
											while($comments_row = mysql_fetch_array($comments_result))
												echo $comments_row['comment']."<br/>";
										?>
										</ul>
									</div>
									
									<!-- add a comment form -->
									<div class="new_comment">
										<form class="addcomment" name="addcomment" method="post" action="add_comments.php">
										<input type="hidden" value="<?php echo $book_uid; ?>" class="book_uid" />
										<textarea name="comment" class="comment" rows="2" cols="36" placeholder="Add a comment"></textarea>
										<input class="submit_button" type="submit" value="Add Comment" data-theme="b"/>
										</form>
									</div>
								</div>
								
								<!-- allow users to favorite books -->
								<div class="favorite" data-id="<?php echo $book_uid; ?>">
									<button>Favorite</button>
								</div>
								
								<!-- allow users to delete books -->
								<div class="deletebook" data-id="<?php echo $book_uid; ?>">
									<button>Remove</button>
								</div>
							</div>
							
							<?php
						}
					?>
				</div>
			</div>
		</div>
	</body>
</html>
