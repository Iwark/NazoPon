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

//Sound
var seikai : AudioSource;
var seikaiBool : boolean  = true;
//Seikai = this.gameObject.GetComponent("Sound_Seikai");
seikai = GameObject.Find("Sound_Seikai").GetComponent("AudioSource");

var count : AudioSource;
count = GameObject.Find("Sound_CountDown").GetComponent("AudioSource");

var countBool1 : boolean = true;
var countBool2 : boolean = true;
var countBool3 : boolean = true;
var countBool4 : boolean = true;
var countBool5 : boolean = true;

var count0 : AudioSource;
count0 = GameObject.Find("Sound_0second").GetComponent("AudioSource");
var countBool0 : boolean = true;

var kansei : AudioSource;
kansei = GameObject.Find("Sound_Kansei").GetComponent("AudioSource");
var kanseiBool : boolean = true;

//texture
public var seikai_texture : GameObject;
seikai_texture = GameObject.Find("Seikai");

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function Start(){
	//print("width:"+wx+"  height:"+wy);

	vehicle = GameObject.Find("NazoPon");
	script = vehicle.GetComponent(VehicleMove);
	
	initial_time = script.initial_time;
	problem_time = script.problem_time;
	loop_time = script.loop_time;
	
	problemStyle.fontSize = Mathf.Floor(wx/14);
	choiceLStyle.fontSize = Mathf.Floor(wx/15);
	choiceRStyle.fontSize = Mathf.Floor(wx/15);
	countdownStyle.fontSize = Mathf.Floor(wx/6);
	seikaiStyle.fontSize = Mathf.Floor(wx*4/15);
	seikaiStyle.normal.textColor = Color.red;
	seikai_texture.SetActive(false);
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
				if(countBool1){
					count.Play();
					countBool1 = false;
				}
		}else if(t-4 < ctime && ctime < t-3){
			countdownStyle.fontSize = countdownFirstFontSize*1.2;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "4", countdownStyle);
				if(countBool2){
					count.Play();
					countBool2 = false;
				}
		}
		else if(t-3 < ctime && ctime < t-2){
			countdownStyle.fontSize = countdownFirstFontSize*1.4;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "3", countdownStyle);
				if(countBool3){
					count.Play();
					countBool3 = false;
				}
		}
		else if(t-2 < ctime && ctime < t-1){
			countdownStyle.fontSize  = countdownFirstFontSize*1.8;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "2", countdownStyle);
				if(countBool4){
					count.Play();
					countBool4 = false;
				}
		}
		else if(t-1 < ctime && ctime < t){
			countdownStyle.fontSize  = countdownFirstFontSize*2.2;
			GUI.Label( Rect(wx*2/18, wy*1/32, wx*14/18, wy*12/32), "1", countdownStyle);
				if(countBool5){
					count.Play();
					countBool5 = false;
				}
		}
		else if(t < ctime){
				if(countBool0){
					count0.Play();
					countBool0 = false;
				}
		}
		else{
			countBool0 = true;
			countBool1 = true;
			countBool2 = true;
			countBool3 = true;
			countBool4 = true;
			countBool5 = true;
		}
		/*if(ctime == t-4 || ctime == t-3 || ctime == t-2 || ctime == t-1 || ctime == t){
			countBool = true;
			
		}*/
		seikai_texture.SetActive(false);
		if(script.is_seikai){
			if( (t+4.5 < ctime && ctime < t+5.2)
			 || (t+5.5 < ctime && ctime < t+6.2) ){
				GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "正解！", seikaiStyle);
				//seikai_texture.SetActive(true);
				if(seikaiBool){
					seikai.Play();
				}
			}
			if(t+6.3 < ctime && ctime < t+6.5){
				seikaiBool = true;
				if(kanseiBool){
					kansei.Play();
					kanseiBool = false;
				}
			}
			else{
					kanseiBool = true;
			}
		}
		
	//ゲームオーバー時
	}else{
		countdownStyle.fontSize = countdownFirstFontSize;
		GUI.Label( Rect(wx*2/18, wy*5/32, wx*14/18, wy*7/32), "GAME OVER", countdownStyle);
	}
}
