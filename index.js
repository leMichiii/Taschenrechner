const ANZEIGE_ID = "anzeige";
const EINGABEFELD_ID = "eingabefeld";
const RECHENWEG_ANZEIGE_ID = "rechenweg-anzeige";
const RECHNEN_BUTTON_ID = "rechnen-button";
const TASTE_KLASSE = "taste";
const FEHLER_KLASSE = "fehler";

const LEERZEICHEN_ERFORDERLICH_REGEX = /(\d|\))\s*(\+|\-|\*|\/)\s*/g;
const GUELTIGE_EINGABE_REGEX = /^[\d .,\(\)\+\-\*\/]*$/;

const anzeige = document.getElementById(ANZEIGE_ID);
const eingabefeld = document.getElementById(EINGABEFELD_ID);
const rechenwegAnzeige = document.getElementById(RECHENWEG_ANZEIGE_ID);
const rechnenButton = document.getElementById(RECHNEN_BUTTON_ID);
const tasten = document.getElementsByClassName(TASTE_KLASSE);

const formatierer = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 15,
    useGrouping: false,
});

let aktuelleEingabe = "";

for (const taste of tasten) {
    taste.addEventListener("click", function (ereignis) {
        rechenwegAnzeige.textContent = "";
        const angeklicktesZeichen = ereignis.target.textContent;
        switch (angeklicktesZeichen) {
            case "ENTF":
                eingabefeld.value = eingabefeld.value.trimEnd().slice(0, -1).trimEnd();
                aktuelleEingabe = eingabefeld.value;
                break;

            case "AC":
                eingabefeld.value = "";
                aktuelleEingabe = "";
                break;

            case "=":
                try {
                    const ergebnis = new Function("return " + eingabefeld.value.replaceAll(",", "."))();
                    eingabefeld.value = formatierer.format(ergebnis);
                    rechenwegAnzeige.textContent = aktuelleEingabe;
                    aktuelleEingabe = eingabefeld.value;
                    rechenwegAnzeige.classList.remove(FEHLER_KLASSE);
                } catch {
                    rechenwegAnzeige.textContent = "Mathematischer Fehler!";
                    rechenwegAnzeige.classList.add(FEHLER_KLASSE);
                }

                break;

            default:
                eingabefeld.value += angeklicktesZeichen;
                eingabefeld.value = eingabefeld.value.replaceAll(LEERZEICHEN_ERFORDERLICH_REGEX, "$1 $2 ");

                aktuelleEingabe = eingabefeld.value;
                break;
        }
    });
}

eingabefeld.addEventListener("input", function (ereignis) {
    if (GUELTIGE_EINGABE_REGEX.test(eingabefeld.value)) {
        aktuelleEingabe = eingabefeld.value;
    } else {
        eingabefeld.value = aktuelleEingabe;
    }
});

eingabefeld.addEventListener("keydown", function (ereignis) {
    if (ereignis.key === "Enter") {
        rechnenButton.click();
    }
});