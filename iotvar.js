var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM1", { baudRate: 115200 });


var thingShadows = awsIot.thingShadow({
   keyPath: './certs/ef21fe66d7-private.pem.key',
  certPath: './certs/ef21fe66d7-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'nameThang',
      host: 'aupu5tnzgckec.iot.ap-southeast-1.amazonaws.com'

});

serialPort.on('open',onOpen);
serialPort.on('data',onData);

function onOpen(){
  console.log("Open connected");
}

var clientToken;

thingShadows.register('Thang-Test', {}, function () {

})

function onData(data) {
  data = String(data);

  console.log(data);
  var updateshadow = {"state":{"desired":{"Data": data}}}
  clientToken = thingShadows.update('Thang-Test', updateshadow);

  if (clientToken === null)
  {
    console.log('Update error');
  }
  else {
    console.log('Update');
  }
}
