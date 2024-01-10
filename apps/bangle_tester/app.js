/* Run a test harness on any discovered Bangle.js devices */
Bangle.loadWidgets();
Bangle.drawWidgets();
var devices = {};
//NRF.setAdvertising({},{name:"Off!"});
function flashDevice(device) {
  print("reset...");
  require("ble_simple_uart").write(device, `\x10reset();\n`).
  then( () => new Promise(r => {
    print('Wait...');
    setTimeout(r, 1000);
  })).
  then( function() {
    print('Upload code');
    return require("ble_simple_uart").write(device, `\x10NRF.sleep();require('Storage').writeJSON('welcome.json',{welcomed: false});E.showMessage("Loading Test");Terminal.setConsole(1);Bangle.setPollInterval(800);Bangle.showTestScreen();\n`);
  }).
  then( function() {
    print('Done!');
  }).catch(function(e) {
    print('Error',e);
  });
}
function search() {
  NRF.findDevices(function(devs) {
    var chosen, newDevs = [];
    devs.forEach(dev => {
      if (!(dev.id in devices)) {
        dev.firstSeen = Date.now();
        devices[dev.id] = dev;
        newDevs.push(dev.id.split(" ")[0]);
      }
      if (devices[dev.id].firstSeen+20000 < Date.now())
        chosen = dev;
    });
    var msg = "";
    if (newDevs.length)
      msg += "New\n"+newDevs.join("\n")+"\n";
    if (chosen) {
      msg += "Connect\n"+chosen.id.split(" ")[0];
      flashDevice(chosen);
      delete devices[chosen.id];
    }
    if (msg=="") msg="No new\ndevices";
    E.showMessage(msg);
  }, {timeout : 1000, filters : [{ namePrefix: 'Bangle.js' }]});
}
setInterval(function() {
  try {
    search();
  } catch(e) {
    print("err:",e);
  }
}, 10000);
search();

