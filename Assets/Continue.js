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
	style.fontSize = Screen.width/20;
	style.normal.textColor = Color.white;
	
	if(wss.is_migi==false){//最後にまがったのが左の時
		right.SetActive(false);
	}
	else{//最後にまがったのが右の時
		left.SetActive(false);
	}
}

function OnGUI(){

	var buttonStyle:GUIStyle = new GUIStyle(GUI.skin.button);
	buttonStyle.fontSize = Screen.width/12;

	if ( GUI.Button( Rect(Screen.width/2-(Screen.width/3)-50, Screen.height/3, Screen.width/3, Screen.height/7), "Yes", buttonStyle )){
		Application.LoadLevel("MainScene");
	}
	if ( GUI.Button( Rect(Screen.width/2+50, Screen.height/3, Screen.width/3, Screen.height/7), "No", buttonStyle  )){
		Debug.Log("Select_Category");
	}
	GUI.Label( Rect(Screen.width*1/10, Screen.height*2/10, Screen.width*5/9, Screen.height/4), "コンティニューしますか？", style);
	
	
}


function Update () {

}