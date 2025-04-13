(function(){
    const titleQuestion = [...document.querySelectorAll('.question__title')];
    console.log(titleQuestion);
    titleQuestion.forEach(question =>{
        question.addEventListener('click',()=>{
            let height = 0;
            let answer = question.nextElementSibling;
            let addPadding = question.parentElement.parentElement

            addPadding.classList.toggle('question__padding--add');

            question.children[0].classList.toggle('question__arrow--rotate');

            if(answer.clientHeight === 0){
                height = answer.scrollHeight;
            }
            answer.style.height = `${height}px`;

    })
});
})();