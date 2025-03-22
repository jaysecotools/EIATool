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

    // Define the chart data
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
                backgroundColor: "rgba(44, 110, 73, 0.2)", // Soft green overlay
                borderColor: "rgba(44, 110, 73, 1)", // Green border
                borderWidth: 2,
                pointBackgroundColor: "rgba(44, 110, 73, 1)", // Points in the same green as the border
            },
        ],
    };

    // Define the chart configuration
    const radarChartConfig = {
        type: "radar",
        data: chartData,
        options: {
            responsive: true,
            elements: {
                line: {
                    tension: 0.3, // Smoothens the lines for a rounder look
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: true, // Show angle lines for aesthetic
                    },
                    suggestedMin: 0, // Start at 0
                    suggestedMax: 100, // Ensure the maximum value is fixed at 100
                    ticks: {
                        stepSize: 20, // Steps of 20 for better readability
                        display: true,
                        color: "#6ba583", // Green tick marks
                    },
                    grid: {
                        circular: true, // Makes the chart circular
                    },
                    pointLabels: {
                        font: {
                            size: 14, // Increase size for better readability
                        },
                        color: "#2a6f4b", // Match the deep green for labels
                    },
                },
            },
            plugins: {
                legend: {
                    display: false, // No legend to keep it clean
                },
            },
        },
    };

    // Destroy the existing radar chart instance if it exists
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    // Create a new radar chart instance
    window.radarChart = new Chart(ctx, radarChartConfig);
}


// Reinitialize Radar Chart on Page Load
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
    const pdfName = prompt("Enter the file name for your PDF:", "EIA_Report") || "";

    // Exit if the user cancels or leaves the input empty
    if (!pdfName.trim()) {
        alert("PDF generation canceled.");
        return; // Stops further execution of the PDF generation logic
    }

    try {
        const doc = new jsPDF();
        const headerColor = "#2a6f4b"; // Teal for headings and subheadings
        const textColor = "#333"; // Black for user inputs
        const sectionTitleFontSize = 14;
        const subHeadingFontSize = 12;
        const textFontSize = 12;
        const footerFontSize = 10; // Smaller font size for footer
        const margin = 10;
        const footerText = "Produced with Environmental Impact Assessment Tool by Jay Rowley";
        let yOffset = margin;

        const addPage = () => {
            doc.addPage();
            yOffset = margin;
        };

        const addFooter = (currentPage, totalPages) => {
            doc.setFontSize(footerFontSize);
            doc.setTextColor(textColor); // Footer text in black
            doc.text(
                `${footerText} - Page ${currentPage} of ${totalPages}`,
                margin,
                doc.internal.pageSize.height - 10 // 10px from bottom
            );
        };

        // Main title
        doc.setTextColor(headerColor);
        doc.setFontSize(18);
        doc.text("Environmental Impact Assessment Report", margin, yOffset);
        yOffset += 15;
        doc.setDrawColor(headerColor);
        doc.line(margin, yOffset, 200, yOffset);
        yOffset += 15;

        // Project Details Section
        const addSectionTitle = (title) => {
            if (yOffset > 270) addPage();
            doc.setFontSize(sectionTitleFontSize);
            doc.setTextColor(headerColor); // Teal for section titles
            doc.text(title, margin, yOffset);
            yOffset += 10;
        };

        const addSubHeadingAndText = (subHeading, text) => {
            doc.setFontSize(subHeadingFontSize);
            doc.setTextColor(headerColor); // Teal for subheadings
            if (yOffset > 270) addPage();
            doc.text(`${subHeading}:`, margin, yOffset);
            yOffset += 6;

            doc.setFontSize(textFontSize);
            doc.setTextColor(textColor); // Black for user inputs
            const splitText = doc.splitTextToSize(text, 180);
            splitText.forEach(line => {
                if (yOffset > 270) addPage();
                doc.text(line, margin, yOffset);
                yOffset += 6;
            });
            yOffset += 5; // Adds spacing below each text block
        };

        addSectionTitle("Project Details");
        addSubHeadingAndText("Project Name", document.getElementById("project-name").value || "N/A");
        addSubHeadingAndText("Location", document.getElementById("location").value || "N/A");
        addSubHeadingAndText("Assessor Name", document.getElementById("assessor-name").value || "N/A");
        addSubHeadingAndText("Date of Assessment", document.getElementById("date").value || "N/A");
        addSubHeadingAndText("Project Description", document.getElementById("project-description").value || "N/A");
        addSubHeadingAndText("Project Purpose", document.getElementById("project-purpose").value || "N/A");

        // Radar Chart Section
        addPage();
        const chartCanvas = document.getElementById("impact-chart");
        if (chartCanvas) {
            const chartImage = chartCanvas.toDataURL("image/png");
            const chartWidth = 180;
            const chartHeight = (chartCanvas.height / chartCanvas.width) * chartWidth;
            doc.addImage(chartImage, "PNG", margin, yOffset, chartWidth, chartHeight);
            yOffset += chartHeight + 10;
        }

        // Add footers to all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(i, totalPages);
        }

        // Save the PDF
        doc.save(`${pdfName}.pdf`);
    } catch (error) {
        alert("An error occurred during PDF generation: " + error.message);
        console.error(error);
    }
});
