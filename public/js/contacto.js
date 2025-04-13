// contacto.js

class ContactoForm {
    constructor() {
        this.form = document.querySelector('.contact__form');
        this.nombreInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.mensajeInput = document.getElementById('message');

        this.agregarEventos();
    }

    agregarEventos() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.enviarFormulario();
        });
    }

    enviarFormulario() {
        const nombre = this.nombreInput.value;
        const email = this.emailInput.value;
        const mensaje = this.mensajeInput.value;

        
        this.enviarDatos(nombre, email, mensaje);

        
        this.limpiarFormulario();
    }

    enviarDatos(nombre, email, mensaje) {
       fetch(this.form.action, {
            method: this.form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, mensaje })
        })
        .then(response => {
            if (response.ok) {
                alert('¡Formulario enviado con éxito!');
            } else {
                alert('Hubo un error al enviar el formulario.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario.');
        });
    }

    limpiarFormulario() {
        this.nombreInput.value = '';
        this.emailInput.value = '';
        this.mensajeInput.value = '';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ContactoForm();
});