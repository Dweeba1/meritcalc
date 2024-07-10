document.addEventListener('DOMContentLoaded', function() {
    fetch('data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('CSV Data:', data); // Debugging: Log the fetched CSV data
            const titles = parseCSV(data);
            console.log('Parsed Titles:', titles); // Debugging: Log the parsed titles
            populateTitles(titles);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    document.getElementById('meritRating').addEventListener('change', function() {
        const meritRating = this.value;
        updateMeritMessage(meritRating);
    });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const titles = lines.slice(1).map(line => {
        const values = line.split(',');
        let title = {};
        headers.forEach((header, index) => {
            title[header.trim()] = values[index]?.trim();
        });
        return title;
    });
    return titles;
}

function populateTitles(titles) {
    const titleSelect = document.getElementById('title');
    titles.forEach(title => {
        if (title.Title) { // Ensure there is a valid title to add
            const option = document.createElement('option');
            option.value = title.Title;
            option.textContent = title.Title;
            titleSelect.appendChild(option);
        }
    });

    titleSelect.addEventListener('change', function() {
        const selectedTitle = titles.find(title => title.Title === this.value);
        if (selectedTitle) {
            document.getElementById('schedule').textContent = selectedTitle.Schedule;
            document.getElementById('min').textContent = selectedTitle.Min;
            document.getElementById('mid').textContent = selectedTitle.Mid;
            document.getElementById('max').textContent = selectedTitle.Max;
            document.getElementById('bottom').textContent = selectedTitle.Bottom;
            document.getElementById('top').textContent = selectedTitle.Top;
        }
    });
}

function updateMeritMessage(meritRating) {
    let message = '';

    const currentRate = parseFloat(document.getElementById('currentHourlyRate').value.replace('$', ''));
    const newRate = currentRate * 1.0425; // COLA is 4.25%
    const maxRate = parseFloat(document.getElementById('max').textContent);
    const topRate = parseFloat(document.getElementById('top').textContent);
    const estimatedRate = parseFloat(document.getElementById('estimatedRate').textContent);

    switch (meritRating) {
        case 'Needs Improvement':
            message = 'Evaluations with an overall rating of “Needs Improvement” are not eligible for performance-based merit increase.';
            break;
        case 'Meets Performance Objectives':
        case 'Exceeds Performance Objectives':
            if (newRate >= maxRate) {
                message = 'Your hourly rate after COLA has exceeded the Advertised Max of your salary range; therefore, without a rating of “Demonstrating Exceptional Performance,” you are not eligible to receive an OPC merit increase.';
            } else if (estimatedRate > maxRate) {
                message = 'Your hourly rate and merit cannot exceed the Advertised Max of your salary range.';
            }
            break;
        case 'Demonstrates Exceptional Performance':
            if (newRate >= topRate) {
                message = 'Your hourly rate after COLA has exceeded the top of the Exceptional Performance range of your salary range; therefore, you are not eligible to receive an OPC merit increase.';
            } else if (estimatedRate > topRate) {
                message = 'Your hourly rate and merit cannot exceed the top of the Exceptional Performance area of your salary range.';
            }
            break;
        default:
            message = '';
    }

    if (message) {
        const popupWindow = window.open('', '_blank', 'width=400,height=300');
        popupWindow.document.write(`
            <html>
            <head>
                <title>Merit Message</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        text-align: center;
                        padding: 20px;
                    }
                    .message {
                        background-color: #fff;
                        padding: 20px;
                        border: 2px solid #ccc;
                        border-radius: 5px;
                        max-width: 90%;
                        margin: 0 auto;
                    }
                    h2 {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="message">
                    <h2>Merit Message</h2>
                    <p>${message}</p>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `);
    }
}

function calculate() {
    const currentRate = parseFloat(document.getElementById('currentHourlyRate').value.replace('$', ''));
    const meritRating = document.getElementById('meritRating').value;
    const minRate = parseFloat(document.getElementById('min').textContent);
    const maxRate = parseFloat(document.getElementById('max').textContent);
    const bottomRate = parseFloat(document.getElementById('bottom').textContent);
    const topRate = parseFloat(document.getElementById('top').textContent);

    let meritPercentage = 0;
    let newRate = currentRate * 1.0425; // COLA is 4.25%

    switch (meritRating) {
        case 'Meets Performance Objectives':
            meritPercentage = 3;
            break;
        case 'Exceeds Performance Objectives':
            meritPercentage = 6;
            break;
        case 'Demonstrates Exceptional Performance':
            meritPercentage = 9;
            break;
        default:
            meritPercentage = 0;
    }

    let estimatedRate;

    if (meritRating === 'Needs Improvement') {
        estimatedRate = newRate;
    } else if (meritRating === 'Meets Performance Objectives' || meritRating === 'Exceeds Performance Objectives') {
        const meritRate = newRate * (1 + meritPercentage / 100);
        estimatedRate = newRate > maxRate ? newRate : Math.min(meritRate, maxRate);
    } else if (meritRating === 'Demonstrates Exceptional Performance') {
        const meritRate = newRate * (1 + meritPercentage / 100);
        estimatedRate = newRate > topRate ? newRate : Math.min(meritRate, topRate);
    }

    // Calculate actual percentage increase
    const actualPercentageIncrease = ((estimatedRate - newRate) / newRate) * 100;

    document.getElementById('newRate').textContent = newRate.toFixed(2);
    document.getElementById('estimatedRate').textContent = estimatedRate.toFixed(2);
    document.getElementById('actualPercentage').textContent = `${actualPercentageIncrease.toFixed(2)}%`;

    // Remove the merit percentage increase update as per previous request
    // document.getElementById('meritIncrease').textContent = `${meritPercentage}%`;

    // Update the merit message based on the new rate and estimated rate
    updateMeritMessage(meritRating);
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('currentHourlyRate').value = '';
    document.getElementById('meritRating').value = '';
    document.getElementById('schedule').textContent = '';
    document.getElementById('min').textContent = '';
    document.getElementById('mid').textContent = '';
    document.getElementById('max').textContent = '';
    document.getElementById('bottom').textContent = '';
    document.getElementById('top').textContent = '';
    document.getElementById('newRate').textContent = '---';
    document.getElementById('estimatedRate').textContent = '---';
    document.getElementById('actualPercentage').textContent = '---';
    document.getElementById('meritMessage').textContent = '';
}
