(function skimmer()
{
	var r_arr = document.getElementsByClassName("r");
	if( r_arr.length > 0 )
	{
		for( var i=0; i<r_arr.length; i++ )
		{
			r_arr[i].parentNode.innerHTML = word("화면크기") + word("충동구매") + word("골드") + r_arr[i].parentNode.innerHTML;
		}
	}
});
//document.querySelectorAll(".r")[0].getElementsByTagName("a")[0].href
(function skimmer_test()
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if( xhr.readyState == 4 )
		{
			console.log( xhr.responseText );
		}
	};

	var r_arr = document.getElementsByClassName("r");
	/*
	if( r_arr.length > 0 )
	{
		for( var i=0; i<r_arr.length; i++ )
		{
			r_arr[i].parentNode.innerHTML = word("화면크기") + word("충동구매") + word("골드") + r_arr[i].parentNode.innerHTML;
		}
	}
	*/
	var url = r_arr[0].getElementsByTagName("a")[0].href;

	xhr.open("GET", "//skimmer.ckcks12.com/skim.php?url="+url);
	xhr.send();
})();

function log(s)
{
	chrome.extension.sendMessage(
	{
		action: "getSource", 
		source: s
	});
}

function word(str)
{
	return "<span style='color: gray; font-size: 9pt; margin-right: 10px'>" + str + "</span>";
}

/*

function get_source(document_body){
    return document_body.innerHTML;
}

chrome.extension.sendMessage({
    action: "getSource",
    source: get_source(document.body)
});
*/