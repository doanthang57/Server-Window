var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM1", { baudRate: 115200 });

var thingName = 'Thang-Test';
var thingShadows = awsIot.thingShadow({
   keyPath: './certs/ef21fe66d7-private.pem.key',
  certPath: './certs/ef21fe66d7-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: thingName,
      host: 'aupu5tnzgckec.iot.ap-southeast-1.amazonaws.com'

});

thingShadows.on('connect', function () {
    console.log("Connected...");
    thingShadows.register(thingName);

    // An update right away causes a timeout error, so we wait about 2 seconds
    setTimeout(function () {
        console.log("Updating Led Status...");
        var led = thingShadows.update(thingName, {
            "state": {
                "reported": {
                    "led": true
                }
            }
        });
        console.log("Update:" + led);
    }, 2500);


    // Code below just logs messages for info/debugging
    thingShadows.on('status',
        function (thingName, stat, clientToken, stateObject) {
        });
});

serialPort.on('open',onOpen);
serialPort.on('data',onData);

function onOpen(){
  console.log("Open connected");
}
function onData(data){
  console.log('Data receive: '+data); // show buff nhan duoc

  if(String.fromCharCode(data[0])=== "1")
  {
    stateObject.state.led = 1;
    console.log('Led serial update');
    thingShadows.register(thingName);
    setTimeout(function () {
        console.log("Updating Led Status...");
        var led = thingShadows.update(thingName, {
            "state": {
                "reported": {
                    "led": true
                }
            }
        });
        console.log("Update:" + led);
    }, 2500);
  }
}
