using UnityEngine;
using System.Collections;
using WebSocketSharp;
using System.Collections.Generic;
using MiniJSON;

public class WebSocketScript : MonoBehaviour {
 
    //private myJS jsScript;

    void Awake () {
        //jsScript = this.GetComponent<myJS>();
        //Debug.Log("jsScript:"+jsScript);
        //if(jsScript != null) jsScript.showMessage2();
    }

    // Use this for initialization
    void Start () {
        DontDestroyOnLoad(this);
        Connect();
    }
 
    // Update is called once per frame
    void Update () {
 
    }
 
    string message = "";
    List<string> messages = new List<string>();

    void OnGUI(){
 
        // Input text
        message = GUI.TextArea(new Rect(0,10,Screen.width * 0.7f,Screen.height / 10),message);
 
        // Send message button
        if(GUI.Button(new Rect(Screen.width * 0.75f,10,Screen.width * 0.2f,Screen.height / 10),"Send")){
            SendChatMessage();
        }
 
        // Show chat messages
        var l = string.Join("\n",messages.ToArray());
        var height = Screen.height * 0.1f * messages.Count;
        GUI.Label(
            new Rect(0,Screen.height * 0.1f + 10,Screen.width * 0.8f,height),
            l);
 
    }
 
    WebSocket ws;
 
    void Connect(){
        ws =  new WebSocket("ws://donuts.hacker-meetings.com:8081/");
 
        // called when websocket messages come.
        ws.OnMessage += (sender, e) =>
        {
            string s = e.Data;

            Debug.Log(string.Format( "Receive {0}",s));

            Dictionary<string,object> dict = Json.Deserialize(s) as Dictionary<string,object>;
            if(dict.ContainsKey("user")){
                Dictionary<string, string> sendData = new Dictionary<string, string>();

                sendData["get_trolleys"] = null;
                ws.Send(Json.Serialize(sendData));
            }else if(dict.ContainsKey("trolleys")){
                //Debug.Log("showMessage2");
                //jsScript.showMessage2();
                //Debug.Log("showMessage");
                //jsScript.showMessage(dict);
            }
            messages.Add("> " + e.Data);
            if(messages.Count > 10){
                messages.RemoveAt(0);
            }
        };

        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("m_webSocket.OnOpen");
            Dictionary<string, Dictionary<string, string>> sendData = new Dictionary<string, Dictionary<string, string>>();
            Dictionary<string, string> loginData = new Dictionary<string, string>();
            loginData["device_id"] = SystemInfo.deviceUniqueIdentifier;
            sendData["login"] = loginData;
            // m_IsConnect = true;
            //デリゲート登録
            // ReceivePacketAction += ReceivedMessage;
            ws.Send(Json.Serialize(sendData));
        };

        ws.OnClose += (sender, e) =>
        {
            Debug.Log(string.Format("OnClosed {0}", e.Reason));
            // m_IsConnect = false;
        };

 
        ws.Connect();
        Debug.Log("Connect to " + ws.Url);
    }

    void RideTrolley(){
        Debug.Log("ride Trolley.");
    }
 
    void SendChatMessage(){
        Debug.Log("Send message " + message);
        ws.Send(message);
        this.message = "";
    }
}