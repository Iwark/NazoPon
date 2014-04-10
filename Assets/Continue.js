#pragma strict

function Start () {

}

function OnGUI(){
	if ( GUI.Button( Rect(Screen.width/2-100, Screen.height/3, 80, 50), "Yes" )){
	Debug.Log("touch!");
	}
	if ( GUI.Button( Rect(Screen.width/2+20, Screen.height/3, 80, 50), "No" )){
	Debug.Log("touch!");
	}
	
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