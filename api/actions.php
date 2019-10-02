<?php 
require_once './config/config.php';
require_once './classes/Blog.php';

$blog = new Blog();
$json = "";

//RESTFUL API FOR HENDELING THE REQUESTS
switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $json = $blog->getAllPosts(); 
    break;


    case "POST":
        $json = $blog->addPost($_POST);
    break;


    case "PUT":
        $json = $blog->updatePost($_REQUEST);
    break;


    case "DELETE":
        $json = $blog->deletePost($_REQUEST);
    break;
}
echo json_encode($json);