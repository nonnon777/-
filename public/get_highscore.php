<?php
function GetFileName(){
    $filename = "public/game/highscore.csv";
    return $filename;
}
 
$allData = file_get_contents(GetFileName());
echo $allData;
?>