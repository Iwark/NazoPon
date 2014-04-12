#pragma strict

import MiniJSON;
import System.Collections.Generic;

var guiLayer : GUILayer;

var MAX_FRAME:int = 10;
private var frame:int = 0;

public var rooms : GameObject[];
rooms = GameObject.FindGameObjectsWithTag("rooms");

//「プロフィール」
public var text_profile : GameObject;
text_profile = GameObject.FindGameObjectWithTag("text_profile");

//「クイズのジャンル選択」
public var text_select_category : GameObject;
text_select_category = GameObject.FindGameObjectWithTag("text_select_category");

// 「作る部屋のジャンルを選択」
public var make_room : GameObject;
make_room = GameObject.FindGameObjectWithTag("make_room");

// 「参加する部屋を選択」
public var text_make_room : GameObject;
text_make_room = GameObject.FindGameObjectWithTag("text_make_room");

public var RoomCount : int;
RoomCount = 2;//部屋の数を表示

//トロッコ
private var wss:WebSocketScript;
private var trolleys:List.<System.Object>;
private var trolley:Dictionary.<String, Object>;
public var trolley_style:GUIStyle;

//カテゴリリスト
private var categories = ["スポーツ","数学理科","文学歴史","雑学","芸能","アニゲー"];

//選択中のカテゴリ
private var chosenCategory:int = 0;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
	Debug.Log(Screen.width);
}

function OnGUI() {

	text_profile.GetComponent(GUIText).fontSize = Screen.width / 12;
	text_select_category.GetComponent(GUIText).fontSize = Screen.width / 12;
	make_room.GetComponent(GUIText).fontSize = Screen.width / 15;
	text_make_room.GetComponent(GUIText).fontSize = Screen.width / 15;

	trolley_style = new GUIStyle(GUI.skin.button);
	trolley_style.fontSize = Screen.width/20;

	if(frame % MAX_FRAME == 0) GetTrolleys();
	frame++;
	trolleys = Json.Deserialize(wss.trolleys) as List.<System.Object>;
	if(chosenCategory > 0 && trolleys != null) RenderTrolleys(chosenCategory);
}

function Start () {
	guiLayer = Camera.main.GetComponent(GUILayer);

	make_room.SetActive(false);

	chosenCategory = 7;
}

function Update () {

	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	if(trolley != null && trolley["correct_way"] != null){
		Debug.Log(trolley["correct_way"]);
		Application.LoadLevel("MainScene");
	}

	if(Input.GetMouseButtonDown(0)){
		var trolley:Dictionary.<String, System.Object>;

		//シーン上の全GUIElementに対して当たり判定
		var hit = guiLayer.HitTest (Input.mousePosition);
		if (Input.GetMouseButtonDown (0) && hit != null) {
			var buttons = ["Button1","Button2","Button3","Button4","Button5","Button6","Button0","Button7"];
			for(var i:int=0; i<buttons.length; i++){
				if(hit.name.Equals(buttons[i])){
					GetTrolleys();
					chosenCategory = i+1;
					// wss.RideTrolley("3",null);
				}
			}
			// if(hit.name.Equals("Button0")) {
			// 	while(i <7) {
			// 		make_room[i].SetActive(false);
			// 		i++;
			// 	}
			// 	while(j<RoomCount) {
			// 		rooms[j].SetActive(true);
			// 		j++;
			// 	}
			// 	text_make_room.SetActive(true);
			// }
			// if(hit.name.Equals("Button7")) {
			// 	while(i <7) {
			// 		make_room[i].SetActive(true);
			// 		i++;
			// 	}
			// 	while(j<6) {
			// 		rooms[j].SetActive(false);
			// 		j++;
			// 	}
			// 	text_make_room.SetActive(false);
			// }
			// if(hit.tag.Equals("rooms")){
			// 	GetTrolleys();
			// 	if(trolleys.Count > 0){
			// 		trolley = trolleys[0] as Dictionary.<String, System.Object>;
			// 		wss.RideTrolley(trolley["category"],trolley["_id"]);
			// 	}
			// 	Application.LoadLevel("Roading");
			// }
			// if(hit.tag.Equals("make_room")){
			//  	wss.RideTrolley("1",null);
			//  	Application.LoadLevel("Roading");
			// }
		}
	}
}

function RenderTrolleys(category){
	var category_trolleys:List.< Dictionary.<String, Object> > = new List.< Dictionary.<String, Object> >();
	if(category == 8){
		for(var c:int = 0; c<6; c++){
			var ctrr:Dictionary.<String, Object> = new Dictionary.<String, Object>();
			ctrr["category"] = c+1;
			ctrr["_id"] = null;
			category_trolleys.Add(ctrr);
		}
	}else{
		for(var i:int = 0; i<trolleys.Count; i++){
			var ctr:Dictionary.<String, Object> = trolleys[i] as Dictionary.<String, Object>;
			var ctr_num:int = ctr["category"];
			if(category == 7 || ctr_num == category) category_trolleys.Add(ctr);
		}
	}

	GUI.BeginScrollView(
		Rect(Screen.width/32, Screen.height*13/20, Screen.width - Screen.width/16, Screen.height*7/20), 
		Vector2(0, 0), 
		Rect(0, 0, Screen.width - Screen.width/16, Screen.height*7/20)
	);

	GUILayout.BeginVertical(GUILayout.ExpandHeight(true));
	


	for(var t:int = 0; t<category_trolleys.Count; t++){

		if(t%3 == 0) GUILayout.BeginHorizontal();

		var tr:Dictionary.<String, System.Object> = category_trolleys[t];
		var category_num:int = tr["category"];

		if(GUILayout.Button(categories[category_num-1], trolley_style, [GUILayout.MinWidth(Screen.width*3/10),GUILayout.MinHeight(Screen.width/4), GUILayout.ExpandWidth(false)])){
			wss.RideTrolley(tr["category"].ToString(),tr["_id"]);
		}

		if(t%3 == 2 || t == category_trolleys.Count-1) GUILayout.EndHorizontal();

	}
    GUILayout.EndVertical();
    GUI.EndScrollView();
}

function GetTrolleys(){
	wss.GetTrolleys();
}
