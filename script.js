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

// Recommendations Based on Risks
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

// Save Data to CSV
document.getElementById("save-local").addEventListener("click", () => {
    const headers = [
        "Field",
        "Value",
    ];

    const data = [
        ["Project Name", document.getElementById("project-name").value || "N/A"],
        ["Location", document.getElementById("location").value || "N/A"],
        ["Assessor Name", document.getElementById("assessor-name").value || "N/A"],
        ["Date of Assessment", document.getElementById("date").value || "N/A"],
        ["Project Description", document.getElementById("project-description").value || "N/A"],
        ["Project Purpose", document.getElementById("project-purpose").value || "N/A"],
        ["Flora & Fauna", document.getElementById("flora-fauna").value || "N/A"],
        ["Soil Types", document.getElementById("soil-types").value || "N/A"],
        ["Waterways", document.getElementById("waterways").value || "N/A"],
        ["Biosecurity Measures", document.getElementById("biosecurity-plan").value || "N/A"],
        ["Erosion Impact", document.getElementById("erosion").value || "0"],
        ["Vegetation Damage", document.getElementById("vegetation").value || "0"],
        ["Water Quality Impact", document.getElementById("water-quality").value || "0"],
        ["Habitat Disruption", document.getElementById("habitat-disruption").value || "0"],
        ["Air Quality Impact", document.getElementById("air-quality").value || "0"],
    ];

    const csvContent = [
        headers.join(","),
        ...data.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Assessment_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Delete Data with Confirmation
document.getElementById("delete-data").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
        document.querySelectorAll("form input, form textarea").forEach(input => input.value = "");
        document.querySelectorAll("input[type='range']").forEach(slider => slider.value = 0);
        updateRiskScore();
        updateRecommendations();
        initializeRadarChart();
        alert("All data has been cleared.");
    }
});

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    // Prompt the user for a file name
    const pdfName = prompt("Enter the file name for your PDF:", "EIA_Report");
    if (!pdfName) {
        // Exit if the user clicks "Cancel" or leaves the input empty
        alert("PDF generation canceled.");
        return;
    }

    const doc = new jsPDF();
    const headerColor = "#2a6f4b";
    const sectionTitleFontSize = 14;
    const textFontSize = 12;
    const textColor = "#333";
    const margin = 10;
    let yOffset = 20; // Starting vertical offset

    const addPage = () => {
        doc.addPage();
        yOffset = margin;
    };

    // Add Title
    doc.setTextColor(headerColor);
    doc.setFontSize(18);
    doc.text("Environmental Impact Assessment Report", margin, yOffset);
    yOffset += 10;

    // Add a line below the title
    doc.setDrawColor(headerColor);
    doc.line(margin, yOffset, 200, yOffset);
    yOffset += 10;

    // Project Details Section
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Project Details", margin, yOffset);
    yOffset += 10;

    doc.setFontSize(textFontSize);
    doc.setTextColor(textColor);
    doc.text(`Project Name: ${document.getElementById("project-name").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Location: ${document.getElementById("location").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Assessor Name: ${document.getElementById("assessor-name").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Date of Assessment: ${document.getElementById("date").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Project Description: ${document.getElementById("project-description").value || "N/A"}`, margin, yOffset);
    yOffset += 6;

    if (yOffset > 270) addPage();

    doc.text(`Project Purpose: ${document.getElementById("project-purpose").value || "N/A"}`, margin, yOffset);
    yOffset += 10;

    // Site Information Section
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Site Information", margin, yOffset);
    yOffset += 10;

    doc.setTextColor(textColor);
    doc.text(`Flora & Fauna: ${document.getElementById("flora-fauna").value || "N/A"}`, margin, yOffset);
    yOffset += 6;

    if (yOffset > 270) addPage();

    doc.text(`Soil Types: ${document.getElementById("soil-types").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Waterways: ${document.getElementById("waterways").value || "N/A"}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Biosecurity Measures: ${document.getElementById("biosecurity-plan").value || "N/A"}`, margin, yOffset);
    yOffset += 10;

    // Recommendations Section
    if (yOffset > 270) addPage();
    doc.setTextColor(headerColor);
    doc.setFontSize(sectionTitleFontSize);
    doc.text("Recommendations", margin, yOffset);
    yOffset += 10;

    doc.setTextColor(textColor);
    const recommendationsText = document.getElementById("recommendations").innerText || "No recommendations available.";
    doc.text(recommendationsText, margin, yOffset, { maxWidth: 180 });
    yOffset += 10;

    // Radar Chart Section
    if (yOffset > 200) addPage();
    const chartCanvas = document.getElementById("impact-chart");
    if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL("image/png");
        const chartWidth = 180;
        const chartHeight = (chartCanvas.height / chartCanvas.width) * chartWidth; // Preserve aspect ratio
        doc.addImage(chartImage, "PNG", margin, yOffset, chartWidth, chartHeight);
        yOffset += chartHeight + 10;
    }

    // Save the PDF with the custom or default name
    doc.save(`${pdfName}.pdf`);
});

// Save Data to CSV
document.getElementById("save-local").addEventListener("click", () => {
    const headers = ["Field", "Value"];
    const data = [
        ["Project Name", document.getElementById("project-name").value || "N/A"],
        ["Location", document.getElementById("location").value || "N/A"],
        ["Assessor Name", document.getElementById("assessor-name").value || "N/A"],
        ["Date of Assessment", document.getElementById("date").value || "N/A"],
        ["Project Description", document.getElementById("project-description").value || "N/A"],
        ["Project Purpose", document.getElementById("project-purpose").value || "N/A"],
        ["Flora & Fauna", document.getElementById("flora-fauna").value || "N/A"],
        ["Soil Types", document.getElementById("soil-types").value || "N/A"],
        ["Waterways", document.getElementById("waterways").value || "N/A"],
        ["Biosecurity Measures", document.getElementById("biosecurity-plan").value || "N/A"],
        ["Erosion Impact", document.getElementById("erosion").value || "0"],
        ["Vegetation Damage", document.getElementById("vegetation").value || "0"],
        ["Water Quality Impact", document.getElementById("water-quality").value || "0"],
        ["Habitat Disruption", document.getElementById("habitat-disruption").value || "0"],
        ["Air Quality Impact", document.getElementById("air-quality").value || "0"],
    ];

    const csvContent = [headers.join(","), ...data.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Assessment_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Delete Data with Confirmation
document.getElementById("delete-data").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
        document.querySelectorAll("form input, form textarea").forEach(input => input.value = "");
        document.querySelectorAll("input[type='range']").forEach(slider => slider.value = 0);
        updateRiskScore();
        updateRecommendations();
        initializeRadarChart();
        alert("All data has been cleared.");
    }
});
