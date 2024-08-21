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
            <button class="btn btn-secondary bg-blue-500 text-white px-2 py-1 ml-2" onclick="editTitle(this)">edit name</button>
            <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2" onclick="removeField(this)">delete</button>
        </div>
        <label class="goal-label text-left">Goal description</label>
        <textarea class="form-control w-full h-20 text-base" placeholder="Goal of the research"></textarea>
        <label class="metrics-label text-left mt-4">Metrics</label>
        <div class="metric-titles"></div>
        <button class="btn btn-secondary mt-2 bg-green-500 text-white px-4 py-2 text-left rounded" onclick="openMetricModal(this)">Add Metric</button>`;
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
                <button class="btn btn-secondary bg-yellow-500 text-white px-2 py-1 ml-2 rounded" onclick="editMetricTitle(this, '${metricId}')">edit</button>
                <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2 rounded" onclick="removeMetricTitle(this)">delete</button>`;

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
    const ageRangeSlider = document.getElementById('ageRangeSlider');
    noUiSlider.create(ageRangeSlider, {
        start: [20, 50],
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