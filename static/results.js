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
                    const summaryDiv = document.createElement('div');
                    summaryDiv.className = 'word-cloud-summary';
                    summaryDiv.innerText = wordData.summary;
                    const contentBoxContainer = document.querySelector('.scrollable-content');
                    contentBoxContainer.innerHTML = '';
                    contentBoxContainer.appendChild(summaryDiv);
    
                    const paragraph = document.createElement('p');
                    paragraph.innerText = 'Related responses';
                    paragraph.className = 'related-responses-txt';
                    contentBoxContainer.appendChild(paragraph);
    
                    wordData.content.forEach((item) => {
                        const contentBoxWrapper = document.createElement('div');
                        contentBoxWrapper.className = 'content-box-container';
    
                        const contentBox = document.createElement('div');
                        contentBox.className = 'content-box';
                        contentBox.innerText = item.text;
    
                        const viewFullResponseBtn = document.createElement('button');
                        viewFullResponseBtn.className = 'view-full-response-btn';
                        viewFullResponseBtn.innerText = 'View Full Response';
                        viewFullResponseBtn.onclick = function() {
                            fetchFullResponse(item.responseId);
                        };
    
                        contentBoxWrapper.appendChild(contentBox);
                        contentBoxWrapper.appendChild(viewFullResponseBtn);
                        contentBoxContainer.appendChild(contentBoxWrapper);
                    });
                }
            })
            .catch(error => console.error('Error fetching content:', error));
    }
    
    function fetchFullResponse(responseId) {
        fetch('static/fullResponses.json')
            .then(response => response.json())
            .then(data => {
                const fullResponse = data.responses.find(response => response.id === responseId);
                if (fullResponse) {
                    showFullResponseModal(fullResponse.text);
                }
            })
            .catch(error => console.error('Error fetching full response:', error));
    }

    
    function showFullResponseModal(fullResponse) {
        const fullResponseModal = document.getElementById('fullResponseModal');
        const fullResponseContent = document.querySelector('.full-response-content');
        fullResponseContent.innerText = fullResponse;
        fullResponseModal.style.display = 'block';
    }
    
    // Add these event listeners at the end of the DOMContentLoaded function
    const fullResponseModal = document.getElementById('fullResponseModal');
    const fullResponseCloseBtn = document.querySelector('.full-response-close');
    const goBackBtn = document.querySelector('.go-back-btn');
    
    fullResponseCloseBtn.addEventListener('click', function() {
        fullResponseModal.style.display = 'none';
    });
    
    goBackBtn.addEventListener('click', function() {
        fullResponseModal.style.display = 'none';
        modal.style.display = 'block';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target == fullResponseModal) {
            fullResponseModal.style.display = 'none';
        }
    });
}
);