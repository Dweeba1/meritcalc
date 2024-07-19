function calculate() {
    const currentRate = parseFloat(document.getElementById('currentHourlyRate').value.replace('$', ''));
    const meritRating = document.getElementById('meritRating').value;
    const minRate = parseFloat(document.getElementById('min').textContent);
    const maxRate = parseFloat(document.getElementById('max').textContent);
    const bottomRate = parseFloat(document.getElementById('bottom').textContent);
    const topRate = parseFloat(document.getElementById('top').textContent);

    let meritPercentage = 0;

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
    let newRate = currentRate * 1.0425; // Apply COLA of 4.25%

    if (meritRating === 'Needs Improvement') {
        estimatedRate = newRate;
    } else if (meritRating === 'Meets Performance Objectives' || meritRating === 'Exceeds Performance Objectives') {
        // Calculate estimated rate with merit percentage applied
        const meritRate = newRate * (1 + meritPercentage / 100);
        estimatedRate = newRate > maxRate ? newRate : Math.min(meritRate, maxRate);
    } else if (meritRating === 'Demonstrates Exceptional Performance') {
        // Calculate estimated rate with merit percentage applied
        const meritRate = newRate * (1 + meritPercentage / 100);
        estimatedRate = newRate > topRate ? newRate : Math.min(meritRate, topRate);
    }

    // Calculate actual percentage increase
    const actualPercentageIncrease = ((estimatedRate - newRate) / newRate) * 100;

    document.getElementById('newRate').textContent = newRate.toFixed(2);
    document.getElementById('estimatedRate').textContent = estimatedRate.toFixed(2);
    document.getElementById('actualPercentage').textContent = `${actualPercentageIncrease.toFixed(2)}%`;

    // Show the conditional message
    let conditionalMessage = '';
    if (meritRating === 'Needs Improvement') {
        conditionalMessage = 'Evaluations with an overall rating of “Needs Improvement” are not eligible for performance-based merit increase.';
    } else if ((meritRating === 'Meets Performance Objectives' || meritRating === 'Exceeds Performance Objectives') && currentRate >= maxRate) {
        conditionalMessage = 'Your current hourly rate has exceeded the Advertised Max of your salary range; therefore, without a rating of “Demonstrating Exceptional Performance,” you are not eligible to receive an OPC merit increase.';
    } else if ((meritRating === 'Meets Performance Objectives' || meritRating === 'Exceeds Performance Objectives') && newRate < maxRate && estimatedRate >= maxRate) {
        conditionalMessage = 'Your hourly rate and merit cannot exceed the Advertised Max of your salary range.';
    } else if (meritRating === 'Demonstrates Exceptional Performance' && currentRate >= topRate) {
        conditionalMessage = 'Your current hourly rate has exceeded the top of the Exceptional Performance range of your salary range; therefore, you are not eligible to receive an OPC merit increase.';
    } else if (meritRating === 'Demonstrates Exceptional Performance' && newRate < topRate && estimatedRate >= topRate) {
        conditionalMessage = 'Your hourly rate and merit cannot exceed the top of the Exceptional Performance area of your salary range.';
    }

    if (conditionalMessage) {
        showConditionalMessage(conditionalMessage);
    }

    // Update the merit message based on the merit rating
    updateMeritMessage(meritRating);
}
