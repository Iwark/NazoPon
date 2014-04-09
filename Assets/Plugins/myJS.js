#pragma strict

public var message : String = "myJS is called";
//private var csScript : WebSocketScript;

Debug.Log("wheee");

public function showMessage2() {
	Debug.Log("wheeee");
    print("showMessage(myJS.js) is called.");
}

public function showMessage(dict) {
    print("showMessage(myJS.js) is called." + dict);
}

function Awake () {
	//csScript = this.GetComponent("WebSocketScript");
	//csScript.rideTrolley();
}

function Start () {

}

function Update () {

}