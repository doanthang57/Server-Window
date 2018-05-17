var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM1", { baudRate: 115200 });


var clientTokenUpdate;
var sessionid = 0;
var local_sessionid = 0;//tam thoi

var thingShadows = awsIot.thingShadow({
   keyPath: './certs/ef21fe66d7-private.pem.key',
  certPath: './certs/ef21fe66d7-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'nameThang',
      host: 'aupu5tnzgckec.iot.ap-southeast-1.amazonaws.com'

});


var i = 0;
var buffer = {
    "container": {
      "action": "turn on",
      "device": "light",
      "id": "01",
      "room": "living room",
      "mode": "set",
      "sessionid": "1",
      "lux": "100"
    }
  }

// lang nghe thingShadow

thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('SSID: '+ JSON.stringify(stateObject.state.Data.container.sessionid)); // dang string
       console.log('SSID2: '+ stateObject.state.Data.container.sessionid); // dang json
       sessionid = stateObject.state.Data.container.sessionid;
       console.log(typeof(sessionid));
       if(sessionid === null)
       {
         console.log("Error: SSID rong~");
       }
       else {
          if(sessionid != local_sessionid ) //Neu SSID Thay doi
          {
            // convent
            serialPort.write('@')

            //console.log(buffer.container.device);
            //console.log(buffer.container.id);

            if (stateObject.state.Data.container.device == 'Light') {
              serialPort.write('L')
              serialPort.write(stateObject.state.Data.container.id)
            }
            if (stateObject.state.Data.container.device == 'Fan') {
              serialPort.write('F')
              serialPort.write(stateObject.state.Data.container.id)
            }
            if (stateObject.state.Data.container.device == 'TV') {
              serialPort.write('V')
              serialPort.write(stateObject.state.Data.container.id)
            }

            //console.log(stateObject.state.Data.container.room);
            if (stateObject.state.Data.container.room == 'Bed Room') {
              serialPort.write('B')
            }
            if (stateObject.state.Data.container.room == 'Kitchen') {
              serialPort.write('K')
            }
            if (stateObject.state.Data.container.room == 'Living Room') {
              serialPort.write('R')
            }

            //console.log(buffer.container.action);
            if (stateObject.state.Data.container.action == 'Turn On') {
              serialPort.write('X')
            }
            if (stateObject.state.Data.container.action == 'Turn Off') {
              serialPort.write('Y')
            }

            //console.log(buffer.container.mode);
            if (stateObject.state.Data.container.mode == 'Auto') {
              serialPort.write('A')
            }
            if (stateObject.state.Data.container.mode == 'SET') {
              serialPort.write('S')
            }
              serialPort.write('x')

            //updat firmware
            console.log('OK');
          }
          else {
            console.log('Error 2: SSID trung`');
          }
       }
       // console.log('received delta on '+thingName+': '+
       //             JSON.stringify(stateObject));
    });
// Nhan serial PORT tu device
serialPort.on('open',onOpen);
serialPort.on('data',onData);

function onOpen(){
  console.log("Open connected serialport");
}


thingShadows.register('Thang-Test', {}, function () {
})

function onData(data){
  //data = String(data);
  console.log('Data receive: '+data); // show buff nhan duoc
  //-----------------@L1OLS100----------------------------
  var n = 8;
  for (var i = 0; i < n; i++) {
    switch (String.fromCharCode(data[i])) {
      case '@':
        if(i == 0)
        break;

      case 'F':

        if (i == 1) {
          i++;
          buffer.container.device = 'Fan';
          buffer.container.id=String.fromCharCode(data[i]);
          break;
        }

      case 'L':

        if (i == 1) {
          i++;
          buffer.container.device = 'Light';
          buffer.container.id=String.fromCharCode(data[i]);
          break;
        }
      case 'V':

        if (i == 1) {
          i++;
          buffer.container.device = 'TV';
          buffer.container.id=String.fromCharCode(data[i]);
          break;
        }

      case 'B':
        if(i ==3){
            buffer.container.room = 'Bed Room';
            break;
        }
      case 'K':
        if(i ==3){
            buffer.container.room = 'Kitchen Room';
            break;
        }
      case 'R':
        if(i ==3){
            buffer.container.room = 'Living Room';
            break;
            }

      case 'X':
        if(i ==4){
            buffer.container.action = 'Turn On'; // 1 la bat
            break;
        }
      case 'Y':
        if(i ==4){
            buffer.container.action = 'Turn Off'; // 0 la tat
            break;
        }
      case 'S':
        if(i ==5){
            buffer.container.mode = 'SET';
            for( i = 6; i< 9; i++)
            {
              buffer.container.lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
            }
            break;
        }
      case 'A':
        if(i ==5){
            buffer.container.mode = 'Auto';
            for( i = 6; i< 9; i++)
            {
              buffer.container.lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
            }

            break;
        }

      default:
        i = n - 1;
        console.log('SAI HET ROI, NHAP LAI CHUOI');
        break;
    }
  }
  var updateshadow = {"state":{"desired":{"Data": buffer}}}
    clientToken = thingShadows.update('Thang-Test', updateshadow);

      if (clientToken === null)
      {
        console.log('Update error');
      }
      else {
        console.log('Update successfull: '+clientToken);
      }
  console.log(buffer);
  }
