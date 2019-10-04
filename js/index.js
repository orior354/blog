// ONLOAD SECTION


$(function () {
	getPosts();

	$('#form-submit').on('click', function () {
		savePost();
	});
});


// ONLOAD SECTION END


// FUNCTIONS SECTION


//addin the posts events (cant create them onload)
function addPostEvents() {
	$('.removePost').on('click', function () {
		let id = $(this).attr('data-id');
		removePost(id);
	});

	$('.updatePost').on('click', function(){
		let id = $(this).attr('data-id');
		let content = $(this).parent().find('.postContent').html();
		updatePost(id, content);
	});
}

//fetch posts from API
function getPosts() {
	$.ajax({
		url: "api/actions.php",
		method: "GET",
		dataType: 'json'
	}).done(function (response) {
		if (response.status === true) {
			console.log('getPosts response: ', response)
			buildPosts(response.data);
		}
		else {
			console.error("getPosts ajax request return status false: ", response);
		}
	});
}

//build posts onload async
function buildPosts(posts) {
	for (let post of posts) {
		let postElement = "\
		<div>\
		<div class='postContent'>" + post.body + "</div>\
		<button class='removePost' data-id='" + post.id + "'>Remove</button>\
		<button class='updatePost' data-id='" + post.id + "'>Update</button>\
		</div>\
		";
		$('.posts-container').append(postElement);
	}
	addPostEvents(); // because the post came as async call
}

//save submited post
function savePost() {
	let postBody = $('#post-body').val();
	let validPost = validatePost(postBody);

	if (!validPost) {
		console.warn("Please fill the body befor submitting the form");
		Swal.fire({
			type: 'error',
			title: 'Oops...',
			text: "Please fill the post body"
		});
		return
	}

	$.ajax({
		url: "api/actions.php",
		method: "POST",
		dataType: 'json',
		data: {
			body: postBody
		}
	}).done(function (response) {
		if (response.status === true) {
			console.log('getPosts response: ', response)
			reloadPosts();
			Swal.fire({
				position: 'center',
				type: 'success',
				title: 'Your post has been saved',
				showConfirmButton: false,
				timer: 1500
			});
			
		}
		else {
			errorMessage(response);
		}
	});
}

//remove post from db
function removePost(id) {
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
		if (result.value) {
			$.ajax({
				url: "api/actions.php",
				method: "DELETE",
				dataType: 'json',
				data: { id: id }
			})
			.done(function (response) {
				if (response.status === true) {
					reloadPosts();
					Swal.fire(
						'Deleted!',
						'Your Post has been deleted.',
						'success'
					);
				}
				else{
					errorMessage(response);
				}
			});
		}
	});
}

//update post
function updatePost(id, content) {
	Swal.fire({
		title: '<h1>Update post</h1>',
		type: 'info',
		html:
			'<textarea id="updateTextarea">'+content+'</textarea> ',
		showCloseButton: true,
		showCancelButton: true,
		preConfirm: function() {
			return new Promise((resolve, reject) => {
				resolve({
						body: $('#updateTextarea').val()
				});
			});
	}
	}).then((result) => {
		if(result.value){
			let data = { 'id': id, 'body': result.value.body};
			$.ajax({
				url: "api/actions.php",
				method: "PUT",
				contentType: 'application/json',
				dataType: 'json',
				data: data
			}).done(function (response) {
				if (response.status === true) {
					reloadPosts();
					Swal.fire(
						'Updated!',
						'Your Post has been updated.',
						'success'
					);
				}
				else{
					errorMessage(response);
				}
			});
		}
	});
}

//check if there is a post
function validatePost(postBody) {
	if (postBody.length > 0) return true;
	else return false;
}

//destroy all posts
function clearPosts() {
	$('.posts-container').empty();
}

//async recreating the posts
function reloadPosts() {
	clearPosts();
	getPosts();
}

//display error message
function errorMessage(response) {
	console.error("getPosts ajax request return status false: ", response);
	Swal.fire({
		type: 'error',
		title: 'Oops...',
		text: 'Something went wrong! try again later'
	});
}

// FUNCTIONS SECTION END