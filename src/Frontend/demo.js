
    const mainDiv=document.getElementById('main-div');

    function generateText(){
        event.preventDefault();
        const div=document.createElement('div');
        div.textContent="Hella jaideep";
        div.classList.add('even:bg-stone-300', 'odd:bg-white','p-2','rounded-lg');
        mainDiv.append(div);
    }

