document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('wordCloudModal');
    const closeBtn = document.querySelector('.word-cloud-close');
    const wordCloudButtons = document.querySelectorAll('.word-cloud-btn');

    const plotImages = document.querySelectorAll('.metric-image');
    const plotModal = document.getElementById('plotModal');
    const plotModalImg = document.getElementById('plotModalImg');
    const plotModalClose = document.querySelector('.plot-modal-close');

    const openQuotesBtns = document.querySelectorAll('.open-quotes-btn');
    const quotesModal = document.getElementById('quotesModal');
    const quotesClose = quotesModal.querySelector('.quotes-close');
    const quotesContent = quotesModal.querySelector('.scrollable-content');


    plotImages.forEach(img => {
        img.addEventListener('click', function() {
            plotModal.style.display = 'block';
            plotModalImg.src = this.src;
        });
    });

    plotModalClose.addEventListener('click', function() {
        plotModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == plotModal) {
            plotModal.style.display = 'none';
        }
    });

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
                    paragraph.innerText = 'Powiązane odpowiedzi';
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
                        viewFullResponseBtn.innerText = 'Zobacz całą odpowiedź';
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
    
    function showFullResponseModal(fullResponse, demographics) {
        const fullResponseModal = document.getElementById('fullResponseModal');
        const fullResponseContent = document.querySelector('.full-response-content');
        
        // Create and populate the demographics section
        const demographicsHtml = `
            <div class="demographics-info">
                <h3>Demografia respondenta</h3>
                <p><strong>Wiek:</strong> ${demographics.age}</p>
                <p><strong>Płeć:</strong> ${demographics.gender}</p>
                <p><strong>Poziom wykształcenia:</strong> ${demographics.educationLevel}</p>
                <p><strong>Status rodzicielski:</strong> ${demographics.parentalStatus}</p>
            </div>
        `;
        
        // Create the transcript HTML
        const transcriptHtml = `
            <div class="chat-transcript">
                <h3>Transkrypt chatu</h3>
                ${fullResponse.map(message => `
                    <div class="chat-message ${message.sender.toLowerCase()}">
                        <strong>${message.sender}:</strong> ${message.text}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Set the content of the modal
        fullResponseContent.innerHTML = demographicsHtml + transcriptHtml;
        fullResponseModal.style.display = 'block';
    }
    
    function fetchFullResponse(responseId) {
        fetch('static/fullResponses.json')
            .then(response => response.json())
            .then(data => {
                const fullResponse = data.responses.find(response => response.id === responseId);
                if (fullResponse) {
                    showFullResponseModal(fullResponse.transcript, fullResponse.demographics);
                }
            })
            .catch(error => console.error('Error fetching full response:', error));
        }    
    
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

    openQuotesBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const goalId = this.getAttribute('data-goal');
            fetch('/static/openQuotesContent.json')
                .then(response => response.json())
                .then(data => {
                    const goalData = data[`goal${goalId}`];
                    if (goalData) {
                        let contentHtml = `<h3>${goalData.question}</h3>`;
                        goalData.quotes.forEach(quote => {
                            contentHtml += `
                                <div class="quote-box">
                                    <p>${quote.text}</p>
                                    <button class="view-full-response-btn" data-response-id="${quote.responseId}">Zobacz całą odpowiedź</button>
                                </div>
                            `;
                        });
                        quotesContent.innerHTML = contentHtml;
                        quotesModal.style.display = 'block';

                        // Add event listeners to the new "Zobacz całą odpowiedź" buttons
                        const viewFullResponseBtns = quotesContent.querySelectorAll('.view-full-response-btn');
                        viewFullResponseBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                const responseId = this.getAttribute('data-response-id');
                                fetchFullResponse(responseId);
                            });
                        });
                    }
                })
                .catch(error => console.error('Error fetching quotes:', error));
        });
    });

    quotesClose.addEventListener('click', function() {
        quotesModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == quotesModal) {
            quotesModal.style.display = 'none';
        }
    });

}
);