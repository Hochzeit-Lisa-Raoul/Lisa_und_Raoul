const hochzeit = new Date(2026,8,26,0,0,0);

const silberhochzeit =
new Date(2051,8,26,0,0,0);

function zeit(diff){

let minus = diff < 0;

diff=Math.abs(diff);

let tage=Math.floor(
diff/(1000*60*60*24)
);

let stunden=Math.floor(
(diff/(1000*60*60))%24
);

let minuten=Math.floor(
(diff/(1000*60))%60
);

let sekunden=Math.floor(
(diff/1000)%60
);

let text =
tage+" Tage | "+
stunden+" Stunden | "+
minuten+" Minuten | "+
sekunden+" Sekunden";

return minus ? "- "+text : text;

}

function update(){

let jetzt=new Date();

let feld=document.getElementById("ehezeit");

if(feld){

if(jetzt < hochzeit){

feld.innerHTML =
zeit(hochzeit-jetzt);

}

else {

feld.innerHTML =
zeit(jetzt-hochzeit);

}

}

let silber=
document.getElementById("silberhochzeit");

if(silber){

silber.innerHTML =
zeit(silberhochzeit-jetzt);

}

}

update();

setInterval(update,1000);
