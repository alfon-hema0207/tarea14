// Clase que representa una ficha del rompecabezas
class Ficha {
  constructor(boton, indice) {
    this.boton = boton;
    this.indice = indice;
  }

  obtenerTexto() {
    return this.boton.textContent;
  }

  establecerTexto(texto) {
    this.boton.textContent = texto;
  }

  estaVacia() {
    return this.obtenerTexto() === '';
  }

  intercambiarCon(otraFicha) {
    const temp = this.obtenerTexto();
    this.establecerTexto(otraFicha.obtenerTexto());
    otraFicha.establecerTexto(temp);
  }
}

// Clase que representa el tablero del juego
class Tablero {
  constructor(selectorContenedor) {
    this.contenedor = document.querySelector(selectorContenedor);
    this.fichas = Array.from(this.contenedor.querySelectorAll('button')).map(
      (boton, i) => new Ficha(boton, i)
    );
    this.indiceVacio = 15;
  }

  mezclar() {
    let valores = [...Array(15).keys()].map(n => (n + 1).toString()).concat('');
    valores = this.revolver(valores);

    this.fichas.forEach((ficha, i) => {
      ficha.establecerTexto(valores[i]);
      if (valores[i] === '') this.indiceVacio = i;
    });
  }

  revolver(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }

  mover(indice) {
    const dif = Math.abs(indice - this.indiceVacio);
    const movValido = (dif === 1 && Math.floor(indice / 4) === Math.floor(this.indiceVacio / 4)) || dif === 4;

    if (movValido) {
      this.fichas[indice].intercambiarCon(this.fichas[this.indiceVacio]);
      this.indiceVacio = indice;
      return true;
    }
    return false;
  }

  estaOrdenado() {
    for (let i = 0; i < 15; i++) {
      if (this.fichas[i].obtenerTexto() != i + 1) return false;
    }
    return this.fichas[15].estaVacia();
  }
}

// Clase que maneja el juego completo
class Juego {
  constructor() {
    this.tablero = new Tablero('article div');
    this.botonJugar = document.querySelector('footer button');
    this.spanMovs = document.querySelector('footer span:nth-of-type(1)');
    this.spanTiempo = document.querySelector('footer span:nth-of-type(2)');
    this.mensajeFinal = document.querySelector('section');
    this.movimientos = 0;
    this.tiempo = 0;
    this.temporizador = null;

    this.iniciarEventos();
  }

  iniciarEventos() {
    this.tablero.fichas.forEach((ficha, i) => {
      ficha.boton.addEventListener('click', () => this.intentarMover(i));
    });

    this.botonJugar.addEventListener('click', () => this.iniciarJuego());
  }

  iniciarJuego() {
    this.tablero.mezclar();
    this.movimientos = 0;
    this.tiempo = 0;
    this.actualizarInfo();
    this.mensajeFinal.innerHTML = '<h2>El juego finalizó en: </h2>';

    clearInterval(this.temporizador);
    this.temporizador = setInterval(() => {
      this.tiempo++;
      this.actualizarInfo();
    }, 1000);
  }

  intentarMover(indice) {
    if (this.tablero.mover(indice)) {
      this.movimientos++;
      this.actualizarInfo();
      if (this.tablero.estaOrdenado()) this.terminarJuego();
    }
  }

  terminarJuego() {
    clearInterval(this.temporizador);
    this.mensajeFinal.innerHTML = `<h2>El juego finalizó en: ${this.tiempo} segundos y ${this.movimientos} movimientos.</h2>`;
  }

  actualizarInfo() {
    this.spanMovs.textContent = `movimientos: ${this.movimientos}`;
    this.spanTiempo.textContent = `Tiempo: ${this.tiempo}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Juego();
});