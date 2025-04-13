document.addEventListener('DOMContentLoaded', function () {
    const slide = document.querySelector('.slide');
    const pictures = slide.querySelectorAll('picture');
    const prevButton = document.getElementById('before');
    const nextButton = document.getElementById('next');
    let currentIndex = 0;
    let intervalId;

    function showSlide(index) {
        pictures.forEach((picture, i) => {
            if (i === index) {
                picture.classList.add('active');
            } else {
                picture.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % pictures.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + pictures.length) % pictures.length;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    nextButton.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    showSlide(currentIndex);
    startAutoSlide();
});