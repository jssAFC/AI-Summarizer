function convertTextToHTML(text) {
    // Replace bold (**text**) with <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace * bullets * with <ul><li>...</li></ul>
    // This part will replace multiple bullets into a single <ul>
    const lines = text.split(/\n|(?=\* )/g); // split on new lines or '* '
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


async function fetchMessage() {
    try {
        const book = document.getElementById("input").value;
        console.log(book)
        const response = await fetch('http://127.0.0.1:8000/ai?text='+book);
        const data = await response.json();
        console.log(data);
        document.getElementsByClassName("res")[0].innerHTML = convertTextToHTML(data.message);
        return data.message;
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

