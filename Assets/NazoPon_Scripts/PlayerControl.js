#pragma strict

var speed : float = 9.0;
var MOVE_FRAME:int = 5;

private var moveDirection : Vector3 = Vector3.zero;
private var controller:CharacterController;

private var vehicle:GameObject;
private var script:VehicleMove; //VehicleMove.js
private var initial_time:float;
private var problem_time:float;
private var loop_time:float;

private var reply_sent:boolean;

private var speedScale = 0;
private var is_stop = false;
private var migi:boolean;
private var last_pos_x:float;

//前回のUpdateでloop_countがいくつだったか
private var prev_loop_count:int;

//Webと通信
private var wss:WebSocketScript;

private var frame:int = 0;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function Start()
{
	vehicle = GameObject.Find("NazoPon");
	script = vehicle.GetComponent(VehicleMove);

	initial_time = script.initial_time;
	problem_time = script.problem_time;
	loop_time = script.loop_time;
    
    prev_loop_count = script.loop_count;

    reply_sent = false;
    
	controller = GetComponent(CharacterController);
}


function Update() 
{
	var ctime = script.getTime();
	
	
	
	if(reply_sent == true){
		if( is_stop == true){
			speedScale = 0;
		}else if( speedScale != 0 && Mathf.Floor(last_pos_x*10) == Mathf.Floor(transform.localPosition.x*10) ){
			speedScale = 0;
			is_stop = true;
		}else if(migi == true) speedScale = 1;
		else speedScale = -1;
	}else{
		is_stop = false;
		//iOS
		var ax = Input.acceleration.x;
		if(ax < -0.5){
			speedScale = 1;
		}else if(0.5 < ax){
			speedScale = -1;
		}else{
			speedScale = 0;
		}
		//エディタ用
		if(speedScale == 0) speedScale = Input.GetAxis("Horizontal");
	}

	//アニメーション切り替え
	if(speedScale > 0.1){
		transform.localRotation = Quaternion.Euler(0,90,0);
		animation.Play("walk1");	
	}else if(speedScale < -0.1){	
		transform.localRotation = Quaternion.Euler(0,-90,0);
		animation.Play("walk1");	
	}else{
		transform.localRotation = Quaternion.Euler(0,0,0);
		animation.Play("Idle");	
	}
	
	moveDirection = transform.TransformDirection( Vector3(0,0,Mathf.Abs(speedScale) ) );
	moveDirection *= speed;

	last_pos_x = transform.localPosition.x;
	if(frame % MOVE_FRAME == 0)
		wss.MoveCharacter(transform.localPosition.x, transform.localPosition.y, transform.localPosition.z );
	frame++;
	controller.Move(moveDirection * Time.deltaTime);

	//問題表示終了時、自分が正解か間違いか送信
	if(!reply_sent && ctime >= initial_time + script.loop_count*loop_time + problem_time){
		if(transform.localPosition.x > -0.75){
			migi=true;
		}else{
			migi=false;
		}
		if(migi == script.migi_correct){
			wss.ReplyAnswer("correct");
		}else{
			wss.ReplyAnswer("wrong");
		}
        reply_sent = true;
	}
    
    //ループしたら(loop_countが更新されたら)
    if(reply_sent && script.loop_count > prev_loop_count){
        reply_sent = false;
    }
    
    prev_loop_count = script.loop_count;
}