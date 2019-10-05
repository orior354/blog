<?php 
require_once './config/config.php';
require_once './classes/Blog.php';

$blog = new Blog();
$json = "";

//RESTFUL API FOR HENDELING THE REQUESTS
switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $json = $blog->getComments($_GET); 
    break;


    case "POST":
        $json = $blog->addComment($_POST);
    break;


    case "PUT":
        parse_str(file_get_contents("php://input"), $request);
        $json = $blog->updateComment($request);
    break;


    case "DELETE":
        parse_str(file_get_contents("php://input"), $request);
        $json = $blog->deleteComment($request);
    break;
}
echo json_encode($json);