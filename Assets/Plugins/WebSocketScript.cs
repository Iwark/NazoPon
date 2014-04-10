using UnityEngine;
using System.Collections;
using WebSocketSharp;
using System.Collections.Generic;
using MiniJSON;

public class WebSocketScript : MonoBehaviour {

    public object trolleys;
    public object trolley;
    public string user_id;
    public bool is_connected;
    public List<Dictionary<string, object>> messages = new List<Dictionary<string, object>>();

    void Awake () {
    }

    void Start () {
        DontDestroyOnLoad(this);
        Connect();
    }
 
    void Update () {
        if(!is_connected){
            Debug.Log("re connecting ...");
            StartCoroutine("Wait",2.0f);
            ws.Connect();
        }
    }

    void OnGUI(){
 
    }
 
    WebSocket ws;
 
    void Connect(){
        ws =  new WebSocket("ws://donuts.hacker-meetings.com:8081/");
 
        ws.OnMessage += (sender, e) =>
        {
            string s = e.Data;

            Debug.Log(string.Format( "Receive {0}",s));

            Dictionary<string,object> dict = Json.Deserialize(s) as Dictionary<string,object>;
            if(dict.ContainsKey("trolleys")){
                Debug.Log(Json.Serialize(dict["trolleys"]));
                trolleys = Json.Serialize(dict["trolleys"]);
            }else if(dict.ContainsKey("trolley")){
                trolley = Json.Serialize(dict["trolley"]);
            }else if(dict.ContainsKey("message") || dict.ContainsKey("emotion")){
                messages.Add(dict);
            }else if(dict.ContainsKey("user")){
                Dictionary<string,object> user = (Dictionary<string,object>)dict["user"];
                if(user.ContainsKey("_id")){
                    user_id = (string)user["_id"];
                }

                Dictionary<string, string> sendData = new Dictionary<string, string>();

                sendData["get_trolleys"] = null;
                ws.Send(Json.Serialize(sendData));
            }
        };

        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("m_webSocket.OnOpen");
            is_connected = true;
            Dictionary<string, Dictionary<string, string>> sendData = new Dictionary<string, Dictionary<string, string>>();
            Dictionary<string, string> loginData = new Dictionary<string, string>();
            loginData["device_id"] = SystemInfo.deviceUniqueIdentifier;
            sendData["login"] = loginData;
            ws.Send(Json.Serialize(sendData));
        };

        ws.OnClose += (sender, e) =>
        {
            Debug.Log(string.Format("OnClosed {0}", e.Reason));
            is_connected = false;
        };

 
        ws.Connect();
        Debug.Log("Connect to " + ws.Url);
    }


    IEnumerator Wait(float waitTime) {
        yield return new WaitForSeconds(waitTime);
    }

    public void RideTrolley(string category, string trolley_id){
        Debug.Log("ride Trolley.");
        Dictionary<string, object> sendData = new Dictionary<string, object>();
        Dictionary<string, string> rideData = new Dictionary<string, string>();
        rideData["category"] = category;
        if(trolley_id != null) rideData["_id"] = trolley_id;
        sendData["ride_trolley"] = rideData;
        sendData["user_id"] = user_id;
        Debug.Log("senddata: "+Json.Serialize(sendData));
        ws.Send(Json.Serialize(sendData));
    }

    public void MoveCharacter(float x, float y, float z){
        Debug.Log("move Character.");
        Dictionary<string, object> sendData = new Dictionary<string, object>();
        Dictionary<string, string> moveData = new Dictionary<string, string>();
        moveData["x"] = x.ToString();
        moveData["y"] = y.ToString();
        moveData["z"] = z.ToString();
        moveData["user_id"] = user_id;
        sendData["move_character"] = moveData;
        Debug.Log("senddata: "+Json.Serialize(sendData));
        ws.Send(Json.Serialize(sendData));
    }

    public void SendMessage(string message, int emotion){
        Debug.Log("send Message.");
        Dictionary<string, object> sendData = new Dictionary<string, object>();
        Dictionary<string, string> mesData = new Dictionary<string, string>();
        if(message != null) mesData["message"] = message;
        if(emotion != null) mesData["emotion"] = emotion.ToString();
        mesData["user_id"] = user_id;
        sendData["send_message"] = mesData;
        Debug.Log("senddata: "+Json.Serialize(sendData));
        ws.Send(Json.Serialize(sendData));
    }

    public void ReplyAnswer(string result){
        Debug.Log("reply Answer.");
        Dictionary<string, object> sendData = new Dictionary<string, object>();
        Dictionary<string, string> ansData = new Dictionary<string, string>();
        ansData["result"] = result;
        ansData["user_id"] = user_id;
        sendData["reply_answer"] = ansData;
        Debug.Log("senddata: "+Json.Serialize(sendData));
        ws.Send(Json.Serialize(sendData));
    }

    public void Continue(string result){
        Debug.Log("Continue.");
        Dictionary<string, object> sendData = new Dictionary<string, object>();
        Dictionary<string, string> resData = new Dictionary<string, string>();
        resData["result"] = result;
        resData["user_id"] = user_id;
        sendData["is_continue"] = resData;
        Debug.Log("senddata: "+Json.Serialize(sendData));
        ws.Send(Json.Serialize(sendData));
    }
}