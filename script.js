/* alert("script.js wurde geladen!"); */



const supabaseUrl = "https://toykvrmttfljupbcukkf.supabase.co";
const supabaseKey = "sb_publishable_3q5wwC-g36zWWYqH7d6qBw_IPev5RZJ";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

/* alert("Supabase wurde erstellt!"); */

const hochzeit = new Date(2026,8,26,0,0,0);

const silberhochzeit =
new Date(2051,8,26,0,0,0);

const zehnJahre =
new Date(2036,8,26,0,0,0);

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

let jetzt = new Date();


let feld = document.getElementById("ehezeit");

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



let silber =
document.getElementById("silberhochzeit");

if(silber){

    silber.innerHTML =
    zeit(silberhochzeit-jetzt);

}



let jubilaeum =
document.getElementById("jubilaeumCountdown");

if(jubilaeum){

    jubilaeum.innerHTML =
    zeit(zehnJahre-jetzt);

}

}

update();

setInterval(update,1000);

const formular = document.getElementById("freundebuchForm");

if (formular) {

    formular.addEventListener("submit", async function (e) {

        e.preventDefault();

        const daten = new FormData(formular);

        const eintrag = {

            name: daten.get("name"),
            kennt: daten.get("kennt"),
            drei_worte: daten.get("drei_worte"),
            challenge: daten.get("challenge"),
            erinnerung: daten.get("erinnerung"),
            zeitkapsel: daten.get("zeitkapsel")

        };

        const { error } = await supabaseClient
            .from("Freundebuch")
            .insert([eintrag]);

        if (error) {

            alert("Fehler: " + error.message);

        } else {

            alert("🌿 Vielen Dank für euren Eintrag!");

            formular.reset();

        }

    });

}
async function ladeEintraege() {

    const bereich = document.getElementById("eintraege");

    if (!bereich) {
        return;
    }


    const { data, error } = await supabaseClient
        .from("Freundebuch")
        .select("*")
        .order("id", { ascending: false });


    if (error) {

        bereich.innerHTML =
        "<p>Fehler beim Laden der Einträge: "
        + error.message +
        "</p>";

        return;

    }


    if (!data || data.length === 0) {

        bereich.innerHTML =
        "<p>Noch keine Einträge vorhanden.</p>";

        return;

    }


    bereich.innerHTML = "";


    data.forEach(eintrag => {

        const box = document.createElement("div");

        box.className = "eintrag";


        box.innerHTML = `

            <h3>🌿 ${eintrag.name}</h3>

            <p>
            <strong>Kennt A + B:</strong><br>
            ${eintrag.kennt || ""}
            </p>

            <p>
            <strong>In drei Worten:</strong><br>
            ${eintrag.drei_worte || ""}
            </p>

            <p>
            <strong>Challenge:</strong><br>
            ${eintrag.challenge || ""}
            </p>

            <p>
            <strong>Erinnerung:</strong><br>
            ${eintrag.erinnerung || ""}
            </p>

            <p>
            <strong>Zeitkapsel:</strong><br>
            ${eintrag.zeitkapsel || ""}
            </p>

        `;


        bereich.appendChild(box);

    });

}


ladeEintraege();


function streitHelfer(){

    let antworten = [

        "Nach sorgfältiger Prüfung aller Fakten: Lisa hat recht. 😇",

        "Die Wissenschaft ist eindeutig: Lisa gewinnt diesen Streit.",

        "Analyse abgeschlossen. Raoul hatte einen interessanten Punkt, aber Lisa hat recht.",

        "Die internationale Ehekommission wurde befragt: Lisa hat recht.",

        "Wir haben alle Argumente gewogen. Ergebnis: Lisa hatte natürlich recht.",

        "Dieser Streit war schwierig. Nach 0,5 Sekunden Recherche: Lisa hat recht."

    ];


    let zufall =
    antworten[Math.floor(Math.random()*antworten.length)];


    document.getElementById("streitAntwort").innerHTML =
    zufall;

}

function orakel(){

let antworten = [

"2051: Lisa und Raoul lachen immer noch über dieselben Dinge. ❤️",

"Die Glaskugel sagt: Viele gemeinsame Abenteuer warten.",

"Raoul wird auch in 25 Jahren noch behaupten, recht gehabt zu haben.",

"Lisa wird auch in 25 Jahren noch darüber diskutieren.",

"Prognose: Liebe, Lachen und gelegentliche Diskussionen.",

"Silberhochzeit sicher erreicht. Der Rest bleibt spannend."

];


document.getElementById("orakelAntwort").innerHTML =
antworten[Math.floor(Math.random()*antworten.length)];

}

function essenEntscheiden(){

let essen = [

"Pizza. Die Wissenschaft hat gesprochen. 🍕",

"Bestellt beides. Problem gelöst.",

"Lisa entscheidet. Raoul stimmt glücklich zu.",

"Nudeln. Weil Nudeln immer gehen.",

"Heute wird etwas genommen, das keiner kochen muss.",

"Überraschung: Es wird genau das, worauf Lisa Lust hat."

];


document.getElementById("essenAntwort").innerHTML =
essen[Math.floor(Math.random()*essen.length)];

}

function alltag(){

let urteile = [

"Derjenige, der es zuerst gesehen hat, ist offiziell zuständig.",

"Gemeinsam machen bedeutet: Einer macht es, einer motiviert.",

"Der Schiedsrichter entscheidet: Raoul macht es. 😄",

"Vertagt bis morgen. Ehe bleibt trotzdem bestehen.",

"Derjenige mit der größeren Motivation gewinnt.",

"Beide haben recht. Einer macht es trotzdem."

];


document.getElementById("alltagAntwort").innerHTML =
urteile[Math.floor(Math.random()*urteile.length)];

}

function liebe(){

let antworten = [

"Eine Umarmung wäre dringend empfohlen. ❤️",

"Kaffee machen zählt offiziell als Liebesbeweis.",

"5 Minuten gemeinsam lachen – Therapie abgeschlossen.",

"Eine kleine Überraschung wäre perfekt.",

"Ein ehrliches 'Ich liebe dich' schlägt alles.",

"Zusammen Zeit verbringen. Der Klassiker funktioniert."

];


document.getElementById("liebeAntwort").innerHTML =
antworten[Math.floor(Math.random()*antworten.length)];

}

