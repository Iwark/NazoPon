#pragma strict
var chat = "";
	
var ChatLine;
	
private var style:GUIStyle;

private var chats = new Array("","","","","","","","","","");
private var chatLabel:String;
private var ChatShow = new Array("","","","","","","","","","");
private var b_sum : int[] = [0,0,0,0,0,0,0,0,0,0];

var user_name = "ユーザー:";
var count = 0;

function Start(){
	style = new GUIStyle();
	style.fontSize = Screen.width/20;
	style.normal.textColor = Color.black;
	
	var x = new Texture2D(1, 1);
		x.SetPixel(0,0,Color.white);
	style.normal.background = x;
	//user_name = "ユーザー:";
}

function OnGUI(){
	var wx = Screen.width;
	var wy = Screen.height;

	chat = GUI.TextField(Rect(wx*1/10, wy*17/32, wx*6/10, wy*2/32), chat, 48-user_name.Length);

	if( GUI.Button( Rect(wx*7/10, wy*17/32, wx*2/10, wy*2/32), "送信") ){
		var ChatText = user_name + chat;
		var ChatLength : int = ChatText.Length;
		Debug.Log(ChatLength);
		if(ChatText.Length>16&& ChatText.Length<32){
			var chat0 = ChatText.Substring(0, 16);
			var chat1 = ChatText.Substring(16, ChatText.Length-16);
			ChatText = chat0 + "\n" + chat1; 
			ChatLine = 2;
		}
		else if(ChatText.Length>32){
			var chat2 = ChatText.Substring(0, 16);
			var chat3 = ChatText.Substring(16, 16);
			var chat4 = ChatText.Substring(32, ChatText.Length-32);
			ChatText = chat2 + "\n" + chat3 + "\n" + chat4; 
			ChatLine = 3;
		}
		else{
			ChatLine = 1;
		}
		addChat(ChatText, ChatLine);
  		chat = GUI.TextField(Rect(wx*1/10, wy*17/32, wx*6/10, wy*2/32), "", 48-user_name.Length);
	}

	GUILayout.BeginVertical(GUILayout.ExpandHeight(true));
	GUI.Label( Rect(wx*1/9, wy*20/32, wx*8/10, wy*9/32), chatLabel, style);
	GUILayout.EndVertical();
}
function Update(){
	chatLabel = ChatShow.join("\n");
}

function addChat(a:String, b:int){
	/*for(var i=1; i<chats.length; i++){
		chats[i-1] = chats[i];
	}
	chats[chats.length-1] = a;
	*/	
	for(var i=chats.length-1; i>0; i--){
		Debug.Log("chats["+i+"]:="+chats[i]);
		chats[i] = chats[i-1];
		b_sum[i] = b_sum[i-1];
	}
	chats[0] = a;
	b_sum[0] = b;
	count = 0;
	for(var j = 0; j < 10; j++){
		count+=b_sum[j];
		if(count<10){
			ChatShow[j] = chats[j];
			Debug.Log("count = "+count);
		}
		else{
			ChatShow[j] = "";
		}
	}
}