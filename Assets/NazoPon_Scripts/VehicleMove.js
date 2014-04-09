#pragma strict
private var speed = 50.0;
private var curve_start_pos = 90.0;
private var initial_time = 2.0;
private var problem_time = 10.0;
private var after_select_time = curve_start_pos/speed;
private var curve_time = 51.8/speed;
private var loop_time = 18.0;
private var rail_angle = 70.0;
	
private var loop_count:int;
private var curve_start_time = 0.0;
private var curve_end_time = 0.0;

private var going_migi:boolean;
private var migi_correct:boolean;
private var selected:boolean;
private var gameover:boolean;

function Start () {
	//ここで、各問題の正答が左右どちらかを取得？

	going_migi = false;
	migi_correct = true;
	selected = false;
	gameover = false;

	var stage_y = migi_correct ? 0 : -1000;
	transform.position = new Vector3(0, stage_y, -speed*(problem_time+initial_time));

	var camera1:Camera = transform.Find("Main Camera").GetComponent("Camera");
	var camera2:Camera = GameObject.Find("SubCameraA").GetComponent("Camera");
	camera1.enabled = true;
	camera2.enabled = false;

	loop_count=0;
	curve_start_time = initial_time + loop_count*loop_time + problem_time + after_select_time;
	curve_end_time = curve_start_time + curve_time;

}

function Update () {
	if(!gameover){

		//ここで、問題表示の間は多数決の結果を受信？

		if(curve_start_time < Time.time && Time.time < curve_end_time){
			var direction = going_migi ? 1 : -1;
			transform.Rotate(0, direction * (rail_angle/curve_time)*Time.deltaTime, 0);
		}else if(Time.time > curve_end_time && !selected){
			var direction2 = going_migi ? 1 : -1;
			transform.rotation = new Quaternion.Euler(0, direction2*rail_angle,0);
			selected = true;
		}

		var transY = 0.0;
		var transZ = speed*Time.deltaTime;
		
		//正解時
		if(migi_correct == going_migi){
			if(Time.time >= initial_time + loop_time*(loop_count+1)){
				var stage_y = migi_correct ? 0 : -1000;
	
				transform.position = new Vector3(0, stage_y, -speed*problem_time);
				transform.rotation = new Quaternion.Euler(0,0,0);
				loop_count += 1;
				curve_start_time = initial_time + loop_count*loop_time + problem_time + after_select_time;
				curve_end_time = curve_start_time + curve_time;
				selected = false;
			}
		
		//不正解時
		}else{
			var fall_start_time = initial_time + loop_time*(loop_count+1) - 2.5;
			var fall_end_time = fall_start_time + 2.0;
			if(fall_start_time < Time.time && Time.time < fall_end_time){
				transform.Rotate(45.0*Time.deltaTime, 0, 0);
				var t = Time.time - fall_start_time;
				var theta = 45.0 * t * Mathf.Deg2Rad;
				transY = (speed * Mathf.Sin(theta) - 21 * t * Mathf.Cos(theta))*Time.deltaTime;
				transZ = (speed * Mathf.Cos(theta) + 21 * t * Mathf.Sin(theta))*Time.deltaTime;
				
				if(fall_start_time +1.0 < Time.time){
					var camera1:Camera = transform.Find("Main Camera").GetComponent("Camera");
					var camera2:Camera = GameObject.Find("SubCameraA").GetComponent("Camera");
					if(camera1.enabled){
						camera2.enabled = true;
						camera1.enabled = false;
					}
				}
				
			}else if(Time.time > fall_end_time){
				
				if(Time.time > fall_end_time+3.0){
					gameover=true;
				}
			}
		}
		
		transform.Translate(0, transY, transZ);
	

	//ゲームオーバー時
	}else{
		//Debug.Log("game over.");
	}	
}