// Variables globals
const taula = document.querySelector('table');
const numFiles = taula.rows.length;
const numColumnes = taula.rows[0].cells.length;
const minesRestantsElement = document.querySelector("#minesRestants");
const botoReiniciar = document.querySelector("#reiniciarPartida");

let numMinesRestants = 10;
let taulell = [];
let jocAcabat = false;

// Inicia partida al clicar el botó
botoReiniciar.addEventListener("click", function () {
    iniciarPartida();
});

function iniciarPartida() {
    taulell = [];
    jocAcabat = false;
    numMinesRestants = 10;
    minesRestantsElement.textContent = numMinesRestants;

    for (let i = 0; i < numFiles; i++) {
        taulell[i] = [];
        for (let j = 0; j < numColumnes; j++) {
            const td = taula.rows[i].cells[j];
            td.dataset.fila = i;
            td.dataset.columna = j;
            td.dataset.bomba = "false";
            td.dataset.revelada = "false";
            td.dataset.bandera = "false";
            td.innerHTML = `<img src="img/inicial.svg" alt="Casella inicial">`;

            const tdNou = td.cloneNode(true);
            td.parentNode.replaceChild(tdNou, td);

            tdNou.addEventListener("click", function (event) {
                controlClick(event);
            });

            tdNou.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                controlClickDret(event);
            });

            taulell[i][j] = {
                bomba: false,
                revelada: false,
                td: tdNou,
                numero: 0
            };
        }
    }

    colocarBombes();
}

function colocarBombes() {
    let bombesColocades = 0;

    while (bombesColocades < numMinesRestants) {
        const fila = Math.floor(Math.random() * numFiles);
        const col = Math.floor(Math.random() * numColumnes);
        const casella = taulell[fila][col];

        if (!casella.bomba) {
            casella.bomba = true;
            casella.td.dataset.bomba = "true";
            bombesColocades++;
        }
    }
}

function controlClick(event) {
    let continuar = true;

    if (jocAcabat) {
        continuar = false;
    }

    const td = event.currentTarget;
    const fila = parseInt(td.dataset.fila);
    const columna = parseInt(td.dataset.columna);
    const cel = taulell[fila][columna];

    if (td.dataset.bandera === "true" || cel.revelada) {
        continuar = false;
    }

    if (!continuar) {
        return;
    }

    cel.revelada = true;
    td.dataset.revelada = "true";
    cel.td.classList.add("revealed");

    if (cel.bomba) {
        cel.td.innerHTML = `<img src="img/bomba.svg" alt="Bomba">`;
        revelarBombes();
        jocAcabat = true;
        setTimeout(() => {
            alert("💥 BOOM!! Has perdut!");
        }, 100);
    } else {
        const numero = comptarBombesAdjacents(fila, columna);
        if (numero === 0) {
            cel.td.innerHTML = `<img src="img/buida.svg" alt="Casella buida">`;
            revelarAdjacents(fila, columna);
        } else {
            cel.td.innerHTML = `<img src="img/${numero}.svg" alt="Número ${numero}">`;
        }

        comprovarVictoria();
    }
}

function comptarBombesAdjacents(fila, columna) {
    let count = 0;

    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            const dinsLimits = i >= 0 && i < numFiles && j >= 0 && j < numColumnes;
            const noEsMateixa = !(i === fila && j === columna);
            if (dinsLimits && noEsMateixa && taulell[i][j].bomba) {
                count++;
            }
        }
    }

    return count;
}

function revelarAdjacents(fila, columna) {
    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            const dinsLimits = i >= 0 && i < numFiles && j >= 0 && j < numColumnes;
            const noEsMateixa = !(i === fila && j === columna);

            if (dinsLimits && noEsMateixa) {
                const veina = taulell[i][j];
                const noReveladaNiBomba = !veina.revelada && !veina.bomba;
                const noTéBandera = veina.td.dataset.bandera !== "true";

                if (noReveladaNiBomba && noTéBandera) {
                    veina.td.dispatchEvent(new Event("click"));
                }
            }
        }
    }
}

function revelarBombes() {
    for (let i = 0; i < numFiles; i++) {
        for (let j = 0; j < numColumnes; j++) {
            const cel = taulell[i][j];
            if (cel.bomba) {
                cel.td.innerHTML = `<img src="img/bomba.svg" alt="Bomba">`;
            }
        }
    }
}

function controlClickDret(event) {
    let continuar = true;

    if (jocAcabat) {
        continuar = false;
    }

    const td = event.currentTarget;
    const fila = parseInt(td.dataset.fila);
    const columna = parseInt(td.dataset.columna);
    const cel = taulell[fila][columna];

    if (cel.revelada) {
        continuar = false;
    }

    if (!continuar) {
        return;
    }

    const marcada = td.dataset.bandera === "true";

    if (marcada) {
        td.dataset.bandera = "false";
        td.innerHTML = `<img src="img/inicial.svg" alt="Casella inicial">`;
        numMinesRestants++;
    } else {
        td.dataset.bandera = "true";
        td.innerHTML = `<img src="img/bandera.svg" alt="Bandera">`;
        numMinesRestants--;
    }

    minesRestantsElement.textContent = numMinesRestants;
}

function comprovarVictoria() {
    let totesRevelades = true;

    for (let i = 0; i < numFiles; i++) {
        for (let j = 0; j < numColumnes; j++) {
            const cel = taulell[i][j];
            if (!cel.bomba && !cel.revelada) {
                totesRevelades = false;
            }
        }
    }

    if (totesRevelades) {
        jocAcabat = true;
        alert("🎉 Felicitats! Has guanyat!");
    }
}

// Inicia el joc en carregar la pàgina
iniciarPartida();
