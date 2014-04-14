#pragma strict

import MiniJSON;
import System.Collections.Generic;

var guiLayer:GUILayer;
private var LAYOUT_MARGIN:float = Screen.width*7/160;
private var LAYOUT_CATEGORIES_TOP:float = Screen.height*3/10;
private var LAYOUT_TROLLIES_TOP:float = Screen.height*5/8;

var SENDING_INTERVAL:int = 10;
private var sendingCount:int = 0;

private var profileLabelStyle:GUIStyle = new GUIStyle();
private var labelStyle:GUIStyle = new GUIStyle();
private var categoryButtonStyle:GUIStyle = new GUIStyle();

private var is_creating_new_room:boolean = false;

//トロッコ
private var wss:WebSocketScript;
private var trolleys:List.<System.Object>;
private var trolley:Dictionary.<String, Object>;

//カテゴリリスト
private var categories = ["スポーツ","数学理科","文学歴史","雑学","芸能","アニゲー"];
public var category_normal_image:Texture2D;
public var category_active_image:Texture2D;

//選択中のカテゴリ
private var chosenCategory:int = 0;

function Awake() {
	wss = GameObject.Find("WebSocket").GetComponent(WebSocketScript);
}

function OnGUI() {

	profileLabelStyle.margin.top = Screen.width / 80;
	profileLabelStyle.margin.left = Screen.width / 80;
	profileLabelStyle.fontSize = Screen.width / 28;
	profileLabelStyle.normal.textColor = Color.white;
	RenderProfile();

	labelStyle.margin.left = Screen.width / 80;
	labelStyle.fontSize = Screen.width / 14;
	labelStyle.fontStyle = FontStyle.Bold;
	labelStyle.stretchWidth = false;
	labelStyle.normal.textColor = Color.white;
	RenderCategories(LAYOUT_CATEGORIES_TOP,"ジャンルで絞り込み", false);

	categoryButtonStyle.fontSize = Screen.width*9/160;
	categoryButtonStyle.margin = RectOffset(0, LAYOUT_MARGIN, LAYOUT_MARGIN, 0);
	categoryButtonStyle.padding.top = Screen.width * 13/320;

	if(sendingCount % SENDING_INTERVAL == 0) GetTrolleys();
	sendingCount++;
	trolleys = Json.Deserialize(wss.trolleys) as List.<System.Object>;
	if(!is_creating_new_room) RenderTrolleys(chosenCategory);

	if(is_creating_new_room) RenderCategories(LAYOUT_TROLLIES_TOP,"作成する部屋のジャンル", true);
}

function Start () {
	guiLayer = Camera.main.GetComponent(GUILayer);

	chosenCategory = 7;
}

function Update () {

	trolley = Json.Deserialize(wss.trolley) as Dictionary.<String, Object>;
	if(trolley != null && trolley["correct_way"] != null){
		Debug.Log(trolley["correct_way"]);
		Application.LoadLevel("MainScene");
	}

}

function RenderProfile(){
	GUILayout.BeginArea (Rect (Screen.width/10, Screen.height/6, Screen.width - LAYOUT_MARGIN*2, LAYOUT_CATEGORIES_TOP));
	GUILayout.Label("プレイヤー",profileLabelStyle);
	GUILayout.Label("☆ 数学マスター ☆",profileLabelStyle);
	profileLabelStyle.margin.left = 300;
	var goldLabelStyle:GUIStyle = new GUIStyle(profileLabelStyle);
	goldLabelStyle.margin.left += LAYOUT_MARGIN;
	if(wss != null && wss.user != null && wss.user["money"] != null)
		GUILayout.Label(wss.user["money"].ToString()+"G", goldLabelStyle);
	else
		GUILayout.Label("5000G", goldLabelStyle);
	GUILayout.EndArea();
}

function RenderCategories(top:float, text:String, is_creating:boolean){

	GUILayout.BeginArea (Rect (LAYOUT_MARGIN, top, Screen.width - LAYOUT_MARGIN*2, LAYOUT_TROLLIES_TOP - LAYOUT_CATEGORIES_TOP));

	GUILayout.Label(text,labelStyle);

	for(var i:int = 0; i<categories.length; i++){
		categoryButtonStyle.padding.left = Screen.width / 40;
		if(categories[i].length == 2) categoryButtonStyle.padding.left += Screen.width * 9 / 160;
		if(i == chosenCategory -1 && !is_creating){
			categoryButtonStyle.normal.background = category_active_image;
			categoryButtonStyle.active.background = category_normal_image;
			categoryButtonStyle.normal.textColor = Color.white;
		}else{
			categoryButtonStyle.normal.background = category_normal_image;
			categoryButtonStyle.active.background = category_active_image;
			categoryButtonStyle.normal.textColor = Color.black;
		}

		if(i%3 == 0) GUILayout.BeginHorizontal();
		if(GUILayout.Button(
			categories[i],
			categoryButtonStyle,
			[GUILayout.Width(Screen.width*11/40),GUILayout.Height(Screen.width*11/80), GUILayout.ExpandWidth(false)])){
			if(is_creating_new_room && is_creating){
				wss.RideTrolley((i+1).ToString(),null);
			}else{
				if(chosenCategory == i+1) chosenCategory = 7;
				else chosenCategory = i+1;
				is_creating_new_room = false;
			}
		}
		if(i%3 == 2 || i == categories.length-1) GUILayout.EndHorizontal();

	}
	GUILayout.EndArea();
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
	}else if(trolleys != null){
		for(var i:int = 0; i<trolleys.Count; i++){
			var ctr:Dictionary.<String, Object> = trolleys[i] as Dictionary.<String, Object>;
			var ctr_num:int = ctr["category"];
			if(category == 7 || ctr_num == category) category_trolleys.Add(ctr);
		}
	}

	GUILayout.BeginArea (Rect (LAYOUT_MARGIN, LAYOUT_TROLLIES_TOP, Screen.width - LAYOUT_MARGIN*2, Screen.height - LAYOUT_TROLLIES_TOP));

	GUILayout.Label("部屋を選択",labelStyle);

	GUILayout.BeginHorizontal();

	categoryButtonStyle.padding.left = Screen.width / 20;
	categoryButtonStyle.normal.background = category_active_image;
	categoryButtonStyle.active.background = category_normal_image;
	categoryButtonStyle.normal.textColor = Color.white;
	if(GUILayout.Button("+ 新規", categoryButtonStyle, [GUILayout.Width(Screen.width*11/40),GUILayout.Height(Screen.width*11/80), GUILayout.ExpandWidth(false)])){
		if(chosenCategory < 7) wss.RideTrolley(chosenCategory.ToString(),null);
		else is_creating_new_room = true;
		// wss.RideTrolley(tr["category"].ToString(),tr["_id"]);
	}

	if(category_trolleys.Count == 0) GUILayout.EndHorizontal();

	for(var t:int = 1; t<category_trolleys.Count+1; t++){

		if(t%3 == 0) GUILayout.BeginHorizontal();

		var tr:Dictionary.<String, System.Object> = category_trolleys[t-1];
		var category_num:int = tr["category"];

		categoryButtonStyle.padding.left = Screen.width / 40;
		if(categories[category_num-1].length == 2) categoryButtonStyle.padding.left += Screen.width * 9 / 160;
		categoryButtonStyle.normal.background = category_normal_image;
		categoryButtonStyle.active.background = category_active_image;
		categoryButtonStyle.normal.textColor = Color.black;

		if(GUILayout.Button(categories[category_num-1], categoryButtonStyle, [GUILayout.Width(Screen.width*11/40),GUILayout.Height(Screen.width*11/80), GUILayout.ExpandWidth(false)])){
			wss.RideTrolley(tr["category"].ToString(),tr["_id"]);
		}

		if(t%3 == 2 || t == category_trolleys.Count) GUILayout.EndHorizontal();

	}
  GUILayout.EndArea();
}

function GetTrolleys(){
	wss.GetTrolleys();
}

function MakeTex(width:int, height:int, color){

	var result:Texture2D = new Texture2D(width, height);
	for(var x:int=0; x<width; x++){
		for(var y:int=0; y<height; y++){
			result.SetPixel(x, y, color);
		}
	}
	result.Apply();
	return result;
}