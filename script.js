document.addEventListener("DOMContentLoaded", () => {
    loadTitles();
});

let titlesData = [];

function loadTitles() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            titlesData = parseCSV(data);
            populateTitleDropdown(titlesData);
        });
}

function parseCSV(data) {
    const lines = data.split('\n');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');
        if (cells.length > 1) {
            result.push({
                title: cells[0],
                salarySchedule: cells[1],
                minRate: parseFloat(cells[2]),
                midRate: parseFloat(cells[3]),
                maxRate: parseFloat(cells[4]),
                exceptionalMin: parseFloat(cells[5]),
                exceptionalMax: parseFloat(cells[6])
            });
        }
    }
    return result;
}

function populateTitleDropdown(titles) {
    const dropdown = document.getElementById('title');
    titles.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = item.title;
        dropdown.add(option);
    });
}

function generateTable() {
    const dropdown = document.getElementById('title');
    const selectedTitle = titlesData[dropdown.value];

    const tbody = document.getElementById('salary-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = `
        <tr>
            <td>${selectedTitle.salarySchedule}</td>
            <td>${selectedTitle.minRate}</td>
            <td>${selectedTitle.midRate}</td>
            <td>${selectedTitle.maxRate}</td>
            <td>${selectedTitle.exceptionalMin}</td>
            <td>${selectedTitle.exceptionalMax}</td>
        </tr>
    `;
}

function displayMeritMessage() {
    const meritRating = document.getElementById('merit-rating').value;
    const messageDiv = document.getElementById('merit-message');

    let message = "";
    switch (meritRating) {
        case "0":
            message = "Evaluations with an overall rating of “Needs Improvement” are not eligible for performance-based merit increase.";
            break;
        case "3":
            message = "Evaluations with an overall rating of “Meets Performance Objectives” will be eligible for a 3% merit increase.";
            break;
        case "6":
            message = "Evaluations with an overall rating of “Exceeds Performance Objectives” will be eligible for a 6% merit increase.";
            break;
        case "9":
            message = "Evaluations with an overall rating of “Demonstrates Exceptional Performance” will be eligible for a 9% merit increase.";
            break;
        default:
            message = "";
            break;
    }

    messageDiv.innerHTML = message;
}

function calculateMeritIncrease() {
    const currentRate = parseFloat(document.getElementById('current-rate').value);
    const meritRating = parseInt(document.getElementById('merit-rating').value);
    const colaIncrease = currentRate * 0.02; // Assuming a 2% COLA increase
    const meritPercentage = meritRating / 100;
    const meritIncrease = currentRate * meritPercentage;
    const estimatedRate = currentRate + colaIncrease + meritIncrease;

    document.getElementById('cola-increase').innerText = `$${(currentRate + colaIncrease).toFixed(2)}`;
    document.getElementById('merit-increase').innerText = `${meritRating}%`;
    document.getElementById('estimated-rate').innerText = `$${estimatedRate.toFixed(2)}`;
}

function clearForm() {
    document.getElementById('title').value = "";
    document.getElementById('current-rate').value = "";
    document.getElementById('merit-rating').value = "";
    document.getElementById('merit-message').innerHTML = "";
    document.getElementById('salary-table').getElementsByTagName('tbody')[0].innerHTML = "";
    document.getElementById('cola-increase').innerText = "";
    document.getElementById('merit-increase').innerText = "";
    document.getElementById('estimated-rate').innerText = "";
}
