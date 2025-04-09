function convertTextToHTML(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    const lines = text.split(/\n|(?=\* )/g);
    let inList = false;
    let html = '';

    for (let line of lines) {
        if (line.trim().startsWith('*')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${line.replace(/^\*\s*/, '')}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p>${line.trim()}</p>`;
        }
    }

    if (inList) html += '</ul>';

    return html;
}

async function fetchMessage(message) {
    try {
        const response = await fetch('http://127.0.0.1:8000/ai?text=' + message);
        const data = await response.json();
        const aiText = convertTextToHTML(data.message);
        
        return aiText;
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

const parentDiv = document.getElementById('parent-div');
const mainDiv = document.getElementById('main-div');

function createUserDiv(userText) {
    const div = document.createElement('div');
    div.textContent = userText;
    div.classList.add('w-full', 'p-4','px-8', 'rounded-lg', 'text-white','min-h-8');
    parentDiv.insertBefore(div, mainDiv);
    const inputField = document.getElementById("input-field");
    inputField.value = ""; // Clear input
}

function createBookDiv(aiText) {
    const div = document.createElement('div');
    div.classList.add('max-w-full', 'p-5', 'rounded-lg', 'bg-white', 'text-slate-950', 'animate-pulse','mx-4');
    parentDiv.insertBefore(div, mainDiv);

    setTimeout(() => {
        div.classList.remove('animate-pulse','p-5');
        div.classList.add('p-2');
        div.innerHTML = aiText;
    }, 1200);
}

async function generateText(event) {
    event.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const inputValue = formData.get("input");

    createUserDiv(inputValue);


    const response = await fetchMessage(inputValue);
    createBookDiv(response);
    parentDiv.scrollTop = parentDiv.scrollHeight;

}
