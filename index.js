var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM1", { baudRate: 115200 });


var dataden="abc";
var clientTokenUpdate;
var sessionid;
var local_sessionid = '0';//tam thoi

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
var rgbLedLampState = {
  "state":{
    "desired":{"Data": buffer}
  }
}

// lang nghe thingShadow
thingShadows.on('connect', function() {
thingShadows.register( 'Thang-Test', {}, function() {
    var rgbLedLampState = {
      "state":{
        "desired":{"Wellcome": dataden}
      }
    }
// gui len ssid local++
// Update data len IOT
    clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
    console.log('update shadow');

              if (clientTokenUpdate === null)
              {
                 console.log('update shadow failed, operation still in progress');
             }
  });
});

thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('SSID: '+ JSON.stringify(stateObject.state.Data.container.sessionid)); // dang string
       console.log('SSID2: '+ stateObject.state.Data.container.sessionid); // dang json
       sessionid = JSON.stringify(stateObject.state.Data.container.sessionid);

       if( sessionid === null)
       {
         console.log("Error: SSID rong~");
       }
       else {
          if(sessionid != local_sessionid ) //Neu SSID Thay doi
          {
            // convent
            serialPort.write('@')

            console.log(buffer.container.device);
            console.log(buffer.container.id);

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

            console.log(stateObject.state.Data.container.room);
            if (stateObject.state.Data.container.room == 'Bed Room') {
              serialPort.write('B')
            }
            if (stateObject.state.Data.container.room == 'Kitchen') {
              serialPort.write('K')
            }
            if (stateObject.state.Data.container.room == 'Living Room') {
              serialPort.write('R')
            }

            console.log(buffer.container.action);
            if (stateObject.state.Data.container.action == 'Turn On') {
              serialPort.write('X')
            }
            if (stateObject.state.Data.container.action == 'Turn Off') {
              serialPort.write('Y')
            }

            console.log(buffer.container.mode);
            if (stateObject.state.Data.container.mode == 'Auto') {
              serialPort.write('A')
            }
            if (stateObject.state.Data.container.mode == 'SET') {
              serialPort.write('S')
            }
              serialPort.write('x')

            // updat firmware
            console.log('OK');
          }
          else {
            console.log('Error 2: SSID trung`');
          }
       }

       // console.log('received delta on '+thingName+': '+
       //             JSON.stringify(stateObject));
    });
// thingShadows.on('status',
//     function(thingName, stat, clientToken, stateObject) {
//        console.log('\n'+'received '+stat+' on '+thingName+': '+
//                    JSON.stringify(stateObject));
// });
//
// thingShadows.on('timeout',
//     function(thingName, clientToken) {
//        console.log('\n'+'received timeout on '+thingName+
//                    ' with token: '+ clientToken);
// });

// Nhan serial PORT tu device
serialPort.on('open',onOpen);
serialPort.on('data',onData);

function onOpen(){
  console.log("Open connected");
}
function onData(data){
  console.log('Data receive: '+data); // show buff nhan duoc
  console.log('Ondata: '+ String.fromCharCode(data));

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

            thingShadows.register( 'Thang-Test', {}, function() {
              clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
              console.log('Update Susses');
            })
          }
          break;
      }
    case 'A':
      if(i ==5){
          buffer.container.mode = 'Auto';
          for( i = 6; i< 9; i++)
          {
            buffer.container.lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
            thingShadows.register( 'Thang-Test', {}, function() {
              clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
              console.log('Update Susses');
            })
          }

          break;
      }

    default:
      i = n - 1;
      console.log('SAI HET ROI, NHAP LAI CHUOI');
      thingShadows.register( 'Thang-Test', {}, function() {
        clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
        console.log('Update Susses');
      })
      break;
  }
}
console.log(buffer);
}
