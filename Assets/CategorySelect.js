﻿#pragma strict

import MiniJSON;
import System.Collections.Generic;

var guiLayer : GUILayer;



public var rooms : GameObject[];
rooms = GameObject.FindGameObjectsWithTag("rooms");
public var make_room : GameObject[];
make_room = GameObject.FindGameObjectsWithTag("make_room");

public var text_make_room : GameObject;
text_make_room = GameObject.FindGameObjectWithTag("text_make_room");


public var RoomCount : int;
RoomCount = 2;//部屋の数を表示

private var wss:WebSocketScript;
private var trolleys:List.<System.Object>;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function Start () {
	guiLayer = Camera.main.GetComponent(GUILayer);
	
	//GameObject.Find("category0").SetActive(false);

	//make_room.renderer.enabled = false;
	var i: int=0;
	while(i <7) {
		make_room[i].SetActive(false);
		i++;
	}
	var j: int=0;
	while(j < 6) {
		rooms[j].SetActive(false);
		j++;
	}
	text_make_room.SetActive(false);

/*	while(j < RoomCount) {
		GameObject.Find("room0").SetActive(false);
		j++;
	}
*/

}

function Update () {

	if(Input.GetMouseButtonDown(0)){
	Debug.Log("touch!");
	var i: int=0;
	var j: int=0;
	var trolley:Dictionary.<String, System.Object>;

		//シーン上の全GUIElementに対して当たり判定
		var hit = guiLayer.HitTest (Input.mousePosition);
		if (Input.GetMouseButtonDown (0) && hit != null) {
			//イベント処理
			print (hit.name);
			
			//Color
			//hit.collider.renderer.material.color = Color(255, 120, 120, 1.0f);
			
			if(hit.name.Equals("Button0")) {

				GetTrolleys();

				if(trolleys.Count > 0){
					trolley = trolleys[0] as Dictionary.<String, System.Object>;
					Debug.Log("category :" + trolley["category"]);
				}
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				
				RoomButton();

				/*while(j<RoomCount){
					GameObject.Find("room"+j).SetActive(true);
					j++;
				}*/
				/*if(GUI.Button(Rect(30, 280, 50, 50), "Room1")){
					Debug.Log("touch!");
				}*/
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button1")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
					//make_room.SetActive(false);
					//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button2")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button3")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button4")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button5")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button6")) {
				while(i <7) {
					make_room[i].SetActive(false);
					i++;
				}
				while(j<RoomCount) {
					rooms[j].SetActive(true);
					j++;
				}
				text_make_room.SetActive(true);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.name.Equals("Button7")) {
				while(i <7) {
					make_room[i].SetActive(true);
					i++;
				}
				while(j<6) {
					rooms[j].SetActive(false);
					j++;
				}
				text_make_room.SetActive(false);
				//make_room.SetActive(false);
				//rooms.SetActive(true);
			}
			if(hit.tag.Equals("rooms")){
				GetTrolleys();

				if(trolleys.Count > 0){
					trolley = trolleys[0] as Dictionary.<String, System.Object>;
					wss.RideTrolley(trolley["category"],trolley["_id"]);
				}
				Application.LoadLevel("Roading");

			}
			if(hit.tag.Equals("make_room")){
				wss.RideTrolley("スポーツ",null);
				Application.LoadLevel("Roading");

			}
		}
	
	
	/*
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hitinfo : RaycastHit;
		if(Physics.Raycast(ray, hitinfo, 1000f)){
		var gameObject = hitinfo.collider.gameObject;
		Debug.Log(gameObject.tag);
		*/


		
	}

}

function GetTrolleys(){
	if(!trolleys || trolleys.Count == 0){
		trolleys = Json.Deserialize(wss.trolleys) as List.<System.Object>;
	}
}

function RoomButton () {
	if(GUI.Button(Rect(30, 280, 50, 50), "Room1")){
			Debug.Log("GUI!");
	}
	Debug.Log("RoomButton!");
}


/*function OnGUI {
	var user_name : string[];
	
	GUI.Label(Rect(0.5, 0.5, 0.5, 0.5), "Hello!!");
}*/
