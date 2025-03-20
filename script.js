// Update Slider Values and Risk Calculations
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        const sliderValue = slider.nextElementSibling;
        sliderValue.innerText = slider.value; // Update displayed slider value
        updateRiskScore(); // Recalculate risk score dynamically
        updateRecommendations(); // Generate recommendations dynamically
    });
});

// Dynamic Risk Calculations
function updateRiskScore() {
    // Define weights for each slider (total must equal 1)
    const weights = {
        erosion: 0.3,
        vegetation: 0.25,
        waterQuality: 0.2,
        habitatDisruption: 0.15,
        airQuality: 0.1,
    };

    // Calculate weighted risk score
    const erosionValue = parseInt(document.getElementById("erosion").value) * weights.erosion;
    const vegetationValue = parseInt(document.getElementById("vegetation").value) * weights.vegetation;
    const waterQualityValue = parseInt(document.getElementById("water-quality").value) * weights.waterQuality;
    const habitatDisruptionValue = parseInt(document.getElementById("habitat-disruption").value) * weights.habitatDisruption;
    const airQualityValue = parseInt(document.getElementById("air-quality").value) * weights.airQuality;

    const totalRiskScore = Math.round(
        erosionValue + vegetationValue + waterQualityValue + habitatDisruptionValue + airQualityValue
    );

    // Display the score
    const riskScoreElement = document.getElementById("risk-score");
    riskScoreElement.innerText = totalRiskScore;

    // Update Risk Level Based on Score
    const riskLevelElement = document.getElementById("risk-level");
    if (totalRiskScore <= 30) {
        riskLevelElement.innerText = "Low Risk";
        riskLevelElement.style.color = "green";
    } else if (totalRiskScore <= 60) {
        riskLevelElement.innerText = "Moderate Risk";
        riskLevelElement.style.color = "orange";
    } else {
        riskLevelElement.innerText = "High Risk";
        riskLevelElement.style.color = "red";
    }
}
// Radar Chart Initialization
function initializeRadarChart() {
    const ctx = document.getElementById("impact-chart").getContext("2d");
    const chartData = {
        labels: ["Erosion", "Vegetation", "Water Quality", "Habitat Disruption", "Air Quality"],
        datasets: [
            {
                label: "Impact Levels",
                data: [
                    parseInt(document.getElementById("erosion").value),
                    parseInt(document.getElementById("vegetation").value),
                    parseInt(document.getElementById("water-quality").value),
                    parseInt(document.getElementById("habitat-disruption").value),
                    parseInt(document.getElementById("air-quality").value),
                ],
                backgroundColor: "rgba(44, 110, 73, 0.2)",
                borderColor: "rgba(44, 110, 73, 1)",
                borderWidth: 2,
            },
        ],
    };
    const radarChartConfig = {
        type: "radar",
        data: chartData,
        options: {
            responsive: true,
            scales: {
                r: {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            },
        },
    };

    if (window.radarChart) {
        window.radarChart.destroy(); // Destroy the previous chart
    }
    window.radarChart = new Chart(ctx, radarChartConfig);
}

// Update the Radar Chart dynamically
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        initializeRadarChart(); // Update chart data on slider change
    });
});

// Initialize the Radar Chart on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeRadarChart();
});
// Dynamic Recommendations Based on Scores
function updateRecommendations() {
    const recommendations = [];
    if (parseInt(document.getElementById("erosion").value) > 50) {
        recommendations.push("Implement erosion control measures such as sediment traps.");
    }
    if (parseInt(document.getElementById("vegetation").value) > 50) {
        recommendations.push("Revegetate damaged areas with native species.");
    }
    if (parseInt(document.getElementById("water-quality").value) > 50) {
        recommendations.push("Minimize sediment runoff using buffer zones.");
    }
    if (parseInt(document.getElementById("habitat-disruption").value) > 50) {
        recommendations.push("Preserve wildlife habitats and minimize disruptions.");
    }
    if (parseInt(document.getElementById("air-quality").value) > 50) {
        recommendations.push("Reduce emissions and control dust in sensitive areas.");
    }

    // Display recommendations
    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = recommendations.length
        ? `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join("")}</ul>`
        : "No significant risks detected. Monitoring recommended.";
}

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(16);
    doc.text("Environmental Impact Assessment Report", 10, 10);
    doc.setFontSize(12);

    // Add Project Details
    doc.text(`Project Name: ${document.getElementById("project-name").value || "N/A"}`, 10, 20);
    doc.text(`Location: ${document.getElementById("location").value || "N/A"}`, 10, 30);
    doc.text(`Assessor Name: ${document.getElementById("assessor-name").value || "N/A"}`, 10, 40);
    doc.text(`Date of Assessment: ${document.getElementById("date").value || "N/A"}`, 10, 50);

    // Add Risk Assessment
    doc.text(`Risk Score: ${document.getElementById("risk-score").innerText}`, 10, 60);
    doc.text(`Risk Level: ${document.getElementById("risk-level").innerText}`, 10, 70);

    // Add Recommendations
    doc.text("Recommendations:", 10, 80);
    const recommendations = document.getElementById("recommendations").innerText || "N/A";
    doc.text(recommendations, 10, 90);

    // Add Radar Chart as an Image
    const chartCanvas = document.getElementById("impact-chart");
    const chartImage = chartCanvas.toDataURL("image/png");
    doc.addImage(chartImage, "PNG", 10, 100, 150, 150);

    // Save the PDF
    doc.save("EIA_Report.pdf");
});
