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
		if( ! window.skimming )
		{
			skimmer();
			window.skimming = true;
		}
	}
	setTimeout(skimmerDaemon, 5000);
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
	var window.r_arr = document.getElementsByClassName("r"); 
	if( window.r_arr.length <= 0 )
	{	
		return setTimeout(skimmer, 1000);
	} 
	else
	{
		for( var i=0; i<window.r_arr.length; i++ )
		{
			window.r_arr[i].parentNode.innerHTML = skim(["화면", "골드", "어에에예예", "오잉~?"]) + window.r_arr[i].parentNode.innerHTML;
		}
	}
}
*/

window.skimmed_data = [];
function skimmer()
{
	window.r_arr = document.getElementsByClassName("r"); 
	if( window.r_arr.length <= 0 )
	{	
		return setTimeout(skimmer, 1000);
	} 

	var xhr = [];
	for( var i=0; i<window.r_arr.length; i++ )
	{
		xhr[i] = new XMLHttpRequest();
		xhr[i].idx = i;
		xhr[i].onreadystatechange = ((k) =>
		{
			return () =>
			{
				if( xhr[k].readyState == 4 )
				{
					//console.log("xhr[" + k + "] response : " + xhr[k].responseText);
					console.log("xhr[" + k + "] : " + xhr[k].responseText.length);
					if( xhr[k].responseText.length <= 10 )
					{
						var data = JSON.parse('{"status": "-1"}');
					}
					else
					{
						var data = JSON.parse(xhr[k].responseText);
					}

					if( window.skimmed_data.length < window.r_arr.length )
					{
						window.skimmed_data[window.skimmed_data.length] = data;
					}
					if( window.skimmed_data.length == window.r_arr.length )
					{
						for( var j=0; j<window.skimmed_data.length; j++ )
						{
							if( window.skimmed_data[j].status != 1 )
							{
								window.skimmed_data.splice(j, 1);
								j--;
							}
						}

						window.noun_list = [];
						window.noun_cnt = [];

						for( var j=0; j<window.skimmed_data.length-1; j++ )
						{
							for( var l=j+1; l<window.skimmed_data.length; l++ )
							{
								for( var jj=0; jj<window.skimmed_data[j].data.length; jj++ )
								{
									for( var ll=0; ll<window.skimmed_data[l].data.length; ll++ )
									{
										if( window.skimmed_data[j].data[jj].noun == window.skimmed_data[l].data[ll].noun )
										{
											window.noun_exist = false;
											for( window.noun_idx=0; window.noun_idx<window.noun_list.length; window.noun_idx++ )
											{
												if( window.noun_list[window.noun_idx] == window.skimmed_data[j].data[jj].noun )
												{
													window.noun_cnt[window.noun_idx]++;
													window.noun_exist = true;
													break;
												}
											}

											if( ! window.noun_exist )
											{
												window.noun_list[window.noun_list.length] = window.skimmed_data[j].data[jj].noun;
												window.noun_cnt[window.noun_list.length] = 1;
											}
										}
									}
								}
							}
						}

						console.log(window.noun_list);
						console.log(window.noun_cnt);
						for( var j=0; j<window.skimmed_data.length; j++ )
						{
							for( var l=0; l<window.skimmed_data[j].data.length; l++ )
							{
								var data = window.skimmed_data[j].data[l];
								for( var m=0; m<window.noun_list.length; m++ )
								{
									if( data.noun == window.noun_list[m] )
									{
										console.log((j+1) + "번째 글의 [" + data.noun + "] 요약 : " + data.modifiers);
									}
								}
							}
						}
						window.r_arr[k].parentNode.innerHTML = skim([" "]) + window.r_arr[k].parentNode.innerHTML;
						window.skimming = false;
					}
				}
			}; 
		})(i);
		var url = window.r_arr[i].getElementsByTagName("a")[0].href;

		xhr[i].open("GET", "//skimmer.ckcks12.com/skim2.php?url="+url);
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