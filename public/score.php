<?php
// 上位10位まで保存
$MaxCount = 10;
 
mainFunc();
 
function GetFileName(){
    $filename = "game/highscore.csv";
    return $filename;
}
 
function sortByKey($key_name, $sort_order, $array) {
    foreach ($array as $key => $value) {
        $standard_key_array[$key] = $value[$key_name];
    }
    array_multisort($standard_key_array, $sort_order, $array);
    return $array;
}
 
function mainFunc(){

    $referer = $_SERVER['HTTP_REFERER'];
    if(strpos($referer,'https://nonnon777-original-we-41.deno.dev/')  === false)
        return;
 
    $stack = array();
 
    // csvファイルが存在するならデータを配列に変換
    if(file_exists(GetFileName())){
        $allData = file_get_contents(GetFileName());
 
        $lines = explode("\n", $allData);
        foreach ( $lines as $line ) {
            $words = explode(",", $line);
            if($words[0] == "")
                continue;
 
            $newArray = array(
                'name'=> $words[0],
                'score'=> $words[1],
                'now'=> $words[2],
            );
 
            $stack[] = $newArray;
        }
    }
 
    // 配列に送られてきたデータを追加
    $name = "";
    $score = 0;
 
    $name = $_POST["name"];
    $score = $_POST["score"];
    
    $now = date("Y-m-d H:i:s");
 
    // 不適切なデータは処理しない
    // nameがない、長すぎるなど
    if(mb_strlen($name) > 16)
        return;
 
    if(mb_strlen($score) > 16)
        return;
 
    if($name == "")
        return;
    if (false !== strpos($name, '<')) {
        return;
    }
    if (false !== strpos($name, '>')) {
        return;
    }
    if (false !== strpos($name, ' ')) {
        return;
    }
    if (false !== strpos($name, '\n')) {
        return;
    }
    if (false !== ctype_alpha($score)){
        return;
    }
    
 
    $newArray = array(
        'name'=> $name,
        'score'=> $score,
        'now'=> $now,
    );
    $stack[] = $newArray;
 
    // socreが大きい順に配列をソート
    $sorted_array = sortByKey('score', SORT_DESC, $stack);
 
    // 上位からMaxCountだけデータを取得してcsvファイルとして保存する
    global $MaxCount;
 
    $dataCount = count($sorted_array);
    $str = "";
    for($i = 0; $i < $dataCount; $i++){
        if($i >= $MaxCount)
            break;
 
        $str .= join(",", $sorted_array[$i]);
        $str .= "\n";
    }
 
    file_put_contents( GetFileName(), $str, LOCK_EX );
}