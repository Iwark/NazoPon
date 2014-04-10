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
	
	var x = new Texture2D(1, 1);
	x.SetPixel(0,0,Color.white);
	style.normal.background = x;

	user_name = "ユーザー:";
}

function OnGUI(){
	var wx = Screen.width;
	var wy = Screen.height;
	chat = GUI.TextField(Rect(wx*1/9, wy*27/32, wx*7/9, wy*2/32), chat, 30);

	if( GUI.Button( Rect(wx*6/9, wy*29/32, wx*2/9, wy*2/32), "送信") ){
		var ChatText = user_name + chat;
		var ChatLength : int = ChatText.Length;
		Debug.Log(ChatLength);
		if(ChatText.Length>18&& ChatText.Length<36){
			//var chat0 = ChatText.Substring(0, 13);
			var chat0 = ChatText.Substring(0, 18);
			var chat1 = ChatText.Substring(18, ChatText.Length-18);
			ChatText = chat0 + "\n" + chat1; 
			//ChatText = ChatText.Replace(/(\d)(?=(\d\d\d)+$)/g, "$1,");
		}
		/*if(ChatText.Length>36){
			//var chat0 = ChatText.Substring(0, 13);
			var chat2 = ChatText.Substring(0, 18);
		Debug.Log(chat2);
			var chat3 = ChatText.Substring(18, ChatText.Length-18);
					Debug.Log(chat3);
			var chat4 = ChatText.Substring(ChatText.Length-17, ChatText.Length-36);
						Debug.Log(chat4);
		ChatText = chat2 + "\n" + chat3 + "\n" + chat4; 
			//ChatText = ChatText.Replace(/(\d)(?=(\d\d\d)+$)/g, "$1,");
		}*/
		addChat(ChatText);
	}
	
	GUILayout.BeginVertical(GUILayout.ExpandHeight(true));
	GUI.Label( Rect(wx*1/9, wy*17/32, wx*7/9, wy*9/32), chatLabel, style);
    GUILayout.EndVertical();
}
function Update(){
	chatLabel = chats.join("\n");
}

function addChat(a:String){
	/*for(var i=1; i<chats.length; i++){
		chats[i-1] = chats[i];
	}
	chats[chats.length-1] = a;
	*/
	for(var i=chats.length-1; i>0; i--){
		chats[i] = chats[i-1];
	}
	chats[0] = a;
}