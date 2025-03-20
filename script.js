// Update Slider Values and Risk Calculations
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        const sliderValue = slider.nextElementSibling;
        sliderValue.innerText = slider.value; // Update displayed slider value
        updateRiskScore(); // Recalculate risk score dynamically
        updateRecommendations(); // Generate recommendations dynamically
        initializeRadarChart(); // Update radar chart dynamically
    });
});

// Dynamic Risk Calculations
function updateRiskScore() {
    const weights = {
        erosion: 0.3,
        vegetation: 0.25,
        waterQuality: 0.2,
        habitatDisruption: 0.15,
        airQuality: 0.1,
    };

    const erosionValue = parseInt(document.getElementById("erosion").value) * weights.erosion;
    const vegetationValue = parseInt(document.getElementById("vegetation").value) * weights.vegetation;
    const waterQualityValue = parseInt(document.getElementById("water-quality").value) * weights.waterQuality;
    const habitatDisruptionValue = parseInt(document.getElementById("habitat-disruption").value) * weights.habitatDisruption;
    const airQualityValue = parseInt(document.getElementById("air-quality").value) * weights.airQuality;

    const totalRiskScore = Math.round(
        erosionValue + vegetationValue + waterQualityValue + habitatDisruptionValue + airQualityValue
    );

    const riskScoreElement = document.getElementById("risk-score");
    riskScoreElement.innerText = totalRiskScore;

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

    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = recommendations.length
        ? `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join("")}</ul>`
        : "No significant risks detected. Monitoring recommended.";
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
        window.radarChart.destroy();
    }
    window.radarChart = new Chart(ctx, radarChartConfig);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeRadarChart();
});

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    const headerColor = "#2a6f4b";
    const sectionTitleFontSize = 14;
    const textFontSize = 12;
    const textColor = "#333";
    const margin = 10;
    let yOffset = 20;

    const addPage = () => {
        doc.addPage();
        yOffset = margin;
    };

    doc.setTextColor(headerColor);
    doc.setFontSize(18);
    doc.text("Environmental Impact Assessment Report", margin, yOffset);
    yOffset += 10;

    doc.setDrawColor(headerColor);
    doc.line(margin, yOffset, 200, yOffset);
    yOffset += 10;

    doc.setFontSize(sectionTitleFontSize);
    doc.text("Project Details", margin, yOffset);
    yOffset += 10;

    if (yOffset > 270) addPage();
    doc.setFontSize(textFontSize);
    doc.setTextColor(textColor);
    doc.text(`Project Name: ${document.getElementById("project-name").value || "N/A"}`, margin, yOffset);

    // Repeat this process for all sections, ensuring proper line wrapping and page breaks
    if (yOffset > 270) addPage();

    const chartCanvas = document.getElementById("impact-chart");
    if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL("image/png");
        doc.addImage(chartImage, "PNG", margin, yOffset, 180, 90);
        yOffset += 95;
    }

    if (yOffset > 270) addPage();
    doc.setFontSize(sectionTitleFontSize);
    doc.setTextColor(headerColor);
    doc.text("Recommendations", margin, yOffset);

    doc.save("EIA_Report.pdf");
});
