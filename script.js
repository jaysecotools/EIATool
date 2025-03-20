// Initialize the Radar Chart
const ctx = document.getElementById("impact-chart").getContext("2d");
const impactChart = new Chart(ctx, {
    type: "radar",
    data: {
        labels: ["Erosion", "Vegetation Damage", "Water Quality", "Habitat Disruption", "Air Quality"],
        datasets: [{
            label: "Impact Levels",
            data: [0, 0, 0, 0, 0],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        }
    }
});

// Update Slider Values and Recommendations
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        // Update displayed slider value
        const sliderValue = slider.nextElementSibling;
        sliderValue.innerText = slider.value;

        // Update Radar Chart
        updateRadarChart();

        // Update Risk Score and Recommendations
        updateRiskAndRecommendations();
    });
});

// Update Radar Chart Data
function updateRadarChart() {
    const data = [
        parseInt(document.getElementById("erosion").value),
        parseInt(document.getElementById("vegetation").value),
        parseInt(document.getElementById("water-quality").value),
        parseInt(document.getElementById("habitat-disruption").value),
        parseInt(document.getElementById("air-quality").value)
    ];
    impactChart.data.datasets[0].data = data;
    impactChart.update();
}

// Calculate Risk Score and Generate Recommendations
function updateRiskAndRecommendations() {
    const data = [
        parseInt(document.getElementById("erosion").value),
        parseInt(document.getElementById("vegetation").value),
        parseInt(document.getElementById("water-quality").value),
        parseInt(document.getElementById("habitat-disruption").value),
        parseInt(document.getElementById("air-quality").value)
    ];

    // Calculate Risk Score
    const riskScore = Math.round(data.reduce((sum, value) => sum + value, 0) / data.length);
    document.getElementById("risk-score").innerText = riskScore;

    // Determine Risk Level
    const riskLevel = riskScore > 60 ? "High Risk"
                    : riskScore > 30 ? "Moderate Risk"
                    : "Low Risk";
    document.getElementById("risk-level").innerText = riskLevel;

    // Generate Recommendations
    const recommendations = [];
    if (data[0] > 50) recommendations.push("Implement erosion control measures such as sediment traps.");
    if (data[1] > 50) recommendations.push("Revegetate damaged areas with native species.");
    if (data[2] > 50) recommendations.push("Minimize sediment runoff using buffer zones.");
    if (data[3] > 50) recommendations.push("Preserve wildlife habitats and minimize disruptions.");
    if (data[4] > 50) recommendations.push("Reduce emissions and control dust in sensitive areas.");

    document.getElementById("recommendations").innerHTML =
        recommendations.length > 0
            ? `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join("")}</ul>`
            : "No significant risks detected. Monitoring recommended.";
}

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Environmental Impact Assessment Report", 10, 10);
    doc.setFontSize(12);

    // Project Information
    doc.text(`Project Name: ${document.getElementById("project-name").value || "N/A"}`, 10, 20);
    doc.text(`Location: ${document.getElementById("location").value || "N/A"}`, 10, 30);
    doc.text(`Assessor Name: ${document.getElementById("assessor-name").value || "N/A"}`, 10, 40);
    doc.text(`Date of Assessment: ${document.getElementById("date").value || "N/A"}`, 10, 50);

    doc.text(`Project Description: ${document.getElementById("project-description").value || "N/A"}`, 10, 60);
    doc.text(`Project Purpose: ${document.getElementById("project-purpose").value || "N/A"}`, 10, 70);
    doc.text(`Type of Works: ${document.getElementById("type-of-works").value || "N/A"}`, 10, 80);

    // Site Information
    doc.text("Site Information:", 10, 90);
    doc.text(`Flora & Fauna: ${document.getElementById("flora-fauna").value || "N/A"}`, 10, 100);
    doc.text(`Soil Types: ${document.getElementById("soil-types").value || "N/A"}`, 10, 110);
    doc.text(`Waterways: ${document.getElementById("waterways").value || "N/A"}`, 10, 120);
    doc.text(`Biosecurity Measures: ${document.getElementById("biosecurity-plan").value || "N/A"}`, 10, 130);

    // Risk Assessment
    doc.text(`Risk Score: ${document.getElementById("risk-score").innerText}`, 10, 140);
    doc.text(`Risk Level: ${document.getElementById("risk-level").innerText}`, 10, 150);
    doc.text("Recommendations:", 10, 160);
    doc.text(`${document.getElementById("recommendations").innerText || "N/A"}`, 10, 170);

    // Add Radar Chart as Image
    const chartCanvas = document.getElementById("impact-chart");
    const chartImage = chartCanvas.toDataURL("image/png");
    doc.addImage(chartImage, "PNG", 10, 180, 150, 150); // Position and size for the chart

    // Save the PDF
    doc.save("EIA_Report.pdf");
});
