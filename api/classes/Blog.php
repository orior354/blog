<?php
Class Blog {
    private $con;
    private $lastError;
    // make connection to db
    function __construct() {
        try {
            //const from config file
            $this->con = new PDO("mysql:host=" . HOST . ";dbname=" . DB . "", USER, PASS);
        }
        catch(PDOException $e)
        {
            echo "Connection failed: " . $e->getMessage(); die();
        }
    }
    
    public function getComments($get) {
        $limit = (int)$get['limit'];
        $offset = (int)$get['offset']; 
        $sql = "SELECT * FROM `comments` ORDER BY updated_at DESC LIMIT $offset,$limit";
        try{
            $message = new stdClass();
            $message->status = true;
            $stms = $this->con->prepare($sql);
            $stms->execute();
            $data = $stms->fetchAll(PDO::FETCH_OBJ);
            $message->data = $data;
            return $message;
        }
        catch (PDOException $e){
            $this->lastError = $e->getMessage();
            return errorMessage();
        }
    }
    
    public function addComment($comment) {
         //incase missing params
        if( !isset($comment['body']) ){ 
            $this->lastError = "Missing body parameter";
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = array(':body' => $comment['body']);
        $sql = "INSERT INTO comments 
                SET body = :body,
                created_at = NOW(),
                updated_at = NOW()
                ";
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $id = $this->con->lastInsertId();
            $data = $this->getCommentByID(['id' => $id]); // fetching new user data
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    public function updateComment($request) {
        if( !isset($request['id']) || !isset($request["body"]) ){ 
            $this->lastError = "Missing put request parameters: " . json_encode($request);
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = [
            ":body" => $request["body"],
            ":id" => $request['id']
        ];
        $sql = "UPDATE comments SET body = :body, updated_at = NOW() WHERE id = :id";
        
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $data = $this->getCommentByID(['id' => $request['id']]); // fetching new user data
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    public function deleteComment($request) {
        if( !isset($request['id']) ){ 
            $this->lastError = "Missing id parameter";
            return $this->errorMessage();
        }

        $message = new stdClass();
        $params = array("id" => $request['id']);
        $sql = "DELETE FROM comments WHERE id = :id";
        try{
            $data = $this->getCommentByID(['id' => $request['id']]); // fetching new user data
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    private function getCommentByID($get) {
        //incase missing params
        if( !isset($get['id']) ){ 
            $this->lastError = "Missing id parameter";
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = array(':id' => $get['id']);
        $sql = "SELECT * FROM `comments` WHERE id = :id";
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            return $stms->fetchAll(PDO::FETCH_OBJ);
        }
        catch (PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    private function errorMessage() {
       $message = new stdClass();
       $message->status = false;
       $message->errorMessage = $this->lastError;
       return $message;
    }
}
