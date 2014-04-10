#pragma strict

var clapButton:Texture2D;
var angerButton:Texture2D;
var IknowButton:Texture2D;
var IdontknowButton:Texture2D;
var chat = "";

private var style:GUIStyle;

private var chats = new Array("","","","","","","","","","");
private var chatLabel:String;

private var user_name;

function Start(){
	style = new GUIStyle();
	style.fontSize = 11;
	style.normal.textColor = Color.black;
	
/*	var x = new Texture2D(1, 1);
	x.SetPixel(0,0,Color.white);
	
	style.normal.background = x;
*/
	user_name = "(ユーザー)";
}

function OnGUI(){
	var wx = Screen.width;
	var wy = Screen.height;
	chat = GUI.TextField(Rect(wx*1/9, wy*27/32, wx*7/9, wy*2/32), chat, 16);

	if( GUI.Button( Rect(wx*6/9, wy*29/32, wx*2/9, wy*2/32), "送信") ){
		addChat(user_name + chat);
	}
	GUILayout.BeginVertical(GUILayout.ExpandHeight(true));
	GUI.Label( Rect(wx*1/9, wy*17/32, wx*5/9, wy/4), chatLabel, style);
    GUILayout.EndVertical();
}
function Update(){
	chatLabel = chats.join("\n");
}

function addChat(a:String){
	for(var i=1; i<chats.length; i++){
		chats[i-1] = chats[i];
	}
	chats[chats.length-1] = a;
}