// Update Slider Values and Risk Calculations
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        const sliderValue = slider.nextElementSibling;
        sliderValue.innerText = slider.value;
        updateRiskScore();
        updateRecommendations();
        initializeRadarChart();
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

    if (window.radarChart) window.radarChart.destroy();
    window.radarChart = new Chart(ctx, {
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
    });
}

document.addEventListener("DOMContentLoaded", initializeRadarChart);

// Utility to Check Page Limit for Pagination
function checkPageLimit(doc, yOffset, margin) {
    const pageHeight = doc.internal.pageSize.height;
    if (yOffset >= pageHeight - margin) {
        doc.addPage();
        return margin; // Reset yOffset for the new page
    }
    return yOffset;
}

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

    doc.setTextColor(headerColor);
    doc.setFontSize(18);
    doc.text("Environmental Impact Assessment Report", margin, yOffset);
    yOffset += 8;
    doc.line(margin, yOffset, 200, yOffset);
    yOffset += 8;

    const sections = [
        { title: "Project Details", content: [
            `Project Name: ${document.getElementById("project-name").value || "N/A"}`,
            `Location: ${document.getElementById("location").value || "N/A"}`,
            `Assessor Name: ${document.getElementById("assessor-name").value || "N/A"}`,
            `Date of Assessment: ${document.getElementById("date").value || "N/A"}`,
            `Project Description: ${document.getElementById("project-description").value || "N/A"}`,
            `Project Purpose: ${document.getElementById("project-purpose").value || "N/A"}`
        ]},
        { title: "Risk Assessment", content: [
            `Risk Score: ${document.getElementById("risk-score").innerText || "0"}`,
            `Risk Level: ${document.getElementById("risk-level").innerText || "Low Risk"}`
        ]},
        { title: "Recommendations", content: [
            document.getElementById("recommendations").innerText || "No recommendations available."
        ]}
    ];

    sections.forEach(section => {
        yOffset = checkPageLimit(doc, yOffset, margin);
        doc.setTextColor(headerColor);
        doc.setFontSize(sectionTitleFontSize);
        doc.text(section.title, margin, yOffset);
        yOffset += 8;
        doc.setTextColor(textColor);
        section.content.forEach(line => {
            const wrappedText = doc.splitTextToSize(line, 180);
            wrappedText.forEach(textLine => {
                yOffset = checkPageLimit(doc, yOffset, margin);
                doc.text(textLine, margin, yOffset);
                yOffset += 6;
            });
        });
    });

    const chartCanvas = document.getElementById("impact-chart");
    if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL("image/png");
        yOffset = checkPageLimit(doc, yOffset + 95, margin);
        doc.addImage(chartImage, "PNG", margin, yOffset, 180, 90);
    }

    doc.save("EIA_Report.pdf");
});
