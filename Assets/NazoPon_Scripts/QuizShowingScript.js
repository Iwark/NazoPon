#pragma strict

private var initial_time:float;
private var problem_time:float;
private var loop_time:float;

private var quiz_text:String[];
private var left_text:String[];
private var right_text:String[];

var problemStyle:GUIStyle;
var choiceLStyle:GUIStyle;
var choiceRStyle:GUIStyle;
var countdownStyle:GUIStyle;
var seikaiStyle:GUIStyle;
private var countdownFontSize:int;

private var vehicle:GameObject;
private var script:VehicleMove; //VehicleMove.js

private var wx = Screen.width;
private var wy = Screen.height;

function Start(){
	vehicle = GameObject.Find("NazoPon");
	script = vehicle.GetComponent(VehicleMove);
	
	quiz_text = new Array(script.PROBLEM_MAX);
	left_text = new Array(script.PROBLEM_MAX);
	right_text = new Array(script.PROBLEM_MAX);
	
	//問題文と選択肢を受信
	for(var i=0; i<quiz_text.length; i++){
		quiz_text[i] = "クイズです！　正解を選んでね！あいうえおあいうえお";
		left_text[i] = "不正解不正解不正解不正解不正解不正解";
		right_text[i] = "正解正解正解正解正解正解正解正解正解";
	}
	
	initial_time = script.initial_time;
	problem_time = script.problem_time;
	loop_time = script.loop_time;
	
	countdownFontSize = countdownStyle.fontSize;
	
}

function OnGUI () {
	if(!script.gameover){
		print(script.getTime());


		var t = initial_time + script.loop_count*loop_time + problem_time;
		if(t-problem_time < Time.time && Time.time < t){
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*5/32), quiz_text[script.loop_count], problemStyle);
			GUI.Label( Rect(wx*1/18, wy*7/32, wx*7/18, wy*6/32), left_text[script.loop_count], choiceLStyle);
			GUI.Label( Rect(wx*10/18, wy*7/32, wx*7/18, wy*6/32), right_text[script.loop_count], choiceRStyle);
		}
		
		if(t-5 < Time.time && Time.time < t-4){
			countdownStyle.fontSize = countdownFontSize;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "5", countdownStyle);
		}
		if(t-4 < Time.time && Time.time < t-3){
			countdownStyle.fontSize = countdownFontSize+8;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "4", countdownStyle);
		}
		if(t-3 < Time.time && Time.time < t-2){
			countdownStyle.fontSize = countdownFontSize+16;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "3", countdownStyle);
		}
		if(t-2 < Time.time && Time.time < t-1){
			countdownStyle.fontSize  = countdownFontSize+32;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "2", countdownStyle);
		}
		if(t-1 < Time.time && Time.time < t){
			countdownStyle.fontSize  = countdownFontSize+48;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "1", countdownStyle);
		}
		
		if(script.going_migi == script.migi_correct[script.loop_count]){
			if( (t+4.5 < Time.time && Time.time < t+5.2)
			 || (t+5.5 < Time.time && Time.time < t+6.2) ){
				GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "正解！", seikaiStyle);
			}
		}
		
	//ゲームオーバー時
	}else{
		countdownStyle.fontSize = countdownFontSize;
		GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "GAME OVER", countdownStyle);
	}
}
