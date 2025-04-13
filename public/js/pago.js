document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script de pago inicializado');
    
    // Elementos del DOM
    const totalAmountElement = document.getElementById('total-amount');
    const submitButton = document.getElementById('submit-payment');
    const paymentForm = document.getElementById('payment-form');
    
    // Función para mostrar error
    const showError = (message) => {
        if (totalAmountElement) {
            totalAmountElement.textContent = message;
            totalAmountElement.style.color = '#dc3545';
        }
        if (submitButton) {
            submitButton.disabled = true;
        }
    };
    
    // Función para cargar el total del carrito
    const loadCartTotal = async () => {
        try {
            console.log('Cargando total del carrito...');
            
            if (totalAmountElement) {
                totalAmountElement.textContent = 'Cargando...';
                totalAmountElement.style.color = '#6c757d';
            }
            
            const response = await fetch('/api/carrito/total', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            console.log('Respuesta recibida:', response);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            if (data.success && typeof data.total === 'number') {
                if (totalAmountElement) {
                    totalAmountElement.textContent = `s/. ${data.total.toFixed(2)}`;
                    totalAmountElement.style.color = '#2a6496';
                }
                if (submitButton) {
                    submitButton.disabled = data.total <= 0;
                }
            } else {
                throw new Error(data.message || 'Respuesta inválida del servidor');
            }
        } catch (error) {
            console.error('Error al cargar el total:', error);
            showError('Error al cargar total');
        }
    };
    
    // Manejar envío del formulario
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Procesando...';
            }
            
            try {
                const response = await fetch('/procesar-pago-simulado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    window.location.href = '/pedido_exitoso';
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al procesar pago');
                }
            } catch (error) {
                console.error('Error al procesar pago:', error);
                alert(`Error al procesar el pago: ${error.message}`);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Pagar (Simulado)';
                }
            }
        });
    }
    
    // Cargar el total inicial
    await loadCartTotal();
});