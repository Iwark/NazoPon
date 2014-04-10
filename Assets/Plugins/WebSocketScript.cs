using UnityEngine;
using System.Collections;
using WebSocketSharp;
using System.Collections.Generic;
using MiniJSON;

public class WebSocketScript : MonoBehaviour {

    public object trolleys;
    private string user_id;
    public bool is_connected;

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
            if(dict.ContainsKey("user")){
                Dictionary<string,object> user = (Dictionary<string,object>)dict["user"];
                if(user.ContainsKey("_id")){
                    user_id = (string)user["_id"];
                }

                Dictionary<string, string> sendData = new Dictionary<string, string>();

                sendData["get_trolleys"] = null;
                ws.Send(Json.Serialize(sendData));
            }else if(dict.ContainsKey("trolleys")){
                Debug.Log(Json.Serialize(dict["trolleys"]));
                trolleys = Json.Serialize(dict["trolleys"]);
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
}