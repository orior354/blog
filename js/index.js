//INIT SECTION
const tinymceToolbar	= "forecolor backcolor | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent";
var comments
//INIT SECTION END


// ONLOAD SECTION


$(function () {
	getComments();

	tinymce.init({
		selector: '#comment-body',
		toolbar: tinymceToolbar
  });

	$('#form-submit').on('click', function () {
		savePost();
	});

	$(".load-more").on('click', function(){
		getComments(10, comments.length, false);
	});
});


// ONLOAD SECTION END


// FUNCTIONS SECTION


//addin the comments events (cant create them onload)
function addCommentEvents() {
	$('.remove-comment').on('click', function () {
		let id = $(this).attr('data-id');
		removeComment(id);
	});

	$('.update-comment').on('click', function(){
		let id = $(this).attr('data-id');
		let content = $(this).parent().parent().find('.comment-content').html();
		updateComment(id, content);
	});
}

//fetch comments from API
function getComments(limit = 10, offset = 0, firstLoad = true) {
	$.ajax({
		url: "api/actions.php",
		method: "GET",
		dataType: 'json',
		data: {limit: limit, offset: offset}
	}).done(function (response) {
		if (response.status === true) {
			console.log('getComments response: ', response);
			buildComments(response.data);
			if(firstLoad) comments = response.data;
			else comments = comments.concat(response.data);
		}
		else {
			console.error("getComments ajax request return status false: ", response);
		}
	});
}

//build comments onload async
function buildComments(comments) {
	if(comments.length == 0){
		$('.load-more').text('All comments loaded');
		return
	}
	for (let comment of comments) {
		console.log('comment: ', comment)
		let commentElement = "\
		<div class='row'>\
			<div class='comment-container hidden col-md-8 col-sm-12 mx-auto'>\
				<div class='comment-content'>" + comment.body + "</div>\
				<div class='btn-section'>\
					<button class='update-comment' data-id='" + comment.id + "'>U</button>\
					<button class='remove-comment' data-id='" + comment.id + "'>X</button>\
				</div>\
				<div class='date-section'>\
						<span>Updated at: "+comment.updated_at+"</span>\
						<br>\
					<span>Created at: "+comment.created_at+"</span>\
				</div>\
			</div>\
		</div>\
		";
		$('.comments-container').append(commentElement);
	}
	let hiddenComments = $('.hidden');
	addCommentEvents(); // because the comment came as async call

	if(hiddenComments.length > 0) animateIn(hiddenComments);
}

//save submited comment
function savePost() {
	tinyMCE.triggerSave();
	let commentBody = $('#comment-body').val();
	let validPost = validatePost(commentBody);

	if (!validPost) {
		console.warn("Please fill the body befor submitting the form");
		Swal.fire({
			type: 'error',
			title: 'Oops...',
			text: "Please fill the comment body"
		});
		return
	}

	$.ajax({
		url: "api/actions.php",
		method: "POST",
		dataType: 'json',
		data: {
			body: commentBody
		}
	}).done(function (response) {
		if (response.status === true) {
			console.log('getComments response: ', response)
			reloadComments();
			Swal.fire({
				position: 'center',
				type: 'success',
				title: 'Your comment has been saved',
				showConfirmButton: false,
				timer: 1500
			});
			
		}
		else {
			errorMessage(response);
		}
	});
}

//remove comment from db
function removeComment(id) {
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
					reloadComments();
					Swal.fire(
						'Deleted!',
						'Your Comment has been deleted.',
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

//update comment
function updateComment(id, content) {
	Swal.fire({
		title: '<h1>Update comment</h1>',
		html:
			'<textarea id="updateTextarea">'+content+'</textarea> ',
		showCloseButton: true,
		showCancelButton: true,
		onOpen: function() {
			tinymce.init({
				selector: '#updateTextarea',
				toolbar: tinymceToolbar,
			});
		},
		onClose: function() {
			tinymce.execCommand('mceRemoveEditor',true,"updateTextarea");
		},
		preConfirm: function() {
			tinyMCE.triggerSave();
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
					reloadComments();
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

//check if there is a comment
function validatePost(commentBody) {
	if (commentBody.length > 0) return true;
	else return false;
}

//destroy all comments
function clearComments() {
	$('.comments-container').empty();
}

//async recreating the comments
function reloadComments() {
	$('.load-more').text('Load More ...');
	clearComments();
	getComments();
}

//display error message
function errorMessage(response) {
	console.error("getComments ajax request return status false: ", response);
	Swal.fire({
		type: 'error',
		title: 'Oops...',
		text: 'Something went wrong! try again later'
	});
}

//animate the comments enters
function animateIn(elements) {
	$(elements[0]).animate({
	opacity: 1,
	minHeight: 100
  }, 300, function() {
    if(elements[1] != undefined) {
			elements = elements.splice(1, elements.length);
			animateIn(elements);
		}
  });
}

// FUNCTIONS SECTION END