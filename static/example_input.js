let currentButton = null;
let isEditing = false;
let currentMetricBox = null;

function addField() {
    const formSection = document.getElementById('form-section');
    const newField = document.createElement('div');
    newField.className = 'form-group mb-4 bg-gray-200 rounded p-4';
    newField.innerHTML = `
        <div class="form-group-title flex items-center mb-2">
            <h5 class="flex-1 m-0">New goal</h5>
            <button class="btn btn-secondary bg-blue-500 text-white px-2 py-1 ml-2 rounded" onclick="editTitle(this)">edytuj nazwę</button>
            <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2 rounded" onclick="removeField(this)">usuń</button>
        </div>
        <label class="goal-label text-left">Goal description</label>
        <textarea class="form-control w-full h-20 text-base" placeholder="Cel badania"></textarea>
        <label class="metrics-label text-left mt-4">Miary</label>
        <div class="metric-titles"></div>
        <button class="btn btn-secondary mt-2 bg-green-500 text-white px-4 py-2 text-left rounded" onclick="openMetricModal(this)">Dodaj miarę</button>`;
    formSection.insertBefore(newField, formSection.lastElementChild);
}

function editTitle(button) {
    const titleElement = button.previousElementSibling;
    const currentTitle = titleElement.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.className = 'flex-1 m-0';
    input.onblur = function() {
        titleElement.innerText = input.value;
        titleElement.style.display = 'block';
        input.remove();
    };
    input.onkeydown = function(event) {
        if (event.key === 'Enter') {
            input.blur();
        }
    };
    titleElement.style.display = 'none';
    titleElement.parentNode.insertBefore(input, titleElement);
    input.focus();
}

function removeField(button) {
    const formGroup = button.closest('.form-group');
    formGroup.remove();
}

function openMetricModal(button) {
    currentButton = button;
    isEditing = false;
    document.getElementById('metricModal').style.display = "block";

    // Clear previous values
    document.querySelectorAll('input[name="metricOption"]').forEach(radio => radio.checked = false);
    document.getElementById('metricInput1').value = '';
    document.getElementById('metricInput2').value = '';
    document.getElementById('metricTitle').value = '';

    // Hide all dynamic content sections
    document.querySelectorAll('.dynamic-content').forEach(section => section.style.display = 'none');
}

function closeMetricModal() {
    document.getElementById('metricModal').style.display = "none";
    isEditing = false;
    currentMetricBox = null;
}

function saveMetric() {
    const selectedOption = document.querySelector('input[name="metricOption"]:checked');
    const metricTitle = document.getElementById('metricTitle').value.trim();

    const visibleSection = document.querySelector('.dynamic-content[style*="display: block"]');
    if (!visibleSection) {
        console.error("No visible section found");
        return;
    }
    const metricInput1 = visibleSection.querySelector('#metricInput1') ? visibleSection.querySelector('#metricInput1').value : '';
    const metricInput2 = visibleSection.querySelector('#metricInput2') ? visibleSection.querySelector('#metricInput2').value : '';

    const visibleInputs = Array.from(document.querySelectorAll('.dynamic-content'))
        .filter(section => section.style.display !== 'none')
        .flatMap(section => Array.from(section.querySelectorAll('input')));

    const allInputsFilled = visibleInputs.every(input => input.value.trim() !== '');

    if (selectedOption && allInputsFilled && metricTitle !== "") {
        const formGroup = currentButton.closest('.form-group');
        let metricTitlesContainer = formGroup.querySelector('.metric-titles');

        if (!metricTitlesContainer) {
            metricTitlesContainer = document.createElement('div');
            metricTitlesContainer.className = 'metric-titles';
            formGroup.appendChild(metricTitlesContainer);
        }

        if (isEditing && currentMetricBox) {
            const metricTitleElement = currentMetricBox.previousElementSibling;
            metricTitleElement.querySelector('span').innerText = metricTitle;
        } else {
            const metricId = `metric-${Date.now()}`;
            const metricTitleElement = document.createElement('div');
            metricTitleElement.className = 'metric-title flex items-center justify-between mt-2';
            metricTitleElement.innerHTML = `
                <span class="flex-1 metric-title">${metricTitle}</span>
                <button class="btn btn-secondary bg-yellow-500 text-white px-2 py-1 ml-2 rounded" onclick="editMetricTitle(this, '${metricId}')">edytuj</button>
                <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2 rounded" onclick="removeMetricTitle(this)">usuń</button>`;

            const metricBox = document.createElement('div');
            metricBox.className = 'metric-box';
            metricBox.id = metricId;
            metricBox.style.display = 'none'; // Hide the metric box content

            metricTitlesContainer.appendChild(metricTitleElement);
            metricTitlesContainer.appendChild(metricBox);
        }
    } else {
        console.log("Validation failed");
    }
    closeMetricModal();
}

function editMetricTitle(button, metricId) {
    const metricTitleElement = button.previousElementSibling;
    const currentTitle = metricTitleElement.innerText;
    const metricBox = document.getElementById(metricId);

    document.getElementById('metricTitle').value = currentTitle;

    if (metricBox) {
        const metricText = metricBox.querySelector('span') ? metricBox.querySelector('span').innerText : '';
        if (metricText) {
            const [option, values] = metricText.split(': ');
            const [value1, value2] = values.split(', ');

            document.querySelector(`input[name="metricOption"][value="${option}"]`).checked = true;
            document.getElementById('metricInput1').value = value1;
            document.getElementById('metricInput2').value = value2;
        }
    }

    currentButton = button;
    isEditing = true;
    currentMetricBox = metricBox;
    document.getElementById('metricModal').style.display = "block";
}

function removeMetricTitle(button) {
    const metricTitleElement = button.closest('.metric-title');
    const metricBox = metricTitleElement.nextElementSibling;
    metricTitleElement.remove();
    if (metricBox && metricBox.classList.contains('metric-box')) {
        metricBox.remove();
    }
}

function editMetric(button) {
    const metricBox = button.closest('.metric-box');
    const metricText = metricBox.querySelector('span').innerText;
    const [option, values] = metricText.split(': ');
    const [value1, value2] = values.split(', ');

    document.querySelector(`input[name="metricOption"][value="${option}"]`).checked = true;
    document.getElementById('metricInput1').value = value1;
    document.getElementById('metricInput2').value = value2;

    const metricTitleElement = metricBox.previousElementSibling;
    document.getElementById('metricTitle').value = metricTitleElement.querySelector('span').innerText; // Set the title input value

    currentButton = metricBox.previousElementSibling; // Set to the "Add Metric" button
    isEditing = true;
    currentMetricBox = metricBox;
    document.getElementById('metricModal').style.display = "block";
}

function removeMetric(button) {
    const metricBox = button.closest('.metric-box');
    metricBox.remove();
}

document.querySelectorAll('input[name="metricOption"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Hide all dynamic content sections
        document.querySelectorAll('.dynamic-content').forEach(section => section.style.display = 'none');

        // Show the relevant section based on the selected radio button
        const selectedOption = document.querySelector('input[name="metricOption"]:checked').value;
        const dynamicSection = document.getElementById(`dynamic-${selectedOption}`);
        if (dynamicSection) {
            dynamicSection.style.display = 'block';
        }
    });
});



document.addEventListener('DOMContentLoaded', function () {

    // IMPORTANT
    populateExampleData();

    const ageRangeSlider = document.getElementById('ageRangeSlider');
    noUiSlider.create(ageRangeSlider, {
        start: [20, 70],
        connect: true,
        range: {
            'min': 0,
            'max': 100
        }
    });

    const ageRangeDisplay = document.getElementById('ageRangeDisplay');
    ageRangeSlider.noUiSlider.on('update', function (values, handle) {
        ageRangeDisplay.innerText = `${Math.round(values[0])} - ${Math.round(values[1])}`;
    });
});


// Demographic data
function populateExampleData() {
    // Populate demographic parameters
    document.getElementById('numberInput').value = 300;
    document.getElementById('checkbox1').checked = true; // Men
    document.getElementById('checkbox2').checked = true; // Women
    document.querySelectorAll('input[type="checkbox"]')[0].checked = true; // Secondary education
    document.querySelectorAll('input[type="checkbox"]')[1].checked = true; // Secondary education
    document.querySelectorAll('input[type="checkbox"]')[2].checked = true; // Respondents with children
    document.querySelectorAll('input[type="checkbox"]')[3].checked = true; // Respondents with children
    document.querySelectorAll('input[type="checkbox"]')[4].checked = true; // Respondents with children
    document.querySelectorAll('input[type="checkbox"]')[5].checked = true; // Respondents with children
    document.querySelectorAll('input[type="checkbox"]')[6].checked = true; // Respondents with children
    document.getElementById('textarea').value = "Bądź uprzejmy i zwięzły. Unikaj zbyt technicznych określeń. Staraj się unikać zbaczania konwersacji na tematy nie związane z badaniem. W razie potrzeby, dopytuj się o doprecyzowanie odpowiedzi tak, aby otrzymać informacje potrzebne do wypełnienia pomiarów.";

    // Populate goals and metrics
    const formSection = document.getElementById('form-section');
    
    // Clear existing goals
    while (formSection.firstChild) {
        formSection.removeChild(formSection.firstChild);
    }

    // Add example goals with metrics
    addExampleGoal("Customer Satisfaction", "Measure overall customer satisfaction with our product", [
        { title: "Overall Satisfaction", type: "likert" },
        { title: "Ease of Use", type: "likert" },
        { title: "Value for Money", type: "option2" }
    ]);

    addExampleGoal("Product Features", "Evaluate the usefulness of new product features", [
        { title: "Feature A Usefulness", type: "likert" },
        { title: "Feature B Usefulness", type: "likert" },
        { title: "Open Feedback", type: "option3" }
    ]);

    // Set age range
    const ageRangeSlider = document.getElementById('ageRangeSlider').noUiSlider;
    ageRangeSlider.set([25, 45]);
}




// Goals for the example results
function addExampleGoal(title, description, metrics) {
    const newField = document.createElement('div');
    newField.className = 'form-group mb-4 bg-gray-200 rounded p-4';
    newField.innerHTML = `
        <div class="form-group-title flex items-center mb-2">
            <h5 class="flex-1 m-0">${title}</h5>
        </div>
        <label class="goal-label text-left">Goal description</label>
        <textarea class="form-control w-full h-20 text-base" readonly>${description}</textarea>
        <label class="metrics-label text-left mt-4">Miary</label>
        <div class="metric-titles"></div>`;
    
    const formSection = document.getElementById('form-section');
    formSection.appendChild(newField);

    const metricTitlesContainer = newField.querySelector('.metric-titles');
    metrics.forEach(metric => {
        const metricTitleElement = document.createElement('div');
        metricTitleElement.className = 'metric-title flex items-center justify-between mt-2';
        metricTitleElement.innerHTML = `
            <span class="flex-1 metric-title">${metric.title}</span>
            <button class="btn btn-view bg-blue-500 text-white px-2 py-1 ml-2 rounded" onclick="viewMeasure('${title}', '${metric.title}')">zobacz</button>`;
        metricTitlesContainer.appendChild(metricTitleElement);
    });
}

function viewMeasure(goalTitle, measureTitle) {
    let measure;

    switch(goalTitle) {
        case 'Customer Satisfaction':
            measure = {
                'Overall Satisfaction': {
                    type: 'likert',
                    labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
                    value: 4 // Example pre-filled value
                },
                'Ease of Use': {
                    type: 'option2',
                    range: [1, 10],
                    value: 7 // Example pre-filled value
                },
                'Value for Money': {
                    type: 'option2',
                    range: [1, 10],
                    value: 8 // Example pre-filled value
                },
                'Open Feedback': {
                    type: 'option3',
                    question: 'What additional features would you like to see in our product?',
                    value: 'I would like to see better integration with other tools.' // Example pre-filled value
                }
            }[measureTitle];
            break;
        case 'Product Features':
            measure = {
                'Feature A Usefulness': {
                    type: 'likert',
                    labels: ['Not Useful', 'Slightly Useful', 'Moderately Useful', 'Very Useful', 'Extremely Useful'],
                    value: 4 // Example pre-filled value
                },
                'Feature B Usefulness': {
                    type: 'likert',
                    labels: ['Not Useful', 'Slightly Useful', 'Moderately Useful', 'Very Useful', 'Extremely Useful'],
                    value: 3 // Example pre-filled value
                },
                'Open Feedback': {
                    type: 'option3',
                    question: 'What additional features would you like to see in our product?',
                    value: 'I would like to see more customization options.' // Example pre-filled value
                }
            }[measureTitle];
            break;
        default:
            console.error('Unknown goal or measure');
            return;
    }

    if (measure) {
        displayMeasure(measureTitle, measure);
    }
}


function viewGoal(button) {
    const goalTitle = button.closest('.form-group-title').querySelector('h5').innerText;
    let measures;

    switch(goalTitle) {
        case 'Customer Satisfaction':
            measures = [
                {
                    title: 'Overall Satisfaction',
                    type: 'likert',
                    labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                },
                {
                    title: 'Ease of Use',
                    type: 'likert',
                    labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                },
                {
                    title: 'Value for Money',
                    type: 'option2',
                    range: [1, 10]
                }
            ];
            break;
        case 'Product Features':
            measures = [
                {
                    title: 'Feature A Usefulness',
                    type: 'likert',
                    labels: ['Not Useful', 'Slightly Useful', 'Moderately Useful', 'Very Useful', 'Extremely Useful']
                },
                {
                    title: 'Feature B Usefulness',
                    type: 'likert',
                    labels: ['Not Useful', 'Slightly Useful', 'Moderately Useful', 'Very Useful', 'Extremely Useful']
                },
                {
                    title: 'Open Feedback',
                    type: 'option3',
                    question: 'What additional features would you like to see in our product?'
                }
            ];
            break;
        default:
            console.error('Unknown goal');
            return;
    }

    displayMeasures(measures, goalTitle);
}

function displayMeasure(title, measure) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    modalContent.appendChild(titleElement);

    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeMetricModal;
    modalContent.appendChild(closeButton);

    const measureElement = document.createElement('div');
    measureElement.className = 'measure-item';

    switch(measure.type) {
        case 'likert':
            const likertScale = document.createElement('div');
            likertScale.className = 'likert-scale';
            measure.labels.forEach((label, index) => {
                const option = document.createElement('label');
                option.innerHTML = `
                    <input type="radio" name="${title}" value="${index + 1}" ${index + 1 === measure.value ? 'checked' : ''} disabled>
                    <span>${label}</span>
                `;
                likertScale.appendChild(option);
            });
            measureElement.appendChild(likertScale);
            break;
        case 'option2':
            const rangeInputs = document.createElement('div');
            rangeInputs.className = 'range-inputs';
            rangeInputs.innerHTML = `
                <label>Left boundary:</label>
                <input type="number" value="${measure.range[0]}" readonly class="form-control mt-2">
                <label>Right boundary:</label>
                <input type="number" value="${measure.range[1]}" readonly class="form-control mt-2">
                <label>Selected value:</label>
                <input type="number" value="${measure.value}" readonly class="form-control mt-2">
            `;
            measureElement.appendChild(rangeInputs);
            break;
        case 'option3':
            const questionLabel = document.createElement('label');
            questionLabel.textContent = measure.question;
            measureElement.appendChild(questionLabel);

            const textarea = document.createElement('textarea');
            textarea.value = measure.value;
            textarea.className = 'open-feedback';
            textarea.readOnly = true;
            measureElement.appendChild(textarea);
            break;
    }

    modalContent.appendChild(measureElement);
    document.getElementById('metricModal').style.display = 'block';
}

function displayMeasures(measures, goalTitle) {
    // Clear previous content in the modal
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';

    // Add goal title
    const titleElement = document.createElement('h2');
    titleElement.textContent = goalTitle;
    modalContent.appendChild(titleElement);

    // Add close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeMetricModal;
    modalContent.appendChild(closeButton);

    // Display each measure
    measures.forEach(measure => {
        const measureElement = document.createElement('div');
        measureElement.className = 'measure-item';

        const measureTitle = document.createElement('h3');
        measureTitle.textContent = measure.title;
        measureElement.appendChild(measureTitle);

        switch(measure.type) {
            case 'likert':
                const likertScale = document.createElement('div');
                likertScale.className = 'likert-scale';
                measure.labels.forEach((label, index) => {
                    const option = document.createElement('label');
                    option.innerHTML = `
                        <input type="radio" name="${measure.title}" value="${index + 1}">
                        <span>${label}</span>
                    `;
                    likertScale.appendChild(option);
                });
                measureElement.appendChild(likertScale);
                break;
            case 'option2':
                const rangeInput = document.createElement('input');
                rangeInput.type = 'range';
                rangeInput.min = measure.range[0];
                rangeInput.max = measure.range[1];
                rangeInput.className = 'range-input';
                measureElement.appendChild(rangeInput);
                break;
            case 'option3':
                const textarea = document.createElement('textarea');
                textarea.placeholder = measure.question;
                textarea.className = 'open-feedback';
                measureElement.appendChild(textarea);
                break;
        }

        modalContent.appendChild(measureElement);
    });

    // Show the modal
    document.getElementById('metricModal').style.display = 'block';
}

function closeMetricModal() {
    document.getElementById('metricModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    addExampleGoal('Customer Satisfaction', 'Measure overall customer satisfaction with our product', [
        {title: 'Overall Satisfaction'},
        {title: 'Ease of Use'},
        {title: 'Open Feedback'}
    ]);
});