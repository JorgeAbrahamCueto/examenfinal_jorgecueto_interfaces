class CarritoClienteAPI {
    constructor() {
        console.log("Inicializando CarritoClienteAPI (vAPI)..."); // Log para confirmar versión
        this.obtenerElementos();
        this.agregarEventListenersGenerales();
        this.agregarEventListenersEliminar();
        this.mostrarTotalGeneral(); // Calcular total desde el HTML renderizado por EJS
    }

    obtenerElementos() {
        this.contenedorCarrito = document.getElementById('carrito-tienda');
        this.btnVaciar = document.querySelector('.carrito-tienda-data-button-vaciar');
        this.btnPagar = document.querySelector('.carrito-tienda-data-button-pagar');
        this.elementoTotalGeneral = document.getElementById('carrito-total-general');
        this.mensajeVacio = document.querySelector('.carrigo__vacio'); // Asegúrate que esta clase exista en carrito.ejs
    }


    agregarEventListenersGenerales() {
        if (this.btnVaciar) {
            this.btnVaciar.addEventListener('click', async () => {
                if (confirm('¿Seguro que quieres vaciar todo el carrito?')) {
                    await this.vaciarCarritoAPI();
                }
            });
        }

        
    
        if (this.btnPagar) {
            this.btnPagar.addEventListener('click', () => {
                     // Verificar si hay items visualmente (como fallback)
                     const itemsActuales = this.contenedorCarrito?.querySelectorAll('.carrito-producto').length || 0;
                     if (itemsActuales === 0) {
                         alert("El carrito está vacío.");
                         return; // No redirigir si no hay items visibles
                     }
    
                     console.log("Redirigiendo a /pago...");
                     window.location.href = '/pago'; // Solo redirigir
                 });
        }
    }

    agregarEventListenersEliminar() {
        if (!this.contenedorCarrito) return;
        this.contenedorCarrito.addEventListener('click', async (evento) => {
            if (evento.target.classList.contains('carrito-producto-eliminar')) {
                const boton = evento.target;
                const itemId = boton.dataset.itemId; // ID del item en tabla carrito_items
                if (itemId) {
                    boton.disabled = true; boton.textContent = '...';
                    await this.eliminarProductoAPI(itemId, boton.closest('.carrito-producto'));
                } else { console.warn("Botón eliminar sin data-item-id"); }
            }
        });
    }

    async eliminarProductoAPI(itemId, elementoProductoDiv) {
        console.log(`API: Eliminando item ID: ${itemId}`);
        const boton = elementoProductoDiv?.querySelector('.carrito-producto-eliminar');
        try {
            const response = await fetch(`/api/carrito/item/${itemId}`, { method: 'DELETE' });
            const resultado = await response.json();
            if (response.ok && resultado.success) {
                console.log(resultado.message); if (elementoProductoDiv) elementoProductoDiv.remove();
                this.verificarEstadoCarritoVacio(); this.mostrarTotalGeneral();
            } else { console.error("Error API eliminar:", resultado); alert(`Error: ${resultado.message || 'No se pudo eliminar.'}`); if(boton){ boton.disabled = false; boton.textContent = 'Eliminar';} }
        } catch (error) { console.error("Fetch Error eliminar:", error); alert('Error de conexión al eliminar.'); if(boton){ boton.disabled = false; boton.textContent = 'Eliminar';} }
    }

    async vaciarCarritoAPI() {
         console.log("API: Vaciando carrito...");
         if(this.btnVaciar) this.btnVaciar.disabled = true; if(this.btnPagar) this.btnPagar.disabled = true;
         try {
             const response = await fetch('/api/carrito/vaciar', { method: 'DELETE' });
             const resultado = await response.json();
             if (response.ok && resultado.success) { console.log(resultado.message); this.actualizarVistaCarritoVacio(); } // Limpiar DOM
             else { console.error("Error API vaciar:", resultado); alert(`Error: ${resultado.message || 'No se pudo vaciar.'}`); if(this.btnVaciar) this.btnVaciar.disabled = false; if(this.btnPagar) this.btnPagar.disabled = false; }
         } catch (error) { console.error("Fetch Error vaciar:", error); alert('Error de conexión al vaciar.'); if(this.btnVaciar) this.btnVaciar.disabled = false; if(this.btnPagar) this.btnPagar.disabled = false; }
    }

    // Calcula total LEYENDO el HTML renderizado por EJS
    calcularTotalGeneral() {
        console.log("Calculando total general desde DOM (API Version)..."); if (!this.contenedorCarrito) return 0;
        const itemsEnDOM = this.contenedorCarrito.querySelectorAll('.carrito-producto'); let totalCalculado = 0;
        if (itemsEnDOM.length === 0) { console.log("No items .carrito-producto en DOM."); } else { console.log(`Encontrados ${itemsEnDOM.length} items .carrito-producto.`); }
        itemsEnDOM.forEach((itemDiv, index) => { const nombre = itemDiv.querySelector('.carrito-producto-nombre')?.textContent || `Item ${index+1}`;
            // *** ASEGÚRATE QUE carrito.ejs GENERA ESTAS CLASES ***
            const precioUnitTexto = itemDiv.querySelector('.carrito-producto-precio-unitario')?.textContent || '';
            const cantidadTexto = itemDiv.querySelector('.carrito-producto-cantidad')?.textContent || '';
            const precioUnitMatch = precioUnitTexto.match(/(\d+(\.\d+)?)/); const cantidadMatch = cantidadTexto.match(/\d+/);
            console.log(`  Item <span class="math-inline">\{nombre\}\: P\='</span>{precioUnitTexto}', Q='<span class="math-inline">\{cantidadTexto\}' \-\> PNum\='</span>{precioUnitMatch ? precioUnitMatch[0] : 'FAIL'}', QNum='${cantidadMatch ? cantidadMatch[0] : 'FAIL'}'`);
            if (precioUnitMatch && cantidadMatch) { const precio = parseFloat(precioUnitMatch[0]); const cantidad = parseInt(cantidadMatch[0]); if (!isNaN(precio) && !isNaN(cantidad) && cantidad > 0 && precio >= 0) { totalCalculado += (precio * cantidad); } else { console.warn(`  Valores inválidos <span class="math-inline">\{nombre\}\: P\=</span>{precio}, Q=${cantidad}`); } }
            else { console.warn(`  No se extrajeron números para ${nombre}. ¿Clases CSS correctas?`); } });
        console.log("==> Total General Calculado:", totalCalculado); return totalCalculado;
    }

    mostrarTotalGeneral() { const total = this.calcularTotalGeneral(); const totalFormateado = (typeof total === 'number') ? total.toFixed(2) : 'Error'; console.log(`Mostrando total general en HTML: ${totalFormateado}`); if (this.elementoTotalGeneral) { this.elementoTotalGeneral.textContent = `Total General: s/. ${totalFormateado}`; /*...estilos...*/ } else { console.warn("#carrito-total-general no encontrado."); } }

    actualizarVistaCarritoVacio() { if (this.contenedorCarrito) this.contenedorCarrito.innerHTML = ''; if (this.mensajeVacio) this.mensajeVacio.style.display = 'block'; if (this.elementoTotalGeneral) this.elementoTotalGeneral.textContent = 'Total General: s/. 0.00'; if (this.btnPagar) this.btnPagar.style.display = 'none'; if (this.btnVaciar) this.btnVaciar.style.display = 'none'; }
    verificarEstadoCarritoVacio() { const itemsRestantes = this.contenedorCarrito?.querySelectorAll('.carrito-producto').length || 0; if (itemsRestantes === 0) { this.actualizarVistaCarritoVacio(); } }

} // Fin clase

document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('carrito-tienda')) { new CarritoClienteAPI(); } });