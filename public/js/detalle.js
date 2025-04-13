// public/js/detalle.js (Versión Corregida Final)

document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAR SI LOS DATOS DEL PRODUCTO LLEGARON DESDE EJS
    //    Buscamos la variable 'productoActual' que creamos en detalles.ejs
    if (typeof productoActual === 'undefined' || !productoActual) {
        console.error("Error: Datos del producto (productoActual) no disponibles en detalle.js.");
        const mainContent = document.querySelector('main');
        if (mainContent) {
             mainContent.innerHTML = '<p style="text-align:center; color:red; padding: 20px;">Error Crítico: No se pudo cargar la información del producto desde el servidor.</p>';
        }
        return; // Detener la ejecución si no hay datos del producto
    }

    // 2. OBTENER REFERENCIAS A ELEMENTOS DEL DOM IMPORTANTES
    const cantidadInput = document.getElementById('cantidad');
    const totalSpan = document.getElementById('totaltienda');
    const precioBaseSpan = document.getElementById('preciotienda'); // El <span> que muestra el precio
    const btnAgregar = document.getElementById('btnAgregar');
    // El botón Cancelar es un enlace <a href="/tienda">

    // 3. OBTENER PRECIO UNITARIO (desde el objeto productoActual)
    const precioUnitario = parseFloat(productoActual.precio);

    // 4. **** DEFINICIÓN de la función actualizarTotal ****
    //    Debe estar definida ANTES de llamarla por primera vez
    const actualizarTotal = () => {
        // Asegurarse de que cantidadInput existe antes de usarlo
        if (!cantidadInput || !totalSpan) return;

        let cantidad = parseInt(cantidadInput.value);
        // Corregir cantidad si es inválida o menor a 1
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
            cantidadInput.value = 1; // Corregir el valor en el input también
        }

        // Validar que tengamos un precio numérico
        if (!isNaN(precioUnitario)) {
            const total = (precioUnitario * cantidad).toFixed(2);
            totalSpan.textContent = `s/.${total}`;
        } else {
            totalSpan.textContent = 's/.---'; // Mostrar si el precio no es válido
            console.error("Error: precioUnitario no es un número válido:", productoActual.precio);
        }
    };

    // 5. CONFIGURAR EVENT LISTENERS

    // Listener para cuando cambia la cantidad
    if (cantidadInput) {
        // Asegurar valor inicial válido antes de añadir listener
        if (parseInt(cantidadInput.value) < 1 || isNaN(parseInt(cantidadInput.value))) {
            cantidadInput.value = 1;
        }
        cantidadInput.addEventListener('input', actualizarTotal); // Llama a la función definida arriba
    } else {
        console.warn("Elemento #cantidad no encontrado.");
    }

    // Listener para el botón "Agregar al Carrito"
    if (btnAgregar) {
        btnAgregar.addEventListener('click', async () => { // Función async para usar await con fetch
            const cantidadSeleccionada = parseInt(cantidadInput?.value || '1'); // Usa 1 si input no existe

            if (isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1) {
                alert('Por favor, ingresa una cantidad válida (1 o más).');
                if(cantidadInput) cantidadInput.value = 1;
                actualizarTotal(); // Recalcular total
                return;
            }

            // Deshabilitar botón para evitar doble clic
            btnAgregar.disabled = true;
            btnAgregar.textContent = 'Agregando...';

            // Datos a enviar al backend API
            const datos = {
                productoId: productoActual.id, // ID del producto actual
                cantidad: cantidadSeleccionada
            };

            console.log("Enviando a /api/carrito/agregar:", datos);

            try {
                // Llamada a la API usando fetch
                const response = await fetch('/api/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Podrías necesitar enviar otros headers (CSRF, Authorization) si los implementas
                    },
                    body: JSON.stringify(datos) // Enviar datos como JSON string
                });

                const resultado = await response.json(); // Leer la respuesta JSON del backend

                if (response.ok && resultado.success) {
                    console.log("Respuesta API OK:", resultado);
                    alert(resultado.message || `¡${productoActual.nombre} añadido/actualizado!`);
                    // Redirigir al carrito después de éxito
                    window.location.href = '/carrito'; // Usa la RUTA /carrito
                } else {
                    // Mostrar error del backend si lo hubo
                    console.error("Error API agregar al carrito:", resultado);
                    alert(`Error: ${resultado.message || 'No se pudo añadir el producto.'}`);
                    btnAgregar.disabled = false; // Reactivar botón en caso de error
                    btnAgregar.textContent = 'Agregar al Carrito';
                }

            } catch (error) {
                // Error de red o al parsear JSON
                console.error("Error en fetch /api/carrito/agregar:", error);
                alert('Error de conexión al intentar añadir al carrito. Revisa la consola.');
                btnAgregar.disabled = false; // Reactivar botón
                btnAgregar.textContent = 'Agregar al Carrito';
            }
        }); // Fin listener btnAgregar
    } else {
        console.warn("Botón #btnAgregar no encontrado.");
    }

    // 6. **** LLAMADA INICIAL a actualizarTotal ****
    //    Se llama DESPUÉS de haberla definido. (Esta era probablemente tu línea 95)
    actualizarTotal();

}); // Fin del DOMContentLoaded