var r_arr = document.getElementsByClassName("r");
if( r_arr.length > 0 )
{
	for( var i=0; i<r_arr.length; i++ )
	{
		r_arr[i].parentNode.innerHTML = word("화면크기") + word("충동구매") + word("골드") + r_arr[i].parentNode.innerHTML;
	}
}

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