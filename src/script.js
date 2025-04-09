function convertTextToHTML(text) {
    if (!text || typeof text !== 'string') {
        return '<p>Error: Invalid input text.</p>';
    }

    // Replace **bold** syntax with <strong> HTML tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace __italic__ syntax with <em> HTML tags
    text = text.replace(/__(.*?)__/g, '<em>$1</em>');

    // Replace double newlines with paragraph breaks
    text = text.replace(/\n\n/g, '<br><br>');

    // Split text into lines or list items
    const lines = text.split(/\n|(?=\* )/g);
    let inList = false; // Tracks whether we are inside a list
    let html = ''; // Stores the resulting HTML

    for (let line of lines) {
        const trimmedLine = line.trim();

        // Check if the line starts with a list item marker (*)
        if (trimmedLine.startsWith('*')) {
            if (!inList) {
                // Start a new unordered list if not already in one
                html += '<ul>';
                inList = true;
            }
            // Add the list item, removing the marker (*)
            html += `<li>${trimmedLine.replace(/^\*\s*/, '')}</li>`;
        } else if (trimmedLine) {
            if (inList) {
                // Close the unordered list if transitioning out of a list
                html += '</ul>';
                inList = false;
            }
            // Add the line as a paragraph
            html += `<p>${trimmedLine}</p>`;
        }
    }

    // Close any remaining open list
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
