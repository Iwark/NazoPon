#pragma strict

var speed : float = 9.0;

private var moveDirection : Vector3 = Vector3.zero;
private var controller:CharacterController;

function Start()
{
	controller = GetComponent(CharacterController);
}


function Update() 
{
	var speedScale = 0.0;
	
	//iOS
	var ax = Input.acceleration.x;
	if(ax < -1.8){
		speedScale = 1;
	}else if(1.8 < ax){
		speedScale = -1;
	}else{
		speedScale = 0;
	}
	//エディタ用
	speedScale = Input.GetAxis("Horizontal");
	
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

	controller.Move(moveDirection * Time.deltaTime);
	
	if(transform.localPosition.x > 0.5){
		//左右を送信(or正誤を送信)
		//print("migi");
	}else if(transform.localPosition.x < -2.0){
		//左右を送信(or正誤を送信)
		//print("hidari");
	}
}