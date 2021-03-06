﻿#pragma strict

var clapButton:Texture2D;
var angerButton:Texture2D;
var IknowButton:Texture2D;
var IdontknowButton:Texture2D;
var blackTexture:Texture2D;

var chatStyle:GUIStyle;

private var chats = new Array("\n","\n","\n","\n");
private var chatLabel:String;

private var user_name;

private var prev_messageCount:int = 0;

private var wx = Screen.width;
private var wy = Screen.height;

//Webと通信
private var wss:WebSocketScript;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function Start(){
	//user_name = "(ユーザー名)";
	chatStyle.fontSize = Mathf.Floor(wx/20);
}

function OnGUI(){
	if( GUI.Button( Rect(wx*5/9, wy*27/32, wx*2/9, wy/8), clapButton) ){
		//addChat(user_name + ":\nありがとう！");
		wss.SendMessage(null,"1");
	}
	if( GUI.Button( Rect(wx*7/9, wy*27/32, wx*2/9, wy/8), angerButton) ){
		//addChat(user_name + ":\nおいおい！");
		wss.SendMessage(null,"2");
	}
	if( GUI.Button( Rect(wx*5/9, wy*23/32, wx*2/9, wy/8), IknowButton) ){
		//addChat(user_name + ":\n自信あり！");
		wss.SendMessage(null,"3");
	}
	if( GUI.Button( Rect(wx*7/9, wy*23/32, wx*2/9, wy/8), IdontknowButton) ){
		//addChat(user_name + ":\n分からん…");
		wss.SendMessage(null,"4");
	}
	
	var origA = GUI.color.a;
	GUI.color.a = 0.6f;
	GUI.DrawTexture( Rect(0, wy*23/32, wx*5/9, wy/4), blackTexture);
	GUI.color.a = origA;
	
	//chatStyle.fontSize = 30;
	GUI.Label( Rect(0, wy*23/32, wx*5/9, wy/4), chatLabel, chatStyle);
}
function Update(){
	//会話ログを受信
	var messages:List.< Dictionary.<String, Object> > = wss.messages as List.< Dictionary.<String, Object> >;
	if(messages.Count > prev_messageCount){
		var emotion:Dictionary.<String, Object> = messages[messages.Count-1] as Dictionary.<String, Object>;
		var emoNum:int = parseInt( emotion["emotion"] as String);
		
		var user:Dictionary.<String, Object> = emotion["user"] as Dictionary.<String, Object>;
		
		if(emoNum==1){
			addChat(user["_id"] + ":\nありがとう！");			
		}else if(emoNum==2){
			addChat(user["_id"] + ":\nおいおい！");					
		}else if(emoNum==3){
			addChat(user["_id"] + ":\n自信あり！");			
		}else if(emoNum==4){
			addChat(user["_id"] + ":\n分からん…！");	
		}
		prev_messageCount++;
	}

	chatLabel = chats.join("\n");
}

function addChat(a:String){
	for(var i=1; i<chats.length; i++){
		chats[i-1] = chats[i];
	}
	chats[chats.length-1] = a;
}