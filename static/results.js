document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('wordCloudModal');
    const closeBtn = document.querySelector('.word-cloud-close');
    const wordCloudButtons = document.querySelectorAll('.word-cloud-btn');

    wordCloudButtons.forEach(button => {
        button.addEventListener('click', function() {
            const word = this.getAttribute('data-word');
            fetchContent(word);
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function fetchContent(word) {
        fetch('static/wordCloudContent.json')
            .then(response => response.json())
            .then(data => {
                const wordData = data[word];
                if (wordData) {
                    document.querySelector('.word-cloud-modal-content h2').innerText = wordData.title;
                    document.querySelector('.word-cloud-modal-content p').innerText = wordData.summary;
                    const contentBoxContainer = document.querySelector('.scrollable-content');
                    contentBoxContainer.innerHTML = '';
                    wordData.content.forEach(text => {
                        const contentBox = document.createElement('div');
                        contentBox.className = 'content-box';
                        contentBox.innerText = text;
                        contentBoxContainer.appendChild(contentBox);
                    });
                }
            })
            .catch(error => console.error('Error fetching content:', error));
    }
});