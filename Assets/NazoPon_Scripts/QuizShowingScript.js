#pragma strict

var skin:GUISkin;

private var initial_time = 2.0;
private var problem_time = 10.0;
private var loop_time = 18.0;

private var quiz_text:String;
private var left_text:String;
private var right_text:String;

function Start(){
	quiz_text = "クイズです！　正解を選んでね！";
	left_text = "不正解";
	right_text = "正解";
}

function OnGUI () {
	GUI.skin = skin;
	
	var wx = Screen.width;
	var wy = Screen.height;

	if(initial_time < Time.time && Time.time < initial_time + problem_time){
		GUI.Label( Rect(wx/9, wy/18, wx*7/9, wy*3/16), quiz_text);
		GUI.Label( Rect(wx/9, wy*5/18, wx*3/9, wy*2/16), left_text);
		GUI.Label( Rect(wx*5/9, wy*5/18, wx*3/9, wy*2/16), right_text);
	}
}