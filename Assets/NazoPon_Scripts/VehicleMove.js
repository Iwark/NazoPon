#pragma strict
private var speed = 50.0;
private var curve_start_pos = 90.0;
var initial_time = 2.0;
var problem_time = 10.0;
private var curve_time = 51.8/speed;
var loop_time = 18.0;
private var rail_angle = 70.0;

private var scene_start_time:float;

var quiz_updated:boolean = false;
var is_seikai = false;
var is_handan = false;
var is_cameraA = false;
var is_start = true;

var loop_count:int=0;
private var curve_start_time = 0.0;
private var curve_end_time = 0.0;

private var PLAYER_MAX = 7;

var going_migi:boolean;
var migi_correct:boolean;
private var selected:boolean;
var gameover:boolean;

private var mainCamera:Camera;
private var subCameraA:Camera;
private var subCameraB:Camera;

var playerBoy:GameObject;
var players:GameObject[];
var player_count:int = 0;

//ユーザーリスト
private var wss:WebSocketScript;
private var users:List.< Dictionary.<String, Object> >;
var trolley:Dictionary.<String, Object>;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
	//users = trolley["users"];
}

function Start () {
	
	CreateMap();

	going_migi = true;
	selected = false;
	gameover = false;

	loop_count=0;

	players = new Array(7);
	addPlayer();
	players[0].tag = "Player";
	//addPlayer();
	
	print("1s after");
	scene_start_time = Time.time - 1;
}

function addPlayer(){
	
	if(player_count < PLAYER_MAX){
		players[player_count] = Instantiate(playerBoy, transform.position + Vector3(Random.Range(-1.5f,1.5f), 8, -(6.5+1.5*player_count)), Quaternion.identity);
		players[player_count].transform.parent = transform;
		player_count++;
	}
}

function Update () {
	if(!gameover){
		var ctime = getTime();

		if(is_start && ctime >= initial_time){
			var stage_first_y = migi_correct ? 0 : -1000;
			transform.position = new Vector3(0, stage_first_y, -speed*problem_time);
			is_start = false;
		}

		//ここで、問題表示の間は多数決の結果を受信？

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
		if(ctime > curve_end_time+0.5 && !is_handan){
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
			var fall_start_time = initial_time + loop_time*(loop_count+1) - 2.5;
			var fall_end_time = fall_start_time + 2.0;
			if(fall_start_time < ctime && ctime < fall_end_time){
				transform.Rotate(45.0*Time.deltaTime, 0, 0);
				var t = ctime - fall_start_time;
				var theta = 45.0 * t * Mathf.Deg2Rad;
				transY = (speed * Mathf.Sin(theta) - 21 * t * Mathf.Cos(theta))*Time.deltaTime;
				transZ = (speed * Mathf.Cos(theta) + 21 * t * Mathf.Sin(theta))*Time.deltaTime;
				
				if(fall_start_time +1.0 < ctime){
					if(mainCamera.enabled){
						//print(migi_correct);
						if(is_cameraA){ subCameraA.enabled = true; }else{ subCameraB.enabled = true; }
						mainCamera.enabled = false;
					}
				}
				
			}else if(ctime > fall_end_time){
				
				if(ctime > fall_end_time+2.5){
					gameover=true;
				}
			}
		}
		
		transform.Translate(0, transY, transZ);

	//ゲームオーバー時
	}else{
		Application.LoadLevel("Result");
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
	return Time.time - scene_start_time;
}


