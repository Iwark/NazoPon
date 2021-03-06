﻿#pragma strict
private var SPEED = 180.0;
private var speed = SPEED;
private var curve_start_pos = 90.0;
var initial_time = 5.0;
var problem_time = 10.0;
private var curve_time = 51.8/speed;
var loop_time = 18.0;
private var rail_angle = 70.0;

private var FALL_START = 3 + 4.0 / 180 * SPEED;

//private var scene_start_time:float;

var quiz_updated:boolean = false;
var is_seikai = false;
var is_handan = false;
var is_cameraA = false;
var is_start = true;
var is_tilted = false; //CartTilt.jsから変更される

var loop_count:int=0;
var curve_start_time = 0.0;
var curve_end_time = 0.0;

private var PLAYER_MAX = 7;

var going_migi:boolean;
var migi_correct:boolean;
private var selected:boolean;
var gameover:boolean;
var gameover_time:float = 0.0f;

private var mainCamera:Camera;
private var subCameraA:Camera;
private var subCameraB:Camera;

var playerBoy:GameObject;
var playerBoyControllerbale:GameObject;
var players:GameObject[];
var available_player_count:int = 0;

var first_timestamp:long;
var time_of_U:float;
var time_offset:float;

//ユーザーリスト
private var wss:WebSocketScript;
var trolley:Dictionary.<String, Object>;

var Last:boolean;

//sound
private var hazure:AudioSource;
private var hazureBool:boolean = true;
private var sakebi:AudioSource;

private var kotei_y:float;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
	hazure = GameObject.Find("Sound_Hazure").GetComponent("AudioSource");
	sakebi = GameObject.Find("Sound_Sakebi").GetComponent("AudioSource");
}

function Start () {
	
	players = new Array(7);

	going_migi = true;
	selected = false;
	gameover = false;

	loop_count=0;
	// addPlayer();
	// players[0].tag = "Player";
	//addPlayer();


	//遅れて入ってきた場合に経過時間を計算する
	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;

	/* 旧
	var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
	var timestamp = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	*/

	first_timestamp = trolley["current_time"];
	var u_at:long = trolley["updated_at"];
	var cn:int = trolley["current_num"];
	time_of_U = (first_timestamp - u_at)/1000.0f;

	if(cn==1){
		time_offset = time_of_U;
		loop_count = 0;
	}else{
		time_offset = time_of_U + loop_time*(cn-2) + initial_time + problem_time;
		loop_count = ( time_of_U < loop_time-problem_time ) ? (cn-2) : (cn-1) ;
	}

	/*旧
	scene_start_time = Time.time - time_offset;
	*/
	CreateMap();

	transform.Translate(0, 0, (time_offset - loop_count*loop_time)*speed);
}

function Update () {

	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	var users:List.< Object > = wss.users as List.< Object >;
	if(users != null && users.Count != available_player_count){
		available_player_count = 0;
		var player_count:int =  users.Count;
		var new_players:GameObject[];
		new_players = new Array(7);
		var already = false;
		for(var i:int = 0; i<users.Count; i++){

			var user:Dictionary.<String, Object> = users[i] as Dictionary.<String, Object>;

			//既にいるユーザーはそのまま格納
			for(var u:int = 0; u<PLAYER_MAX; u++){
				var player:GameObject = players[u] as GameObject;
				if(player != null){
					if(player.name == user["_id"]){
						new_players[i] = player;
						available_player_count++;
					}
				}
			}

			//新しく入ったユーザーである場合
			if(new_players[i] == null){
				//自機だったら
				if(user["_id"] == wss.user_id){
					if(!already){
						new_players[i] = Instantiate(playerBoyControllerbale, transform.position + Vector3(Random.Range(-1.5f,1.5f), 8, -(6.5+1.5*player_count)), Quaternion.identity);
						new_players[i].name = user["_id"];
						already = true;
						kotei_y = new_players[i].transform.localPosition.y;
						print("koteiY "+kotei_y);
					}
				}
				//自機でなければ
				else{
					new_players[i] = Instantiate(playerBoy, transform.position + Vector3(Random.Range(-1.5f,1.5f), 8, -(6.5+1.5*player_count)), Quaternion.identity);
					new_players[i].name = user["_id"];
				}
				available_player_count++;
				if(new_players[i] != null && transform != null && transform.FindChild("CartCenter") != null)
					new_players[i].transform.parent = transform.FindChild("CartCenter").transform;
				else
					Debug.Log("transform not found.");
			}

		}
		players = new_players;
	}

	var right:int = 0;
	for(var p:int =0; p < available_player_count; p++){
		var pp:GameObject = players[p] as GameObject;
		if(pp == null) break;
		for(var uu:int = 0; uu<users.Count; uu++){
			var u_user:Dictionary.<String, Object> = users[uu] as Dictionary.<String, Object>;
			if(u_user == null) break;
			if(u_user["_id"] == pp.name){
				if(u_user["_id"] != wss.user_id){
					var vec:Vector3 = new Vector3(u_user["x"],u_user["y"],u_user["z"]);
					pp.transform.localRotation = Quaternion.Euler(0,0,0);
					pp.transform.Translate(vec - pp.transform.localPosition);
				}
				if(pp.transform.localPosition.x > -0.75) right++;
				else right --;
			}
		}
	}

	//結果の受信が間に合わなかった場合
	if(right > 0) going_migi = true;
	else if(right < 0) going_migi = false;
	else going_migi = !migi_correct;

	var ctime = getTime();
	if(!gameover){

		var cn:int = trolley["current_num"];
		if(time_of_U > initial_time || cn > 1 ){
			is_start = false;
		}
		if(is_start && ctime >= initial_time){
			var stage_first_y = migi_correct ? 0 : -1000;
			transform.position = new Vector3(0, stage_first_y, -speed*problem_time);
			is_start = false;
		}

		//ここで、問題表示の間は多数決の結果を受信？
		if(wss.result == "correct"){
			going_migi = migi_correct;
			wss.result = "done";
		}else if(wss.result == "wrong" || wss.result == "same"){
			going_migi = !migi_correct;
			wss.result = "done";
		}
		wss.is_migi = going_migi;

		//曲がる
		if(curve_start_time < ctime && ctime < curve_end_time){
			var direction = going_migi ? 1 : -1;
			transform.Rotate(0, direction * (rail_angle/curve_time)*Time.deltaTime, 0);
		}else if(ctime > curve_end_time && !selected){
			var direction2 = going_migi ? 1 : -1;
			transform.rotation = new Quaternion.Euler(0, direction2*rail_angle,0);
			selected = true;
		}

		//正誤格納&問題更新
		if(ctime > curve_end_time+0.1 && !is_handan){
			is_handan = true;
			is_seikai = (migi_correct == going_migi);
			is_cameraA = migi_correct;
			quiz_updated = false;
		}

		var transY = 0.0;
		var transZ = speed*Time.deltaTime;

		//正解時
		if(is_seikai){
			if(ctime >= initial_time + loop_time*(loop_count+1)){
				loop_count += 1;
				CreateMap();
				transform.position = new Vector3(0, transform.position.y, -speed*problem_time);
			}
		//不正解時
		}else{
			var fall_start_time = initial_time + loop_time*(loop_count+1) - FALL_START;
			var fall_end_time = fall_start_time + 2.0;
			if(fall_start_time < ctime && ctime < fall_end_time){
				speed -= 1;
				if(speed < 10) speed = 10;
				transform.Rotate(45.0*Time.deltaTime, 0, 0);
				var t = ctime - fall_start_time;
				var theta = 45.0 * t * Mathf.Deg2Rad;
				transY = (speed * Mathf.Sin(theta) - 21 * t * Mathf.Cos(theta))*Time.deltaTime;
				transZ = (speed * Mathf.Cos(theta) + 21 * t * Mathf.Sin(theta))*Time.deltaTime;
				if(hazureBool){
					hazure.Play();
					hazureBool = false;
				}

				if(fall_start_time +1.0 < ctime){
					if(mainCamera.enabled){
						sakebi.Play();
						if(is_cameraA){ subCameraA.enabled = true; }else{ subCameraB.enabled = true; }
						mainCamera.enabled = false;
					}
				}

			}else if(ctime > fall_end_time){
				if(ctime > fall_end_time+2.5){
					gameover_time = ctime;
					gameover=true;
				}
			}
		}

		transform.Translate(0, transY, transZ);

	//ゲームオーバー時
	}else{
		if(ctime - gameover_time > 2.0f){
			Last = going_migi;
			Application.LoadLevel("Result");
		}
	}
}

function CreateMap(){
	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	if(trolley["correct_way"] == 1) migi_correct = true;
	else migi_correct = false;
	Debug.Log("the correct way is right: "+migi_correct);

	var stage_y = migi_correct ? 0 : -1000;
	transform.position = new Vector3(0, stage_y, -speed*(problem_time+initial_time));
	transform.rotation = new Quaternion.Euler(0,0,0);
	speed = SPEED;

	mainCamera = transform.Find("Main Camera").GetComponent("Camera");
	subCameraA = GameObject.Find("SubCameraA").GetComponent("Camera");
	subCameraB = GameObject.Find("SubCameraB").GetComponent("Camera");
	mainCamera.enabled = true;
	subCameraA.enabled = false;
	subCameraB.enabled = false;

	var after_select_time = curve_start_pos/speed;
	curve_start_time = initial_time + loop_count*loop_time + problem_time + after_select_time;
	curve_end_time = curve_start_time + curve_time;

	selected = false;
	is_seikai = false;
	is_handan = false;

}

function getTime(){

	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	var timestamp:long = trolley["current_time"];
	var temp_t:float = (timestamp - first_timestamp)/1000.0f;
	return temp_t + time_offset;
}


