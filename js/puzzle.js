class Rompecabezas {
    constructor() {
        this.botones = document.querySelectorAll('main article div button');
        this.botonJugar = document.querySelector('footer button');
        this.movimientosSpan = document.querySelector('footer span:nth-of-type(1)');
        this.tiempoSpan = document.querySelector('footer span:nth-of-type(2)');
        this.mensajeFinal = document.querySelector('section h2');

        this.tiempo = 0;
        this.movimientos = 0;
        this.intervalo = null;

        this.botonJugar.addEventListener('click', () => this.iniciarJuego());
        this.asignarEventos();
    }

    iniciarJuego() {
        const numeros = [...Array(15).keys()].map(n => n + 1).concat(['']);
        do {
            this.desordenar(numeros);
        } while (!this.esSolucionable(numeros));

        this.botones.forEach((btn, i) => {
            btn.textContent = numeros[i];
        });

        this.movimientos = 0;
        this.tiempo = 0;
        this.actualizarTexto();

        clearInterval(this.intervalo);
        this.intervalo = setInterval(() => {
            this.tiempo++;
            this.actualizarTexto();
        }, 1000);

        this.mensajeFinal.textContent = 'El juego finalizó en: ';
    }

    asignarEventos() {
        this.botones.forEach((btn, i) => {
            btn.addEventListener('click', () => this.intentarMover(i));
        });
    }

    intentarMover(i) {
        const vacio = [...this.botones].findIndex(btn => btn.textContent === '');
        if (this.esAdyacente(i, vacio)) {
            [this.botones[i].textContent, this.botones[vacio].textContent] =
                [this.botones[vacio].textContent, this.botones[i].textContent];
            this.movimientos++;
            this.actualizarTexto();
            if (this.juegoTerminado()) {
                clearInterval(this.intervalo);
                this.mensajeFinal.textContent = `El juego finalizó en: ${this.tiempo} segundos y ${this.movimientos} movimientos`;
            }
        }
    }

    esAdyacente(i, j) {
        const filaI = Math.floor(i / 4), colI = i % 4;
        const filaJ = Math.floor(j / 4), colJ = j % 4;
        return Math.abs(filaI - filaJ) + Math.abs(colI - colJ) === 1;
    }

    desordenar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    esSolucionable(piezas) {
        const numeros = piezas.filter(x => x !== '').map(Number);
        let inversiones = 0;
        for (let i = 0; i < numeros.length - 1; i++) {
            for (let j = i + 1; j < numeros.length; j++) {
                if (numeros[i] > numeros[j]) inversiones++;
            }
        }
        const filaVacia = Math.floor(piezas.indexOf('') / 4);
        return (inversiones + filaVacia) % 2 === 0;
    }

    juegoTerminado() {
        for (let i = 0; i < 15; i++) {
            if (this.botones[i].textContent != i + 1) return false;
        }
        return this.botones[15].textContent === '';
    }

    actualizarTexto() {
        this.movimientosSpan.textContent = `movimientos: ${this.movimientos}`;
        this.tiempoSpan.textContent = `Tiempo: ${this.tiempo}`;
    }
}

// Esperar a que el DOM esté cargado
window.addEventListener('DOMContentLoaded', () => new Rompecabezas());
