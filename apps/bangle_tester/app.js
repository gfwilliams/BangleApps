/* Run a test harness on any discovered Bangle.js devices */
Bangle.loadWidgets();
Bangle.drawWidgets();
var devices = {};
//NRF.setAdvertising({},{name:"Off!"});
function flashDevice(device) {
  require("ble_simple_uart").write(device, `\x10require('Storage').write('welcome.json', {welcomed: false});clearInterval();clearWatch();g.clear(1);function draw(b,c,d,e){var a=b*24;g.reset().clearRect(48,a,W,a+23).setFont('12x20'),g.setBgColor(e?'#0f0':'#f00').clearRect(0,a,48,a+23),g.setFontAlign(0,0).drawString(c,24,a+12),g.setFontAlign(-1,0).drawString(d,52,a+12)}Bangle.setBarometerPower(1,'app'),Bangle.setCompassPower(1,'app'),Bangle.setGPSPower(1,'app'),Bangle.setHRMPower(1,'app'),Bangle.setLCDPower(1),Bangle.setLocked(0),Bangle.setLCDTimeout(0);var W=g.getWidth();g.clear();var gps,hrm,baro,mag,accel;draw(0,'TS','',!1),Bangle.on('touch',(b,a)=>{draw(0,'TS',a.x+','+a.y,!0)}),draw(1,'GPS','',!1),Bangle.on('GPS',a=>{gps=a,draw(1,'GPS',a.time?require('locale').time(a.time,1):'--',!0)}),draw(2,'HRM','',!1),Bangle.on('HRM-raw',a=>{hrm=a,draw(2,'HRM',a.vcPPG,!0)}),draw(3,'Baro','',!1),Bangle.on('pressure',a=>{baro=a,draw(3,'Baro',Math.round(a.pressure),!0)}),draw(4,'Mag','',!1),Bangle.on('mag',a=>{mag=a,draw(4,'Mag',a.x+','+a.y+','+a.z,!0)}),draw(5,'Acc','',!1),Bangle.on('accel',a=>{accel=a,draw(5,'Acc',a.x.toFixed(1)+','+a.y.toFixed(1)+','+a.z.toFixed(1),!0)}),draw(6,'BTN','',!1),setWatch(a=>{draw(6,'BTN',a.state,!0)},BTN,{edge:0,repeat:1})Bangle.on('swipe', Bangle.softOff);NRF.sleep();\n`).
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

