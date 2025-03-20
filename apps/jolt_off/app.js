/* Run a test harness on any discovered Bangle.js devices */
Bangle.loadWidgets();
Bangle.drawWidgets();

function go() {
  E.showMessage("Searching for Jolt.js",{title:"Jolt.js"});
  var device;
  NRF.requestDevice({filters : [{ namePrefix: 'Jolt.js' }]}).then(d => {
    device = d;
    E.showMessage("Connecting...",{title:"Jolt.js"});
    require("ble_simple_uart").write(device, `\x10setWatch(e => { if (e.time-e.lastTime>1) { NRF.wake();clearWatch();digitalPulse(LED2,1,1000); }},BTN,{repeat:true,edge:0});digitalPulse(LED3,1,10000);NRF.sleep();\n`).
    then( () => new Promise(r => {
      try { device.gatt.disconnect(); } catch (e) {}
    })).
    then( function() {
    E.showPrompt("Success! Again?",{title:"Jolt.js"}).then(retry => {
      print("Prompt response:",retry);
      if (retry) go();
      else load();
    });
  }).catch(function(e) {
    console.log(e);
    E.showAlert(e.toString(),"Error").then(()=>load());
  });
    }, function() {
    E.showPrompt("Not found. Retry?",{title:"Jolt.js"}).then(retry => {
      if (retry) go();
      else load();
    });
  });
}

go();