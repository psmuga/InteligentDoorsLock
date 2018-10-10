
#include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>

#define RST_PIN         9          
#define SS_PIN          6 

#define GREEN_LED       5
#define RED_LED         3
#define BUZZER          2
#define DOOR            A5
#define DOORBUTTON      A0

MFRC522 mfrc522(SS_PIN, RST_PIN);

byte mac[] = {0x00,0xAA,0xBB, 0xCC, 0xDE, 0x01};
IPAddress server(192,168,0,12);
IPAddress ip(192,168,0,10);

EthernetClient client;

byte readCard[4];
String rfidUid="";
String kartaAuth="";

char canOpen;
boolean isCriticalChar = false;

String macSequence = "";
void setup() {
  Serial.begin(9600);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED,OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(DOOR, OUTPUT);
  pinMode(DOORBUTTON, INPUT);
  digitalWrite(DOORBUTTON,HIGH);
  noTone(BUZZER);


  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(RED_LED, HIGH);

  pinMode(6,OUTPUT);
  digitalWrite(6,HIGH);
  pinMode(10,OUTPUT);
  digitalWrite(10,HIGH);
  

  Ethernet.begin(mac,ip);
  client.setTimeout(3000);
  //delay(1000);
  Serial.println(Ethernet.localIP());

   
  Serial.println("connecting...");

  

  
//  if(Ethernet.begin(mac) == 0){
//    Serial.println("Failed to configure Ethernet using DHCP");
//  }
//  else{
//    Serial.println(Ethernet.localIP());
//  }
 
  
  //sendGET();

  
  SPI.begin();
  mfrc522.PCD_Init();
  setMacSequence();
  showInfo("Scan PICC to see UID and type ...");

  
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
}

void loop() {
  if(digitalRead(DOORBUTTON)==LOW){
    showInfo("success using button");  
    openDoor(); 
    sendInfoOpenDoor();
  }

    // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }

  for(byte i=0; i < mfrc522.uid.size; i++) {
    rfidUid+= String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    rfidUid+= String(mfrc522.uid.uidByte[i], HEX);
    mfrc522.PICC_HaltA();
  }
  Serial.println(rfidUid);  

  sendGET();
  Serial.print("canOpen: ");
  Serial.println(canOpen);

    //if (rfidUid == kartaAuth) 
  if (canOpen == '1') 
  {
    showInfo("success");
    openDoor();
  } 
  else   
  {
    showInfo("fail");
    digitalWrite(RED_LED, HIGH);
    tone(BUZZER, 300);
    delay(1200);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER); 
  } 

  canOpen ='n';
  rfidUid = "";
}

void sendGET(){

  if (client.connect(server, 9000)) {
    String query = "GET /api/doors/" + macSequence + "/" + rfidUid + " HTTP/1.1";
    performQuery(query);
  } else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }

  while(client.connected() && !client.available())
    delay(1);
  while(client.connected() || client.available()){
    checkResponse();
  }

  client.stop();
}
void performQuery(String query){
    delay(500);
    Serial.println("connected");
    client.println(query);
    Serial.println(query);
    client.println("Host: door");
    client.println("Connection: close");
    client.println();
}

void sendInfoOpenDoor(){
  if (client.connect(server, 9000)) { 
    String query = "GET /api/doors/" + macSequence + "/ok HTTP/1.1";
    performQuery(query);
  } else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }

  client.stop();
}

void setMacSequence(){
  for(byte i=0; i < 6; i++) {
    macSequence+= String(mac[i] < 0x10 ? "0" : "");
    macSequence+= String(mac[i], HEX);
  }
  Serial.println(macSequence);
}

void checkResponse(){
  char c = client.read();
  if( c == '<'){
    isCriticalChar = true;
  }
  if(isCriticalChar == true){
    canOpen = client.read();
    isCriticalChar = false;
  }
  Serial.print(c);
} 

void openDoor(){
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(DOOR, HIGH);
    tone(BUZZER, 500);
    delay(300);
    noTone(BUZZER); 
    delay(4000);
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(DOOR, LOW);
}

void showInfo(String msg){
  Serial.println(msg);
}

