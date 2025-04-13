class Producto {
    constructor(imagen, nombre, descripcion, categoria, precio) {
        this.imagen = imagen;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precio = precio;
    }
}

class Tienda {
    constructor() {
        this.agregarEventosAgregar();
    }

    agregarEventosAgregar() {
        const botonesAgregar = document.querySelectorAll('.price__cta');
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', (event) => {
                event.preventDefault();
                this.productoSeleccionado(event.target);
            });
        });
    }

    productoSeleccionado(boton) {
        const imagen = boton.dataset.imagen;
        const nombre = boton.dataset.nombre;
        const descripcion = boton.dataset.descripcion;
        const categoria = boton.dataset.categoria;
        const precio = boton.dataset.precio;

        const producto = new Producto(imagen, nombre, descripcion, categoria, precio);

        localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
        window.location.href = 'detalles.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tienda();
});