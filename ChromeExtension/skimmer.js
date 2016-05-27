skimmerDaemon();

function skimmerDaemon()
{
	if( ! isGoogleSearch(location.href) )
	{
		return false;
	}

	wait();
	if( document.querySelector("#skim") == null )
	{
		skimmer();
	}
	setTimeout(skimmerDaemon, 3000);
}

function skim(word)
{ 
	var str = "<div id='skim'>";
	for( i=0; i<word.length; i++ )
	{ 	
		str += "<span style='color: gray; font-size: 9pt; margin-right: 10px'>";
		str += word[i];
		str += "</span>"; 
	} 
	str += "</div>";
	return str;
} 

/*
function skimmer()
{  
	var r_arr = document.getElementsByClassName("r"); 
	if( r_arr.length <= 0 )
	{	
		return setTimeout(skimmer, 1000);
	} 
	else
	{
		for( var i=0; i<r_arr.length; i++ )
		{
			r_arr[i].parentNode.innerHTML = skim(["화면", "골드", "어에에예예", "오잉~?"]) + r_arr[i].parentNode.innerHTML;
		}
	}
}
*/

function skimmer()
{
	var r_arr = document.getElementsByClassName("r"); 
	if( r_arr.length <= 0 )
	{	
		return setTimeout(skimmer, 1000);
	} 

	var xhr = [];
	for( var i=0; i<r_arr.length; i++ )
	{
		xhr[i] = new XMLHttpRequest();
		xhr[i].idx = i;
		xhr[i].onreadystatechange = ((k) =>
		{
			return () =>
			{
				if( xhr[k].readyState == 4 )
				{ 
					console.log("xhr[" + k + "] response : " + xhr[k].responseText);
					var data = JSON.parse(xhr[k].responseText);
					r_arr[k].parentNode.innerHTML = skim(data) + r_arr[k].parentNode.innerHTML;
				}
			}; 
		})(i);
		var url = r_arr[i].getElementsByTagName("a")[0].href;

		xhr[i].open("GET", "//skimmer.ckcks12.com/skim.php?url="+url);
		xhr[i].send();
		console.log("xhr[" + i + "] : " + url); 
	}
}

function wait()
{ 
	if( document.readyState == "complete" )
	{
		return true;
	}
	else
	{
		return setTimeout(wait, 1000);
	}
}

function isGoogleSearch(url)
{
	var google_url_regex = /\w*\.google\..*?\//i;

	if( google_url_regex.exec(url) != null )
	{
		return true;
	}
	else
	{
		return false;
	}
}