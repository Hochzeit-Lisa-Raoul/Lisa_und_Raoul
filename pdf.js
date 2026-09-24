/* =========================================================
   UNSERE GESCHICHTE
   PDF-ALBUM MIT PDF.JS
   ========================================================= */


import * as pdfjsLib from
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";


pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -------------------------------------------------
           PDF-LISTE
           ------------------------------------------------- */

        const geschichtePDFs = [

            "Zeitung/Seite_01.pdf",
            "Zeitung/Seite_02.pdf",
            "Zeitung/Seite_03.pdf",
            "Zeitung/Seite_04.pdf",
            "Zeitung/Seite_05.pdf",
            "Zeitung/Seite_06.pdf",
            "Zeitung/Seite_07.pdf",
            "Zeitung/Seite_08.pdf",
            "Zeitung/Seite_09.pdf",
            "Zeitung/Seite_10.pdf",
            "Zeitung/Seite_11.pdf",
            "Zeitung/Seite_12.pdf",
            "Zeitung/Seite_13.pdf",
            "Zeitung/Seite_14.pdf",
            "Zeitung/Seite_15.pdf",
            "Zeitung/Seite_16.pdf",
            "Zeitung/Seite_17.pdf",
            "Zeitung/Seite_18.pdf",
            "Zeitung/Seite_19.pdf"

        ];


        /* -------------------------------------------------
           ELEMENTE
           ------------------------------------------------- */

        const pdfViewer =
            document.getElementById(
                "pdfViewer"
            );

        const pdfCanvas =
            document.getElementById(
                "pdfCanvas"
            );

        const albumStatus =
            document.getElementById(
                "albumStatus"
            );

        const seitenAnzeige =
            document.getElementById(
                "seitenAnzeige"
            );

        const zurueckButton =
            document.getElementById(
                "zurueckButton"
            );

        const weiterButton =
            document.getElementById(
                "weiterButton"
            );

        const pdfOpenButton =
            document.getElementById(
                "pdfOpenButton"
            );


        /* -------------------------------------------------
           PRÜFEN
           ------------------------------------------------- */

        if (
            !pdfViewer ||
            !pdfCanvas ||
            !albumStatus ||
            !seitenAnzeige ||
            !zurueckButton ||
            !weiterButton ||
            !pdfOpenButton
        ) {

            console.error(
                "PDF-Album: Benötigte HTML-Elemente fehlen."
            );

            return;

        }


        /* -------------------------------------------------
           CANVAS
           ------------------------------------------------- */

        const context =
            pdfCanvas.getContext("2d");


        /* -------------------------------------------------
           PDF-DOKUMENTE
           ------------------------------------------------- */

        let pdfDokumente = [];


        /* -------------------------------------------------
           AKTUELLE POSITION
           ------------------------------------------------- */

        let aktuellesPDF = 0;

        let aktuelleSeite = 1;

        let renderTask = null;


        /* -------------------------------------------------
           ALLE SEITEN ZÄHLEN
           ------------------------------------------------- */

        let gesamtSeiten = 0;


        /* -------------------------------------------------
           PDF-DOKUMENTE LADEN
           ------------------------------------------------- */

        async function ladePDFs() {

            pdfViewer.classList.add(
                "pdf-loading"
            );


            try {

                for (
                    let i = 0;
                    i < geschichtePDFs.length;
                    i++
                ) {

                    const loadingTask =
                        pdfjsLib.getDocument(
                            geschichtePDFs[i]
                        );


                    const pdf =
                        await loadingTask.promise;


                    pdfDokumente.push({
                        pdf: pdf,
                        startSeite:
                            gesamtSeiten + 1,
                        anzahlSeiten:
                            pdf.numPages
                    });


                    gesamtSeiten +=
                        pdf.numPages;

                }


                console.log(
                    "PDF-Album geladen:",
                    gesamtSeiten,
                    "Seiten"
                );


                /* Erste Seite anzeigen */

                await zeigeAktuelleSeite();


            } catch (error) {

                console.error(
                    "PDFs konnten nicht geladen werden:",
                    error
                );


            } finally {

                pdfViewer.classList.remove(
                    "pdf-loading"
                );

            }

        }


        /* -------------------------------------------------
           AKTUELLE SEITE ANZEIGEN
           ------------------------------------------------- */

        async function zeigeAktuelleSeite() {

            if (
                !pdfDokumente.length
            ) {

                return;

            }


            const dokument =
                pdfDokumente[
                    aktuellesPDF
                ];


            const pdf =
                dokument.pdf;


            /* -------------------------------------------------
               SEITE LADEN
               ------------------------------------------------- */

            const page =
                await pdf.getPage(
                    aktuelleSeite
                );


            /* -------------------------------------------------
               BREITE DES VIEWERS
               ------------------------------------------------- */

            const containerWidth =
                pdfViewer.clientWidth;


            const originalViewport =
                page.getViewport({
                    scale: 1
                });


            let scale =
                containerWidth /
                originalViewport.width;


            /*
               Verhindert, dass die Seite
               auf großen Bildschirmen
               unnötig riesig wird.
            */

            const maxScale =
                1.5;


            scale =
                Math.min(
                    scale,
                    maxScale
                );


            const viewport =
                page.getViewport({
                    scale: scale
                });


            /* -------------------------------------------------
               HOHE AUFLÖSUNG
               ------------------------------------------------- */

            const outputScale =
                window.devicePixelRatio ||
                1;


            pdfCanvas.width =
                Math.floor(
                    viewport.width *
                    outputScale
                );


            pdfCanvas.height =
                Math.floor(
                    viewport.height *
                    outputScale
                );


            pdfCanvas.style.width =
                Math.floor(
                    viewport.width
                ) + "px";


            pdfCanvas.style.height =
                Math.floor(
                    viewport.height
                ) + "px";


            /* -------------------------------------------------
               RENDERN
               ------------------------------------------------- */

            if (renderTask) {

                try {

                    renderTask.cancel();

                } catch (e) {}

            }


            renderTask =
                page.render({

                    canvasContext:
                        context,

                    viewport:
                        viewport,

                    transform:
                        outputScale !== 1
                            ? [
                                outputScale,
                                0,
                                0,
                                outputScale,
                                0,
                                0
                            ]
                            : null

                });


            try {

                await renderTask.promise;

            } catch (error) {

                /*
                   Abgebrochene Render-Vorgänge
                   ignorieren.
                */

                if (
                    error?.name !==
                    "RenderingCancelledException"
                ) {

                    console.error(
                        error
                    );

                }

                return;

            }


            renderTask = null;


            /* -------------------------------------------------
               STATUS AKTUALISIEREN
               ------------------------------------------------- */

            const globaleSeite =
                dokument.startSeite +
                aktuelleSeite -
                1;


            albumStatus.textContent =
                "Seite " +
                globaleSeite +
                " von " +
                gesamtSeiten;


            seitenAnzeige.textContent =
                globaleSeite +
                " / " +
                gesamtSeiten;


            /* -------------------------------------------------
               BUTTONS
               ------------------------------------------------- */

            const istErsteSeite =
                globaleSeite === 1;


            const istLetzteSeite =
                globaleSeite ===
                gesamtSeiten;


            zurueckButton.disabled =
                istErsteSeite;


            weiterButton.disabled =
                istLetzteSeite;


            /* -------------------------------------------------
               PDF SEPARAT ÖFFNEN
               ------------------------------------------------- */

            pdfOpenButton.href =
                geschichtePDFs[
                    aktuellesPDF
                ];

        }


        /* -------------------------------------------------
           NÄCHSTE SEITE
           ------------------------------------------------- */

        async function naechsteSeite() {

            const dokument =
                pdfDokumente[
                    aktuellesPDF
                ];


            /*
               Noch eine Seite innerhalb
               derselben PDF?
            */

            if (
                aktuelleSeite <
                dokument.anzahlSeiten
            ) {

                aktuelleSeite++;

                await zeigeAktuelleSeite();

                return;

            }


            /*
               Ende dieser PDF erreicht.
               Gibt es eine nächste PDF?
            */

            if (
                aktuellesPDF <
                pdfDokumente.length - 1
            ) {

                aktuellesPDF++;

                aktuelleSeite = 1;

                await zeigeAktuelleSeite();

            }

        }


        /* -------------------------------------------------
           VORHERIGE SEITE
           ------------------------------------------------- */

        async function vorherigeSeite() {

            /*
               Noch eine Seite innerhalb
               derselben PDF?
            */

            if (
                aktuelleSeite > 1
            ) {

                aktuelleSeite--;

                await zeigeAktuelleSeite();

                return;

            }


            /*
               Anfang dieser PDF erreicht.
               Gibt es eine vorherige PDF?
            */

            if (
                aktuellesPDF > 0
            ) {

                aktuellesPDF--;

                aktuelleSeite =
                    pdfDokumente[
                        aktuellesPDF
                    ].anzahlSeiten;


                await zeigeAktuelleSeite();

            }

        }


        /* -------------------------------------------------
           WEITER BUTTON
           ------------------------------------------------- */

        weiterButton.addEventListener(
            "click",
            function () {

                naechsteSeite();

            }
        );


        /* -------------------------------------------------
           ZURÜCK BUTTON
           ------------------------------------------------- */

        zurueckButton.addEventListener(
            "click",
            function () {

                vorherigeSeite();

            }
        );


        /* =================================================
           WISCHEN AUF DEM HANDY
           ================================================= */

        let touchStartX = 0;
        let touchStartY = 0;


        pdfViewer.addEventListener(
            "touchstart",
            function (event) {

                const touch =
                    event.changedTouches[0];


                touchStartX =
                    touch.screenX;


                touchStartY =
                    touch.screenY;

            },
            {
                passive: true
            }
        );


        pdfViewer.addEventListener(
            "touchend",
            function (event) {

                const touch =
                    event.changedTouches[0];


                const touchEndX =
                    touch.screenX;


                const touchEndY =
                    touch.screenY;


                const deltaX =
                    touchEndX -
                    touchStartX;


                const deltaY =
                    touchEndY -
                    touchStartY;


                /*
                   Nur reagieren, wenn es
                   wirklich ein horizontaler
                   Wisch war.
                */

                if (
                    Math.abs(deltaX) < 50
                ) {

                    return;

                }


                if (
                    Math.abs(deltaX) <
                    Math.abs(deltaY)
                ) {

                    return;

                }


                if (
                    deltaX < 0
                ) {

                    /*
                       Wisch nach links
                       = nächste Seite
                    */

                    naechsteSeite();

                } else {

                    /*
                       Wisch nach rechts
                       = vorherige Seite
                    */

                    vorherigeSeite();

                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           NEUSKALIERUNG
           ================================================= */

        let resizeTimeout;


        window.addEventListener(
            "resize",
            function () {

                clearTimeout(
                    resizeTimeout
                );


                resizeTimeout =
                    setTimeout(
                        function () {

                            zeigeAktuelleSeite();

                        },
                        200
                    );

            }
        );


        /* -------------------------------------------------
           START
           ------------------------------------------------- */

        ladePDFs();

    }
);