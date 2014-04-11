#pragma strict

private var initial_time:float;
private var problem_time:float;
private var loop_time:float;

private var quiz_text:String="";
private var left_text:String="";
private var right_text:String="";


var problemStyle:GUIStyle;
var choiceLStyle:GUIStyle;
var choiceRStyle:GUIStyle;
var countdownStyle:GUIStyle;
var seikaiStyle:GUIStyle;
private var countdownFirstFontSize:int = 38;

private var vehicle:GameObject;
private var script:VehicleMove; //VehicleMove.js

private var wx = Screen.width;
private var wy = Screen.height;

//Webと通信
private var wss:WebSocketScript;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function Start(){
	vehicle = GameObject.Find("NazoPon");
	script = vehicle.GetComponent(VehicleMove);
	
	initial_time = script.initial_time;
	problem_time = script.problem_time;
	loop_time = script.loop_time;
}

function Update (){
	//問題文と選択肢を受信
	var trolley:Dictionary.<String, Object> = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	
	//var quiz_updated = trolley["updated_at"];
	
	if(!script.quiz_updated){
		var quiz:Dictionary.<String, Object> = trolley["quiz"] as Dictionary.<String, Object>;
		var quiz_contents:String = quiz["contents"];
		var quiz_correct:String = quiz["correct_answer"];
		var quiz_wrong:String = quiz["wrong_answer"];
	
		quiz_text = quiz_contents;
		var r:int = trolley["correct_way"];
		if(r==1){
			left_text = quiz_wrong;
			right_text = quiz_correct;
			script.migi_correct = true;
		}else{
			left_text = quiz_correct;
			right_text = quiz_wrong;
			script.migi_correct = false;	
		}

		script.quiz_updated = true;
	}
	
	//Debug.Log("quizcontents:"+quiz_contents);
}

function OnGUI () {
	if(!script.gameover){
		var ctime = script.getTime();

		var t = initial_time + script.loop_count*loop_time + problem_time;
		if(t-problem_time < ctime && ctime < t){
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*5/32), quiz_text, problemStyle);
			GUI.Label( Rect(wx*1/18, wy*7/32, wx*7/18, wy*6/32), left_text, choiceLStyle);
			GUI.Label( Rect(wx*10/18, wy*7/32, wx*7/18, wy*6/32), right_text, choiceRStyle);
		}
		
		if(t-5 < ctime && ctime < t-4){
			countdownStyle.fontSize = countdownFirstFontSize;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "5", countdownStyle);
		}
		else if(t-4 < ctime && ctime < t-3){
			countdownStyle.fontSize = countdownFirstFontSize+8;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "4", countdownStyle);
		}
		else if(t-3 < ctime && ctime < t-2){
			countdownStyle.fontSize = countdownFirstFontSize+16;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "3", countdownStyle);
		}
		else if(t-2 < ctime && ctime < t-1){
			countdownStyle.fontSize  = countdownFirstFontSize+32;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "2", countdownStyle);
		}
		else if(t-1 < ctime && ctime < t){
			countdownStyle.fontSize  = countdownFirstFontSize+48;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "1", countdownStyle);
		}
		
		if(script.is_seikai){
			if( (t+4.5 < ctime && ctime < t+5.2)
			 || (t+5.5 < ctime && ctime < t+6.2) ){
				GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "正解！", seikaiStyle);
			}
		}
		
	//ゲームオーバー時
	}else{
		countdownStyle.fontSize = countdownFirstFontSize;
		GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "GAME OVER", countdownStyle);
	}
}
