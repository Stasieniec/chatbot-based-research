function viewMetric(type) {
    const metricContent = document.getElementById('metricContent');
    metricContent.innerHTML = '';

    if (type === 'likert') {
        metricContent.innerHTML = `
            <label>Oznacznia dla stopni skali Likerta:</label>
            <div class="likert-labels">
                <div class="likert-label-item">
                    <label>Bardzo negatywne:</label>
                    <input type="text" class="form-control mt-2" value="Bardzo źle" readonly>
                </div>
                <div class="likert-label-item">
                    <label>Negatywne:</label>
                    <input type="text" class="form-control mt-2" value="Źle" readonly>
                </div>
                <div class="likert-label-item">
                    <label>Neutralne:</label>
                    <input type="text" class="form-control mt-2" value="Neutralnie" readonly>
                </div>
                <div class="likert-label-item">
                    <label>Pozytywne:</label>
                    <input type="text" class="form-control mt-2" value="Dobrze" readonly>
                </div>
                <div class="likert-label-item">
                    <label>Bardzo pozytywne:</label>
                    <input type="text" class="form-control mt-2" value="Bardzo dobrze" readonly>
                </div>
            </div>`;
    } else if (type === 'numeric') {
        metricContent.innerHTML = `
            <input type="number" class="form-control mt-2" value="10" readonly>
            <input type="number" class="form-control mt-2" value="100" readonly>`;
    } else if (type === 'open') {
        metricContent.innerHTML = `
            <input type="text" class="form-control mt-2" value="What is your opinion on the subject?" readonly>`;
    }

    document.getElementById('metricModal').style.display = "block";
}

function closeMetricModal() {
    document.getElementById('metricModal').style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    const ageRangeSlider = document.getElementById('ageRangeSlider');
    noUiSlider.create(ageRangeSlider, {
        start: [30, 60],
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