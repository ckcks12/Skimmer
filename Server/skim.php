<?php

header("Content-Type: text/html; charset=UTF-8");    

// measure time elapsed
CHECK_TIME1();

$url = isset($_GET["url"]) ? $_GET["url"] : "";
$no_parse = isset($_GET["no_parse"]) ? true : false;

if( mb_strlen($url) < 2 )
{
	exit();
}

$c = curl_init();
curl_setopt($c, CURLOPT_URL, $url);
curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($c, CURLOPT_HTTPHEADER, array
	(
		"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.63 Safari/537.36"
	)
);
$html = curl_exec($c);
curl_close($c); 

// encode to utf8
$encoding = mb_detect_encoding($html, array("ASCII", "UTF-8", "EUC-KR", "ISO-8859-1"));
if( $encoding != "UTF-8" )
{
	$html = mb_convert_encoding($html, "UTF-8", $encoding);
}

if( ! preg_match("/<body.*?>.*?<.*?\/body.*?>/is", $html, $match) )
{
	die("body parse error");
}
$html = $match[0];

/*
if( ! preg_match('/id="main_content".*?>(.*?)$/is', $html, $match) )
{
	die("main_content not found");
}
*/

$html = preg_replace('/(<script.*?<[\\b]*\/script[\\b]*>)/is', '', $html);
$html = html_entity_decode($html);
$html = strip_tags($html);
$html = preg_replace("/([\\b\r\n\r\t]+)/s", " ", $html); 

if( $no_parse ) 
{
	die($html);
}

// extract
$word_arr = explode(" ", $html);
$word_freq_arr = array_count_values($word_arr); 
arsort($word_freq_arr);

// output 
$word_freq_arr_key = array_keys($word_freq_arr);
$skim = array();
for( $i=0; $i<6; $i++ )
{
	if( count($word_freq_arr_key) == $i )
	{
		break;
	}
	else if(  ord($word_freq_arr_key[$i]) == 0 )
	{
		continue;
	}
	$skim[] = $word_freq_arr_key[$i];
}

echo json_encode($skim);

/*
foreach( $word_freq_arr as $word => $freq )
{
	if( ord($word) != 0 && $freq > 2 )
	{
		echo "(".ord($word).") ".$word." : ".$freq."<br/>\n";
	}
}
*/
 
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
	die("//time elapsed : ".($t - $GLOBALS["START_TIME"]));
}
?>
