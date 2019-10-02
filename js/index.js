// ONLOAD SECTION
$(function() {
    getPosts();
});
// ONLOAD SECTION END

function getPosts(){
    $.ajax({
        url: "api/actions.php",
        method: "GET",
        dataType: 'json'
    }).done(function(response) {
        if(response.status === true){
            console.log('getPosts response: ', response)
            buildPosts(response.data);
        }
        else{
            console.error("getPosts ajax request return status false: ", response);
        }
    });
}

function buildPosts(posts) {
    for(let post of posts) {
        $('.posts-container').append('<div>' + post.body + '</div>');
    }
}