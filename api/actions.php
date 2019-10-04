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
        parse_str(file_get_contents("php://input"), $request);
        $json = $blog->updatePost($request);
    break;


    case "DELETE":
        parse_str(file_get_contents("php://input"), $request);
        $json = $blog->deletePost($request);
    break;
}
echo json_encode($json);