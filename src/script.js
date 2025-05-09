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
    const svgElement = document.createElement('div');
    svgElement.innerHTML = `<svg
        class="h-10 w-10 text-indigo-900 p-1 rounded-full bg-white "
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>`;
    const p=document.createElement('p');
    p.textContent = userText;
    p.classList.add('text-xl');
    div.append(svgElement,p);
    div.classList.add('w-full', 'p-2','px-8', 'rounded-lg', 'text-white','items-center','flex','gap-6','items-start');
    parentDiv.insertBefore(div, mainDiv);
    const inputField = document.getElementById("input-field");
    inputField.value = ""; // Clear input
}

function createBookDiv(aiText) {
    const div = document.createElement('div');
    const svgElement = document.createElement('div');
    svgElement.innerHTML=`<svg
          class="min-h-10 max-h-10 max-w-10 min-w-10 text-white p-1 rounded-sm self-start"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"
          />
          <path
            d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
          />
          <path
            d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"
          />
          <path
            d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"
          />
          <path
            d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"
          />
          <path
            d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
          />
          <path
            d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"
          />
          <path
            d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"
          />
        </svg>`
    const p=document.createElement('p');
    // p.innerHTML = aiText;
    p.classList.add('text-xl','text-indigo-900','bg-white','rounded-lg','p-2');
    div.append(svgElement,p);
    div.classList.add('w-full', 'p-4','px-8', 'rounded-lg', 'text-white','items-center','flex','gap-6','items-start','animate-pulse');
    parentDiv.insertBefore(div, mainDiv);


        setTimeout(() => {
            div.classList.remove('animate-pulse','p-4');
            div.classList.add('p-2');
            p.innerHTML = convertTextToHTML(aiText);
        }, 2000);
 

  
}

async function generateText(event) {
    event.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const inputValue = formData.get("input");

    createUserDiv(inputValue);

    const response = await fetchMessage(inputValue);
    createBookDiv(response);
    
    setTimeout(() => {
        parentDiv.scrollTop = parentDiv.scrollHeight;
    }, 800); // Wait slightly longer than the animation delay
}
