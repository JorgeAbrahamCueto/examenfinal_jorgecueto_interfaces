class Usuario {
    constructor(nombre, apellido, email, usuario, contraseña) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.email = email;
      this.usuario = usuario;
      this.contraseña = contraseña;
    }
  }
  
  class Registro {
    constructor() {
      this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      this.form = document.querySelector('form');
      this.form.addEventListener('submit', this.registrarUsuario.bind(this));
    }
  
    registrarUsuario(event) {
        event.preventDefault();
    
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const usuario = document.getElementById('username').value;
        const contraseña = document.getElementById('password').value;
    
        if (this.usuarioExiste(usuario)) {
          alert('El usuario ya existe. Por favor, elige otro nombre de usuario.');
          return;
        }
    
        const nuevoUsuario = new Usuario(nombre, apellido, email, usuario, contraseña);
        this.usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    
        alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        window.location.href = '/sesion.html';
      }
  
    usuarioExiste(usuario) {
      return this.usuarios.some(u => u.usuario === usuario);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new Registro();
  });