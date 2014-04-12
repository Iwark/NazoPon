#pragma strict

private var vehicle:GameObject;
private var script:VehicleMove; //VehicleMove.js

private var tilt_angle = 15.0;

private var initial_rotation;
function Start () {
	vehicle = GameObject.Find("NazoPon");
	script = vehicle.GetComponent(VehicleMove);

	initial_rotation = transform.localRotation;
}

function Update () {
	var time = script.getTime();
	var c_s_time = script.curve_start_time;
	var c_e_time = script.curve_end_time;

	if(c_e_time > c_s_time && c_s_time > 0.0 ){
		var direction = script.going_migi ? -1 : 1 ;

		if(c_s_time-1.0 < time && time <= c_s_time-0.9){
			transform.Rotate( 0,0, direction * (tilt_angle/0.1) * Time.deltaTime);
		}else if(c_e_time < time && time <= c_e_time+1.0){
			transform.Rotate( 0,0, -direction * (tilt_angle/1.0) * Time.deltaTime);
		}else if(c_e_time+1.0 < time && time < c_e_time+1.2){
			transform.localRotation = initial_rotation;
		}
	}
}