#pragma strict
private var style:GUIStyle;
public var right : GameObject;
right = GameObject.Find("GameoverRight");
public var left : GameObject;
left = GameObject.Find("GameoverLeft");

private var vehicle:GameObject;
private var script:VehicleMove; //VehicleMove.js

private var wss:WebSocketScript;

function Start () {

	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);

	//vehicle = GameObject.Find("NazoPon");
	//script = vehicle.GetComponent(VehicleMove);

	style = new GUIStyle();
	style.fontSize = 27;
	style.normal.textColor = Color.white;
	
	if(wss.is_migi==false){//最後にまがったのが左の時
		right.SetActive(false);
	}
	else{//最後にまがったのが右の時
		left.SetActive(false);
	}
}

function OnGUI(){
	if ( GUI.Button( Rect(Screen.width/2-100, Screen.height/3, 80, 50), "Yes" )){
		Application.LoadLevel("MainScene");
	}
	if ( GUI.Button( Rect(Screen.width/2+20, Screen.height/3, 80, 50), "No" )){
		Debug.Log("Select_Category");
	}
	GUI.Label( Rect(Screen.width*1/10, Screen.height*2/10, Screen.width*5/9, Screen.height/4), "コンティニューしますか？", style);
	
	
/*	var wx = Screen.width;
	var wy = Screen.height;
	//var text : string;
	GUI.Label( Rect(0, wy*23/32, wx*5/9, wy/4), chatLabel, style);
	//text = GUI.TextField(rect1, text, 16);

	if( GUI.Button( Rect(wx*5/9, wy*27/32, wx*2/9, wy/8), clapButton) ){
		addChat(user_name + ":\nありがとう！");
	}
*/
}


function Update () {

}