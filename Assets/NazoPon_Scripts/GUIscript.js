#pragma strict

var clapButton:Texture2D;
var angerButton:Texture2D;
var IknowButton:Texture2D;
var IdontknowButton:Texture2D;
var blackTexture:Texture2D;

var chatStyle:GUIStyle;

private var chats = new Array("\n","\n","\n","\n");
private var chatLabel:String;

private var user_name;

function Start(){
	user_name = "(ユーザー名)";
}

function OnGUI(){
	var wx = Screen.width;
	var wy = Screen.height;
	
	if( GUI.Button( Rect(wx*5/9, wy*27/32, wx*2/9, wy/8), clapButton) ){
		addChat(user_name + ":\nありがとう！");
	}
	if( GUI.Button( Rect(wx*7/9, wy*27/32, wx*2/9, wy/8), angerButton) ){
		addChat(user_name + ":\nおいおい！");
	}
	if( GUI.Button( Rect(wx*5/9, wy*23/32, wx*2/9, wy/8), IknowButton) ){
		addChat(user_name + ":\n自信あり！");
	}
	if( GUI.Button( Rect(wx*7/9, wy*23/32, wx*2/9, wy/8), IdontknowButton) ){
		addChat(user_name + ":\n分からん…");
	}
	
	var origA = GUI.color.a;
	GUI.color.a = 0.6f;
	GUI.DrawTexture( Rect(0, wy*23/32, wx*5/9, wy/4), blackTexture);
	GUI.color.a = origA;
	
	GUI.Label( Rect(0, wy*23/32, wx*5/9, wy/4), chatLabel, chatStyle);
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