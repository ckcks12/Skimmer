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

$html = preg_replace('/(<script.*?<[\\b]*\/script[\\b]*>)/is', '', $html);
$html = html_entity_decode($html);
$html = strip_tags($html);
$html = preg_replace("/[\\s]{2}/s", "", $html);
$html = preg_replace("/[\\s]+/s", " ", $html);

if( $no_parse ) 
{
	die($html);
}

// nlp
$arr = nlp($html);
$arr2 = array();
$max = 12;
$max = count($arr) > $max ? $max : count($arr);
for( $i=0; $i<$max; $i++ )
{
	$arr2[] = $arr[$i];
}
echo json_encode($arr2);
exit();

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

<?php

function nlp($str)
{
	// encode to euc-kr
	$encoding = mb_detect_encoding($str, array("ASCII", "UTF-8", "EUC-KR", "ISO-8859-1"));
	if( $encoding != "EUC-KR" )
	{
		$str = mb_convert_encoding($str, "EUC-KR", $encoding);
	}

	$str_query = urlencode($str);
	$str_query = str_replace("%00%A0", "+", $str_query);

	$c = curl_init();
	curl_setopt($c, CURLOPT_URL, "http://nlp.kookmin.ac.kr/cgi-bin/indexT.cgi");
	curl_setopt($c, CURLOPT_POST, 1);
	curl_setopt($c, CURLOPT_HTTPHEADER, array
	(
		"User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.63 Safari/537.36",
		"Referer: http://nlp.kookmin.ac.kr/cgi-bin/indexT.cgi",
		"Content-Type: application/x-www-form-urlencoded",
		"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"Accept-Language: en-US,en;q=0.8,ko;q=0.6"
	));
	curl_setopt($c, CURLOPT_POSTFIELDS, "Question=".$str_query);
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	$html = curl_exec($c);
	curl_close($c);

	$html = explode("----------------------------------------------------------------------", $html)[2];
	$html = explode("\n", $html);


	$arr = array();
	foreach( $html as $line )
	{
		if( preg_match_all("/\\s+(\\S+)/", $line, $match) )
		{
			$tmp = $match[1][3];
			// encode to utf-8
			$encoding = mb_detect_encoding($tmp, array("ASCII", "UTF-8", "EUC-KR", "ISO-8859-1"));
			if( $encoding != "UTF-8" )
			{  
				$tmp = mb_convert_encoding($tmp, "UTF-8", $encoding);
			}
			$arr[] = $tmp;
		}
	}

	return $arr;
}

?>
