
document.addEventListener("DOMContentLoaded", function () {
    const pdfViewer = document.getElementById("pdfViewer");
    const pdfCanvas = document.getElementById("pdfCanvas");
    const zurueckButton = document.getElementById("zurueckButton");
    const weiterButton = document.getElementById("weiterButton");
    const seitenAnzeige = document.getElementById("seitenAnzeige");
    const albumStatus = document.getElementById("albumStatus");
    const pdfOpenButton = document.getElementById("pdfOpenButton");

    if (!pdfViewer || !pdfCanvas) {
        console.error("PDF-Viewer-Elemente wurden nicht gefunden.");
        return;
    }

    if (typeof pdfjsLib === "undefined") {
        console.error("PDF.js wurde nicht geladen.");
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const geschichtePDFs = [];

    for (let i = 1; i <= 28; i++) {
        const nummer = String(i).padStart(2, "0");
        geschichtePDFs.push("Zeitung/Seite_" + nummer + ".pdf");
    }

    let aktuelleSeite = 1;
    let pdfDokument = null;
    let wirdGeladen = false;

    function zeigeStatus() {
        if (seitenAnzeige) {
            seitenAnzeige.textContent =
                aktuelleSeite + " / " + geschichtePDFs.length;
        }

        if (albumStatus) {
            albumStatus.textContent =
                "Seite " + aktuelleSeite + " von " + geschichtePDFs.length;
        }

        if (zurueckButton) {
            zurueckButton.disabled = aktuelleSeite <= 1;
        }

        if (weiterButton) {
            weiterButton.disabled =
                aktuelleSeite >= geschichtePDFs.length;
        }

        if (pdfOpenButton) {
            pdfOpenButton.href = geschichtePDFs[aktuelleSeite - 1];
        }
    }

    async function ladePDF(nummer) {
        if (wirdGeladen) {
            return;
        }

        wirdGeladen = true;

        pdfViewer.classList.add("pdf-loading");

        try {
            const datei = geschichtePDFs[nummer - 1];

            console.log("Lade PDF:", datei);

            pdfDokument = await pdfjsLib
                .getDocument(datei)
                .promise;

            console.log("PDF geladen:", datei);

            await zeichneSeite(1);

            aktuelleSeite = nummer;
            zeigeStatus();

        } catch (fehler) {
            console.error("Fehler beim Laden der PDF:", fehler);

            const context = pdfCanvas.getContext("2d");

            context.clearRect(
                0,
                0,
                pdfCanvas.width,
                pdfCanvas.height
            );

            pdfCanvas.width = 600;
            pdfCanvas.height = 200;

            context.font = "18px Arial";
            context.textAlign = "center";
            context.fillStyle = "#555";

            context.fillText(
                "Die PDF konnte nicht geladen werden.",
                300,
                90
            );

            context.font = "14px Arial";

            context.fillText(
                "Bitte die Browser-Konsole prüfen.",
                300,
                125
            );

        } finally {
            wirdGeladen = false;
            pdfViewer.classList.remove("pdf-loading");
        }
    }

    async function zeichneSeite(seitennummer) {
        if (!pdfDokument) {
            return;
        }

        try {
            const seite = await pdfDokument.getPage(seitennummer);

            const containerBreite = pdfViewer.clientWidth || 800;

            const grundViewport = seite.getViewport({
                scale: 1
            });

            const skalierung =
                containerBreite / grundViewport.width;

            const viewport = seite.getViewport({
                scale: skalierung
            });

            const dpr = window.devicePixelRatio || 1;

            pdfCanvas.width = Math.floor(
                viewport.width * dpr
            );

            pdfCanvas.height = Math.floor(
                viewport.height * dpr
            );

            pdfCanvas.style.width =
                Math.floor(viewport.width) + "px";

            pdfCanvas.style.height =
                Math.floor(viewport.height) + "px";

            const context = pdfCanvas.getContext("2d");

            context.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

            await seite.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

        } catch (fehler) {
            console.error(
                "Fehler beim Rendern der PDF-Seite:",
                fehler
            );
        }
    }

    async function naechsteSeite() {
        if (aktuelleSeite >= geschichtePDFs.length) {
            return;
        }

        await ladePDF(aktuelleSeite + 1);
    }

    async function vorherigeSeite() {
        if (aktuelleSeite <= 1) {
            return;
        }

        await ladePDF(aktuelleSeite - 1);
    }

    if (weiterButton) {
        weiterButton.addEventListener(
            "click",
            naechsteSeite
        );
    }

    if (zurueckButton) {
        zurueckButton.addEventListener(
            "click",
            vorherigeSeite
        );
    }

    let touchStartX = 0;
    let touchEndX = 0;

    pdfViewer.addEventListener(
        "touchstart",
        function (event) {
            if (!event.changedTouches.length) {
                return;
            }

            touchStartX =
                event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    pdfViewer.addEventListener(
        "touchend",
        function (event) {
            if (!event.changedTouches.length) {
                return;
            }

            touchEndX =
                event.changedTouches[0].screenX;

            const differenz =
                touchEndX - touchStartX;

            if (Math.abs(differenz) < 50) {
                return;
            }

            if (differenz < 0) {
                naechsteSeite();
            } else {
                vorherigeSeite();
            }
        },
        { passive: true }
    );

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        function () {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                function () {
                    if (pdfDokument) {
                        zeichneSeite(1);
                    }
                },
                150
            );
        }
    );

    zeigeStatus();

    // Wichtig:
    // Seite 1 sofort laden und anzeigen.
    ladePDF(1);
});
