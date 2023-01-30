var TEXT = "Banglejs";
var textIndex = 0;
var polys;
var ra = 1+Math.random(), rb = 1+Math.random(), rc = 1+Math.random(), rd = 1+Math.random();
var col = "#000";

function getPoly() {
  var s = TEXT[textIndex];
  var w = g.setFont("Vector",170).stringWidth(s);  
  polys = g.getVectorFontPolys(s,{x:-w/2,y:-70,w:170,h:170});
}
getPoly();
setWatch(function() {
  textIndex++;
  if (textIndex>=TEXT.length) textIndex=0;
  getPoly();
}, BTN, {repeat:true});

function draw() {
  var tm = getTime();
  var t = {
    x: 88, y: 88,
    scale: 0.8 + (Math.sin(tm*rc) + Math.sin(tm*rd))/5, 
    rotate: (Math.sin(tm*ra) + Math.sin(tm*rb))/6
  };
  g.clear(1).setColor(col);
  polys.forEach(p => g.fillPoly(g.transformVertices(p,t)));
}

Bangle.setLCDPower(1);
setInterval(draw,20);
setInterval(function() {
  col = E.HSBtoRGB(Math.random(),1,1,16);
}, 1000+Math.random()*200);




