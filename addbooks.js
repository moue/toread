$(document).ready(function() {  // wait for DOM ready event

	// mark favorites with localstorage
	function markFavorites() {
		var favorites = ""; 
		var i = 1;
	
		// number of items in the database
		var favoritesLength = localStorage.length; 

		// loop through each item in the database
		for (i = 1; i < favoritesLength; i++) {

			// grab key and value
			var itemKey = localStorage.key(i);
			var values = localStorage.getItem(itemKey);
			
			// if div# is saved, mark book as favorite
			var favdiv = $("div:jqmData(id='"+itemKey+"')");
			var check = favdiv.find().attr('data-theme', 'a');
			var check2 = favdiv.find('.ui-btn-text').text('Unfavorite');
		}
	};
	
	markFavorites();
	
	/*
	 * add book
	 */
	 
    // grab a reference to the form
    var form = $("#addbook");
    
    // bind to the form's 'submit' event
    form.submit(function() {
    
		// get user input
        var title = $("#title").val();
        var author = $("#author").val();
		var image_url = $("#image_url").val();
		
		// check that form is filled correctly
		if (title.length == 0  || author.length == 0) {
			return false;
		}
		
		// make sure data is reasonable length
		if (title.length > 256 || author.length > 512) {
			return false;
		}
		
		// add placeholder image if there is no image
		if (image_url == null) {
			image_url = "/placeholder.png";
		}
		
		/*
		 * checks if the image url leads to real image
		 */
		 
		function check_image(image_url) {
			var test = new Image();
			test.onError = test_failed;
			test.src = image_url;
		}
		
		/*
		 * gives book a default image if the image url doesn't exist
		 */
		
		function test_failed() {
			image_url = "/placeholder.png";
		}
		
		test_failed();
		check_image();
		
        // send the data to 'add_book.php'
        $.ajax({
            url: "add_book.php",
            type: "post",
            data: {title:title,author:author,image_url:image_url},
			success: function(data) {
				// create new div to hold all new book info
				var newdiv = $("<div data-role='page'>").append('<div class="book" id="'+data+'"></div>')
													   .css("display", "none");
				// 
				$("body").append(newdiv);
				
				// add image to book info
				var image = $("<img>").attr({src: image_url, class: 'cover'});
				
				// allow new book info to be added under book div
				var bookDiv = $("div#"+data).append(image, "<br/>", title, "<br/>", author);
				
				
				// style new post to be like rest of page
				bookDiv.append(
					'<div class="show_comments">' +
						'<button>Comment(s)</button>' +
					'</div>' +
					'<div class="comment_list">'+
						'<div class="new_comment">' +
							'<form class="addcomment" name="addcomment" method="post" action="add_comments.php">' +
							'<input type="hidden" value="'+data+'" class="book_uid" />' +
							'<textarea name="comment" class="comment" rows="2" cols="36" placeholder="Add a comment"></textarea>' +
							'<input type="submit" value="Add Comment" data-theme="b"/>' +
							'</form>' +
						'</div>' +
					'</div>'+
					'<div class="favorite" data-id="'+data+'">'+
					'<button>Favorite</button>'+
					'</div>'+
					'<div class="deletebook" data-id="'+data+'">'+
					'<button>Remove</button>'+
					'</div>'
				);
				
				var styledBook = newdiv.page().html();
				
				// add new post to book 
				$("div#booklist").append(styledBook);

				// keep page clean by removing unused divs
				newdiv.remove();
			},
			dataType: "text"
        });
        
        return false; // prevent page refresh
		
    });
	
    $('.new_comment').delegate('.addcomment', 'submit', function() {
		// get user input
        var comment = $(this).find(".comment").val();
		var book_uid = $(this).find('.book_uid').val();
		
		// check that comment exists
		if (comment.length == 0)
			return false;
		
        // send the data to 'add_comments.php'
        $.ajax({
            url: "add_comments.php",
            type: "post",
            data: {comment:comment, book_uid:book_uid},
			success: function(data) {
				$('div#'+data).find('.comment_list').prepend("<br/>"+comment);
			},
			dataType: "text"
        });
        
        return false; // prevent page refresh
    
    });
	
	/*
	 * delete books
	 */
	 
	$('div#booklist').delegate(".deletebook", "click", function () {
		
		// get book id 
		var delete_uid = $(this).attr('data-id');

        // send the data to 'delete_book.php'
        $.ajax({
            url: "delete_book.php",
            type: "post",
            data: {delete_uid:delete_uid},
			success: function(data) {
				$('div#'+data).remove();
			},
			dataType: "text"
        
		});
        return false; // prevent page refresh
    });
	
	// show comment list
	$('div#booklist').delegate("div.show_comments", "click", function () {
		$(this).siblings("div.comment_list").slideToggle("fast");
	});
	
	// allow users to favorite books
	$('div#booklist').delegate(".favorite", "click", function () {
		// if local storage is supported
		if (localStorage) {
			
			// get book uid
			var fav_uid = $(this).attr('data-id');
			// save fav_uid in local storage
			localStorage.setItem(fav_uid, 'true');
			// mark favorite 
			$(this).find().attr('data-theme', 'a');
			$(this).find('.ui-btn-text').text('Unfavorite');
			// allow users to unfavorite later
			$(this).attr('class', 'is_favorite');
		}
	});
	
	// allow users to unfavorite books
	$('div#booklist').delegate(".is_favorite", "click", function () {
		// if local storage is supported
		if (localStorage) {
			// get book uid
			var fav_uid = $(this).attr('data-id');
			// remove book uid from local storage
			localStorage.removeItem(fav_uid);
			// unmark favorite 
			$(this).find().attr('data-theme', 'c');
			$(this).find('.ui-btn-text').text('Favorite');
			// allow users to favorite later
			$(this).attr('class', 'favorite');
		}
	});
});
