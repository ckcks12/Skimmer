<?php

// measure time elapsed
CHECK_TIME1();

$url = isset($_GET["url"]) ? $_GET["url"] : "";

if( mb_strlen($url) < 2 )
{
	exit();
}

$c = curl_init();
curl_setopt($c, CURLOPT_URL, $url);
curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
$html = curl_exec($c);
curl_close($c);

if( ! preg_match("/<body.*?>.*?<.*?\/body.*?>/is", $html, $match) )
{
	die("body parse error");
}

$html = $match[0];
$html = strip_tags($html);
/*$html = preg_replace("/<.*?script.*\/script.*?>/is", "", $html);*/
$html = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $html);
$html = preg_replace("/([\b\r\n]+)/s", " ", $html);
$html = htmlspecialchars_decode($html);

// extract
$word_arr = array_count_values(explode(" ",$html));

//header("Content-Type: text/html; charset=UTF-8");
header("Content-Type: text/html; charset=EUC-KR");
//var_dump($html);
print_r($word_arr);

CHECK_TIME2();

?>

<?php

$START_TIME = 0;

function CHECK_TIME1()
{
	$GLOBALS["START_TIME"] = microtime(true);
}

function CHECK_TIME2()
{
	$t = microtime(true);
	die("<br><br>time elapsed : ".($t - $GLOBALS["START_TIME"])."<br>");
}
?>
