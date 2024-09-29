document.getElementById('send-btn').addEventListener('click', sendMessage);

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const chatBox = document.getElementById('chat-box');

    const message = messageInput.value;
    const file = fileInput.files[0];

    if (!message && !file) return;

    const formData = new FormData();
    formData.append('prompt', message || ''); // Ajouter le texte du message
    formData.append('customId', 'user123'); // Identifiant utilisateur
    if (file) {
        formData.append('link', URL.createObjectURL(file)); // Ajouter l'image
    }

    // Ajouter le message à l'interface
    const userMessage = document.createElement('div');
    userMessage.textContent = message || 'Image sent';
    userMessage.classList.add('user-message');
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll au bas

    // Effacer le champ de message et fichier
    messageInput.value = '';
    fileInput.value = '';

    // Envoyer la requête à l'API Flask Gemini
    fetch('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = document.createElement('div');
        botMessage.textContent = data.message;
        botMessage.classList.add('bot-message');
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll au bas
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error occurred while sending message.';
        errorMessage.classList.add('error-message');
        chatBox.appendChild(errorMessage);
    });
}
