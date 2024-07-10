<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Merit Calculator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="calculator">
        <div class="header">
            <img src="logo.png" alt="Logo" class="logo">
            <h1>Manager Merit Calculator</h1>
        </div>
        <div class="form-group">
            <label for="title">Select Title</label>
            <select id="title">
                <option value="">Select One</option>
            </select>
        </div>
        <div class="form-group">
            <label for="currentHourlyRate">Current Hourly Rate</label>
            <input type="text" id="currentHourlyRate" placeholder="$xx.xx">
        </div>
        <div class="form-group">
            <label for="meritRating">Merit Rating</label>
            <select id="meritRating">
                <option value="">Select One</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Meets Performance Objectives">Meets Performance Objectives</option>
                <option value="Exceeds Performance Objectives">Exceeds Performance Objectives</option>
                <option value="Demonstrates Exceptional Performance">Demonstrates Exceptional Performance</option>
            </select>
        </div>
        <div class="merit-message" id="meritMessage"></div>
        <div class="form-group buttons">
            <button onclick="calculate()">Calculate</button>
            <button onclick="clearForm()">Clear Form</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th colspan="4"></th>
                    <th colspan="2" class="exceptional-performance">Reserved for Exceptional Performance</th>
                </tr>
                <tr>
                    <th>Salary Schedule</th>
                    <th>Min</th>
                    <th>Mid</th>
                    <th>Advertised Max</th>
                    <th class="grey-header">Bottom</th>
                    <th class="grey-header">Top</th>
                </tr>
            </thead>
            <tbody id="salaryTable">
                <tr>
                    <td id="schedule"></td>
                    <td id="min"></td>
                    <td id="mid"></td>
                    <td id="max"></td>
                    <td id="bottom"></td>
                    <td id="top"></td>
                </tr>
            </tbody>
        </table>
        <div id="results">
            <p><strong>Updated Salary Information:</strong></p>
            <div class="results-content">
                <p>Hourly Rate after Negotiated Increase is Applied: <span id="newRate"><b>---</b></span></p>
                <p>Actual Percentage Increase: <span id="actualPercentage"><b>---</b></span></p>                <p>Estimated Hourly Rate (effective 6/28/24): <span id="estimatedRate"><b>---</b></span></p>

            </div>
        </div>
        <div class="disclaimer">
            <p><strong>Disclaimer:</strong> These calculations are not official and should be used as estimates only. You will receive a memo from Human Resources Services with your approved new hourly rate following completion of your evaluation.</p>
        </div>
        <div class="logo-footer-wrapper">
            <img src="logo2.png" alt="Footer Logo" class="logo-footer">
        </div>
    </div>

    <!-- Modal structure -->
    <div id="meritMessageModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div id="meritMessageContent"></div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
