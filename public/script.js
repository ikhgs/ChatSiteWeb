document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chat-form');
    const inputField = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const chatBox = document.getElementById('chat-box');
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const message = inputField.value;
        const file = fileInput.files[0];
        
        // Vérifie si le message ou le fichier est vide
        if (!message && !file) {
            alert('Veuillez entrer un message ou sélectionner un fichier.');
            return;
        }
        
        // Affiche le message de l'utilisateur dans la boîte de discussion
        const userMessage = document.createElement('div');
        userMessage.textContent = message ? message : 'Fichier envoyé';
        userMessage.classList.add('user-message');
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Réinitialise l'entrée du message
        inputField.value = '';

        // Prépare les données pour la requête
        const formData = {
            prompt: message || '',  // Si message est vide, envoie une chaîne vide
            customId: 'user123',    // Custom ID, peut être dynamique
            link: file ? URL.createObjectURL(file) : ''  // Génère un lien si un fichier est présent
        };

        // Effectue la requête vers l'API Gemini
        fetch('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Affiche la réponse du bot dans la boîte de discussion
            const botMessage = document.createElement('div');
            botMessage.textContent = data.message;
            botMessage.classList.add('bot-message');
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;  // Scrolle vers le bas de la boîte
        })
        .catch(error => {
            console.error('Error details:', error);

            // Affiche un message d'erreur dans la boîte de discussion
            const errorMessage = document.createElement('div');
            errorMessage.textContent = `Error occurred while sending message: ${error.message}`;
            errorMessage.classList.add('error-message');
            chatBox.appendChild(errorMessage);
        });
    });
});
