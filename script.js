/* =========================================================
   LISA & RAOUL – SCRIPT.JS
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const supabaseUrl = "https://toykvrmttfljupbcukkf.supabase.co";

const supabaseKey =
    "sb_publishable_3q5wwC-g36zWWYqH7d6qBw_IPev5RZJ";

let supabaseClient = null;

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );

}


/* =========================================================
   DATEN
   ========================================================= */

const hochzeit =
    new Date(2026, 8, 17, 12, 0, 0);

const silberhochzeit =
    new Date(2051, 8, 17, 0, 0, 0);

const zehnJahre =
    new Date(2036, 8, 17, 0, 0, 0);


/* =========================================================
   ZEITBERECHNUNG
   ========================================================= */

function zeit(diff) {

    let minus = diff < 0;

    diff = Math.abs(diff);

    let tage =
        Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );

    let stunden =
        Math.floor(
            (diff / (1000 * 60 * 60)) % 24
        );

    let minuten =
        Math.floor(
            (diff / (1000 * 60)) % 60
        );

    let sekunden =
        Math.floor(
            (diff / 1000) % 60
        );

    let text =
        tage + " Tage | " +
        stunden + " Stunden | " +
        minuten + " Minuten | " +
        sekunden + " Sekunden";

    return minus ? "- " + text : text;

}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function update() {

    let jetzt = new Date();


    /* Hochzeits-Countdown */

    let feld =
        document.getElementById("ehezeit");

    if (feld) {

        if (jetzt < hochzeit) {

            feld.innerHTML =
                zeit(hochzeit - jetzt) +
                " </p>bis zu unserem großen Tag";

        } else {

            feld.innerHTML =
                zeit(jetzt - hochzeit) +
                " </p>seit unserem großen Tag";

        }

    }


    /* Silberhochzeit */

    let silber =
        document.getElementById(
            "silberhochzeit"
        );

    if (silber) {

        silber.innerHTML =
            zeit(
                silberhochzeit - jetzt
            );

    }


    /* 10 Jahre */

    let jubilaeum =
        document.getElementById(
            "jubilaeumCountdown"
        );

    if (jubilaeum) {

        jubilaeum.innerHTML =
            zeit(
                zehnJahre - jetzt
            );

    }

}


/* Countdown starten */

update();

setInterval(update, 1000);

// =====================================================
// Countdown kirchliche Trauung
// =====================================================

function updateKirchlicheTrauung() {

    const heute = new Date();
    const trauung = new Date("2026-09-26T00:00:00");

    const diff = trauung - heute;

    const tage = Math.floor(
        Math.abs(diff) / (1000 * 60 * 60 * 24)
    );

    const element = document.getElementById("kirchlicheTrauungInfo");

    if (!element) return;

    if (diff > 0) {

        element.textContent =
            `${tage} ${tage === 1 ? "Tag" : "Tage"} bis zur kirchlichen Trauung`;

    } else {

        element.textContent =
            `${tage} ${tage === 1 ? "Tag" : "Tage"} seit der kirchlichen Trauung`;

    }
}

updateKirchlicheTrauung();

setInterval(updateKirchlicheTrauung, 60000);


/* =========================================================
   GÄSTEBUCH – FORMULAR
   ========================================================= */

const formular =
    document.getElementById(
        "freundebuchForm"
    );

if (formular && supabaseClient) {

    formular.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const daten =
                new FormData(formular);

            const eintrag = {

                name:
                    daten.get("name"),

                kennt:
                    daten.get("kennt"),

                drei_worte:
                    daten.get("drei_worte"),

                challenge:
                    daten.get("challenge"),

                erinnerung:
                    daten.get("erinnerung"),

                zeitkapsel:
                    daten.get("zeitkapsel")

            };


            const { error } =
                await supabaseClient
                    .from("Freundebuch")
                    .insert([eintrag]);


            if (error) {

                alert(
                    "Fehler: " +
                    error.message
                );

            } else {

                alert(
                    "🌿 Vielen Dank für euren Eintrag!"
                );

                formular.reset();

            }

        }
    );

}


/* =========================================================
   GÄSTEBUCH – EINTRÄGE LADEN
   ========================================================= */

async function ladeEintraege() {

    const bereich =
        document.getElementById(
            "eintraege"
        );


    if (!bereich) {
        return;
    }


    if (!supabaseClient) {

        bereich.innerHTML =
            "<p>Das Gästebuch konnte nicht geladen werden.</p>";

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("Freundebuch")
            .select("*")
            .order(
                "id",
                { ascending: false }
            );


    if (error) {

        bereich.innerHTML =
            "<p>Fehler beim Laden der Einträge: " +
            error.message +
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

        const box =
            document.createElement("div");

        box.className =
            "eintrag";


        box.innerHTML = `

            <h3>🌿 ${eintrag.name}</h3>

            <p>
                <strong>Kennt Lisa & Raoul:</strong><br>
                ${eintrag.kennt || ""}
            </p>

            <p>
                <strong>Schlagzeile:</strong><br>
                ${eintrag.Schlagzeile || ""}
            </p>

            <p>
                <strong>challange:</strong><br>
                ${eintrag.challange || ""}
            </p>

            <p>
                <strong>Titel:</strong><br>
                ${eintrag.Titel || ""}
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


/* =========================================================
   STREITHELFER
   ========================================================= */

function streitHelfer() {

    let antworten = [

        "Nach sorgfältiger Prüfung aller Fakten: Lisa hat recht. 😇",

        "Die Wissenschaft ist eindeutig: Lisa gewinnt diesen Streit.",

        "Analyse abgeschlossen. Raoul hatte einen interessanten Punkt, aber Lisa hat recht.",

        "Die internationale Ehekommission wurde befragt: Lisa hat recht.",

        "Wir haben alle Argumente gewogen. Ergebnis: Lisa hatte natürlich recht.",

        "Dieser Streit war schwierig. Nach 0,5 Sekunden Recherche: Lisa hat recht."

    ];


    let zufall =
        antworten[
            Math.floor(
                Math.random() *
                antworten.length
            )
        ];


    let feld =
        document.getElementById(
            "streitAntwort"
        );


    if (feld) {
        feld.innerHTML = zufall;
    }

}


/* =========================================================
   ORAKEL
   ========================================================= */

function orakel() {

    let antworten = [

        "2051: Lisa und Raoul lachen immer noch über dieselben Dinge. ❤️",

        "Die Glaskugel sagt: Viele gemeinsame Abenteuer warten.",

        "Raoul wird auch in 25 Jahren noch behaupten, recht gehabt zu haben.",

        "Lisa wird auch in 25 Jahren noch darüber diskutieren.",

        "Prognose: Liebe, Lachen und gelegentliche Diskussionen.",

        "Silberhochzeit sicher erreicht. Der Rest bleibt spannend."

    ];


    let feld =
        document.getElementById(
            "orakelAntwort"
        );


    if (feld) {

        feld.innerHTML =
            antworten[
                Math.floor(
                    Math.random() *
                    antworten.length
                )
            ];

    }

}


/* =========================================================
   ESSEN ENTSCHEIDEN
   ========================================================= */

function essenEntscheiden() {

    let essen = [

        "Pizza. Die Wissenschaft hat gesprochen. 🍕",

        "Bestellt beides. Problem gelöst.",

        "Lisa entscheidet. Raoul stimmt glücklich zu.",

        "Nudeln. Weil Nudeln immer gehen.",

        "Heute wird etwas genommen, das keiner kochen muss.",

        "Überraschung: Es wird genau das, worauf Lisa Lust hat."

    ];


    let feld =
        document.getElementById(
            "essenAntwort"
        );


    if (feld) {

        feld.innerHTML =
            essen[
                Math.floor(
                    Math.random() *
                    essen.length
                )
            ];

    }

}


/* =========================================================
   ALLTAG
   ========================================================= */

function alltag() {

    let urteile = [

        "Derjenige, der es zuerst gesehen hat, ist offiziell zuständig.",

        "Gemeinsam machen bedeutet: Einer macht es, einer motiviert.",

        "Der Schiedsrichter entscheidet: Raoul macht es. 😄",

        "Vertagt bis morgen. Ehe bleibt trotzdem bestehen.",

        "Derjenige mit der größeren Motivation gewinnt.",

        "Beide haben recht. Einer macht es trotzdem."

    ];


    let feld =
        document.getElementById(
            "alltagAntwort"
        );


    if (feld) {

        feld.innerHTML =
            urteile[
                Math.floor(
                    Math.random() *
                    urteile.length
                )
            ];

    }

}


/* =========================================================
   LIEBE
   ========================================================= */

function liebe() {

    let antworten = [

        "Eine Umarmung wäre dringend empfohlen. ❤️",

        "Kaffee machen zählt offiziell als Liebesbeweis.",

        "5 Minuten gemeinsam lachen – Therapie abgeschlossen.",

        "Eine kleine Überraschung wäre perfekt.",

        "Ein ehrliches 'Ich liebe dich' schlägt alles.",

        "Zusammen Zeit verbringen. Der Klassiker funktioniert."

    ];


    let feld =
        document.getElementById(
            "liebeAntwort"
        );


    if (feld) {

        feld.innerHTML =
            antworten[
                Math.floor(
                    Math.random() *
                    antworten.length
                )
            ];

    }

}


