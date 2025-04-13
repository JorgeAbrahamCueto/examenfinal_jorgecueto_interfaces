class PaginaPrincipal {
    constructor() {
        console.log("Inicializando scripts de la página principal...");
        // Llamamos a los métodos que inicializan cada componente interactivo
        this.inicializarSliderTestimonios();
        this.inicializarPreguntasFrecuentes();
        this.inicializarMenuNavegacion();

       
    }

  
    inicializarSliderTestimonios() {
        const sliders = [...document.querySelectorAll('.testimony__body')];
        const buttonNext = document.querySelector('#next');
        const buttonBefore = document.querySelector('#before');

        // Salir si no se encuentran los elementos necesarios para el slider
        if (sliders.length === 0 || !buttonNext || !buttonBefore) {
            // console.log("Componente Slider Testimonios no encontrado en esta página.");
            return;
        }
        console.log("Inicializando Slider Testimonios...");

        let value;

        const changePosition = (add) => {
            const currentTestimonyElement = document.querySelector('.testimony__body--show');
            // Si no hay ninguno visible al inicio (puede pasar), mostrar el primero
            if(!currentTestimonyElement && sliders.length > 0) {
                 sliders[0].classList.add('testimony__body--show');
                 return; // Salir después de mostrar el primero
            }
            if (!currentTestimonyElement) return; // Salir si sigue sin haber elemento visible

            const currentTestimony = currentTestimonyElement.dataset.id;
            value = Number(currentTestimony);
            sliders[value - 1].classList.remove('testimony__body--show'); // Ocultar actual

            value += add; // Calcular nuevo índice

            // Ajustar índice si se sale de los límites
            if (value > sliders.length) {
                value = 1;
            } else if (value < 1) {
                value = sliders.length;
            }

            sliders[value - 1].classList.add('testimony__body--show'); // Mostrar nuevo
        };

        buttonNext.addEventListener('click', () => changePosition(1));
        buttonBefore.addEventListener('click', () => changePosition(-1));

        // Asegurarse de que un slide esté activo al cargar si ninguno lo está
        if (!document.querySelector('.testimony__body--show') && sliders.length > 0) {
             sliders[0].classList.add('testimony__body--show');
        }
    }

   
    inicializarPreguntasFrecuentes() {
        const titleQuestions = [...document.querySelectorAll('.question__title')];

        // Salir si no hay preguntas en la página
        if (titleQuestions.length === 0) {
            // console.log("Componente Preguntas Frecuentes no encontrado en esta página.");
            return;
        }
        console.log("Inicializando Preguntas Frecuentes...");

        titleQuestions.forEach(question => {
            question.addEventListener('click', () => {
                let height = 0;
                let answer = question.nextElementSibling; // Asume que la respuesta <p> es el siguiente hermano
                let container = question.closest('.question__padding'); // Busca el article contenedor

                if (!answer || !container) {
                    console.warn("Estructura HTML de pregunta/respuesta no encontrada para:", question);
                    return;
                }

                container.classList.toggle('question__padding--add');
                question.querySelector('.question__arrow').classList.toggle('question__arrow--rotate');

                if (answer.clientHeight === 0) { // Si está cerrado
                    height = answer.scrollHeight; // Obtener altura completa para abrir
                }
                // Si está abierto, height permanece 0 para cerrar

                answer.style.height = `${height}px`;
            });
        });
    }

   
    inicializarMenuNavegacion() {
        const openButton = document.querySelector('.nav__menu');
        const menu = document.querySelector('.nav__link--menu'); // El UL que se muestra/oculta
        const closeMenu = document.querySelector('.nav__close');

        // Salir si no se encuentran los elementos del menú
        if (!openButton || !menu || !closeMenu) {
            // console.log("Componente Menú Navegación no encontrado en esta página.");
            return;
        }
        console.log("Inicializando Menú Navegación...");

        openButton.addEventListener('click', (e) => {
            // Prevenir comportamiento por defecto si openButton fuera un <a>
            // e.preventDefault();
            menu.classList.add('nav__link--show');
        });

        closeMenu.addEventListener('click', (e) => {
            // e.preventDefault();
            menu.classList.remove('nav__link--show');
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace dentro de él (útil en móvil)
        menu.addEventListener('click', (e) => {
             if (e.target.classList.contains('nav__links')) {
                 menu.classList.remove('nav__link--show');
             }
        });
    }
}

// --- Instanciar la clase cuando el DOM esté listo ---
//    Esto ejecutará el constructor y, por ende, las inicializaciones.
document.addEventListener('DOMContentLoaded', () => {
    new PaginaPrincipal();
});