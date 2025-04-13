class Sesion {
    constructor() {
      this.form = document.querySelector('form');
      this.form.addEventListener('submit', this.iniciarSesion.bind(this));
    }
  
    iniciarSesion(event) {
      event.preventDefault();
  
      const usuarioIngresado = document.getElementById('username').value;
      const contraseñaIngresada = document.getElementById('password').value;
  
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioValidado = usuarios.find(u => u.usuario === usuarioIngresado && u.contraseña === contraseñaIngresada);
  
      if (usuarioValidado) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioValidado));
        window.location.href = '/index.html';
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new Sesion();
  });