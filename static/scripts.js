let currentButton = null;
let isEditing = false;
let currentMetricBox = null;

function addField() {
    const formSection = document.getElementById('form-section');
    const newField = document.createElement('div');
    newField.className = 'form-group mb-4 bg-gray-200 rounded p-4';
    newField.innerHTML = `
        <div class="form-group-title flex items-center mb-2">
            <h5 class="flex-1 m-0">Title</h5>
            <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2" onclick="removeField(this)">delete</button>
        </div>
        <textarea class="form-control w-full h-20 text-base" placeholder="Enter value"></textarea>
        <button class="btn btn-secondary mt-2 bg-green-500 text-white px-4 py-2 text-left" onclick="openMetricModal(this)">Add Metric</button>`;
    formSection.insertBefore(newField, formSection.lastElementChild);
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
}

function closeMetricModal() {
    document.getElementById('metricModal').style.display = "none";
    isEditing = false;
    currentMetricBox = null;
}

function saveMetric() {
    const selectedOption = document.querySelector('input[name="metricOption"]:checked');
    const metricInput1 = document.getElementById('metricInput1').value;
    const metricInput2 = document.getElementById('metricInput2').value;

    if (selectedOption && metricInput1.trim() !== "" && metricInput2.trim() !== "") {
        const formGroup = currentButton.closest('.form-group');
        const metricBox = document.createElement('div');
        metricBox.className = 'metric-box flex items-center justify-start bg-gray-100 p-2 mt-2';
        metricBox.innerHTML = `
            <span class="flex-1">${selectedOption.value}: ${metricInput1}, ${metricInput2}</span>
            <button class="btn btn-secondary bg-yellow-500 text-white px-2 py-1 ml-2" onclick="editMetric(this)">edit</button>
            <button class="btn btn-danger bg-red-500 text-white px-2 py-1 ml-2" onclick="removeMetric(this)">delete metric</button>`;

        if (isEditing && currentMetricBox) {
            formGroup.replaceChild(metricBox, currentMetricBox);
        } else {
            formGroup.insertBefore(metricBox, currentButton);
        }
    }
    closeMetricModal();
}

function editMetric(button) {
    const metricBox = button.closest('.metric-box');
    const metricText = metricBox.querySelector('span').innerText;
    const [option, values] = metricText.split(': ');
    const [value1, value2] = values.split(', ');

    document.querySelector(`input[name="metricOption"][value="${option}"]`).checked = true;
    document.getElementById('metricInput1').value = value1;
    document.getElementById('metricInput2').value = value2;

    currentButton = metricBox.previousElementSibling; // Set to the "Add Metric" button
    isEditing = true;
    currentMetricBox = metricBox;
    document.getElementById('metricModal').style.display = "block";
}

function removeMetric(button) {
    const metricBox = button.closest('.metric-box');
    metricBox.remove();
}