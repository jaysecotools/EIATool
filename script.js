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
        ? <ul>${recommendations.map(rec => <li>${rec}</li>).join("")}</ul>
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
        window.radarChart.destroy(); // Destroy the previous chart
    }
    window.radarChart = new Chart(ctx, radarChartConfig);
}

// Initialize the Radar Chart on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeRadarChart();
});

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    // Initialize jsPDF
    const doc = new jsPDF();

    // Define Colors and Fonts
    const headerColor = "#2a6f4b"; // Deep green for headers
    const sectionTitleFontSize = 14;
    const textFontSize = 12;
    const textColor = "#333"; // Neutral dark grey
    const margin = 10; // Margins for consistent spacing

    // Add Title
    doc.setTextColor(headerColor);
    doc.setFontSize(18);
    doc.text("Environmental Impact Assessment Report", margin, 20);

    // Add a line below the title
    doc.setDrawColor(headerColor); // Deep green line
    doc.line(margin, 22, 200, 22);

    // Add Project Details Section
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Project Details", margin, 30);

    doc.setTextColor(textColor);
    doc.setFontSize(textFontSize);
    doc.text(Project Name: ${document.getElementById("project-name").value || "N/A"}, margin, 40);
    doc.text(Location: ${document.getElementById("location").value || "N/A"}, margin, 46);
    doc.text(Assessor Name: ${document.getElementById("assessor-name").value || "N/A"}, margin, 52);
    doc.text(Date of Assessment: ${document.getElementById("date").value || "N/A"}, margin, 58);
    doc.text(Project Description: ${document.getElementById("project-description").value || "N/A"}, margin, 64);
    doc.text(Project Purpose: ${document.getElementById("project-purpose").value || "N/A"}, margin, 70);

    // Add Site Information Section
    let yOffset = 80;
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Site Information", margin, yOffset);

    doc.setTextColor(textColor);
    yOffset += 10;
    doc.text(Flora & Fauna: ${document.getElementById("flora-fauna").value || "N/A"}, margin, yOffset);
    yOffset += 6;
    doc.text(Soil Types: ${document.getElementById("soil-types").value || "N/A"}, margin, yOffset);
    yOffset += 6;
    doc.text(Waterways: ${document.getElementById("waterways").value || "N/A"}, margin, yOffset);
    yOffset += 6;
    doc.text(Biosecurity Measures: ${document.getElementById("biosecurity-plan").value || "N/A"}, margin, yOffset);

    // Add Activities Section
    yOffset += 12;
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Activities", margin, yOffset);

    doc.setTextColor(textColor);
    yOffset += 10;
    const activities = [
        "Invasive Species Control",
        "Revegetation",
        "Erosion Control Structures",
        "Waterway Restoration",
        "Wildlife Habitat Creation",
        "Pest Management",
    ];
    activities.forEach((activity, index) => {
        const isChecked = document.querySelector(input[value="${activity}"]).checked;
        doc.text(${isChecked ? "[X]" : "[ ]"} ${activity}, margin, yOffset + index * 6);
    });

    // Add Risk Assessment Section
    yOffset += activities.length * 6 + 12;
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Risk Assessment", margin, yOffset);

    doc.setTextColor(textColor);
    yOffset += 10;
    doc.text(Risk Score: ${document.getElementById("risk-score").innerText || "0"}, margin, yOffset);
    yOffset += 6;
    doc.text(Risk Level: ${document.getElementById("risk-level").innerText || "Low Risk"}, margin, yOffset);

    // Add Radar Chart (if it fits)
    yOffset += 10;
    const chartCanvas = document.getElementById("impact-chart");
    if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL("image/png");
        doc.addImage(chartImage, "PNG", margin, yOffset, 180, 90); // Scaled to fit within the page
        yOffset += 95; // Move below the chart
    }

    // Add Recommendations Section
    yOffset += 10;
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Recommendations", margin, yOffset);

    doc.setTextColor(textColor);
    yOffset += 10;
    const recommendations = document.getElementById("recommendations").innerText || "No recommendations available.";
    doc.text(recommendations, margin, yOffset, { maxWidth: 180 }); // Ensures the text wraps within the page width

    // Save the PDF
    doc.save("EIA_Report.pdf");
});
