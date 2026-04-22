let dataPoints = [];
let chart; // global chart

// ✅ RUN AFTER PAGE LOAD
window.onload = () => {

    console.log("JS Loaded");

    const ctx = document.getElementById('chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(139,92,246,0.6)");
    gradient.addColorStop(1, "rgba(139,92,246,0.05)");

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Cache Hit Rate',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#8b5cf6',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#cbd5f5"
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of Requests",
                        color: "#a5b4fc"
                    },
                    ticks: {
                        color: "#94a3b8"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Cache Hit Rate (%)",
                        color: "#a5b4fc"
                    },
                    ticks: {
                        color: "#94a3b8"
                    }
                }
            }
        }
    });

    loadKeys(); // call after DOM ready
};

// ===================== FUNCTIONS =====================

function updateChart(hitRate) {
    dataPoints.push(hitRate);
    chart.data.labels.push(dataPoints.length);
    chart.data.datasets[0].data = dataPoints;
    chart.update();
}

async function loadKeys() {
    try {
        let res = await fetch("https://cachex-engine.onrender.com/keys");
        let data = await res.json();

        let dropdown = document.getElementById("key");
        dropdown.innerHTML = "";

        data.forEach(item => {
            let option = document.createElement("option");
            option.value = item.id;
            option.text = item.id + " - " + item.value;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading keys:", error);
    }
}

async function fetchData() {
    showLoader();

    let key = document.getElementById("key").value;
    
    try {
        let res = await fetch(`https://cachex-engine.onrender.com/get?key=${key}`);
        let data = await res.json();

        console.log(data);

        document.getElementById("result").innerText = data.result;
        document.getElementById("hitRate").innerText =
            (data.hitRate || 0).toFixed(2) + "%";

        document.querySelector(".hit").innerText =
            "✔ Hits " + (data.hits ?? 0);

        document.querySelector(".miss").innerText =
            "✖ Misses " + (data.misses ?? 0);

        updateChart(Number(data.hitRate || 0));

    } catch (error) {
        console.log("Error:", error);
    }

    hideLoader();
    showToast("Fetched successfully!");
}

async function clearCache() {
    showLoader();

    await fetch("https://cachex-engine.onrender.com/clear");

    document.getElementById("result").innerText = "---";
    document.getElementById("hitRate").innerText = "0%";

    hideLoader();
    showToast("Cache Cleared!");
}

async function addData() {
    showLoader();

    let value = document.getElementById("newValue").value;

    if (!value) {
        alert("Enter value");
        hideLoader();
        return;
    }

    await fetch(`https://cachex-engine.onrender.com/add?value=${value}`);

    document.getElementById("newValue").value = "";

    loadKeys();

    hideLoader();
    showToast("Added!");
}

async function deleteItem() {
    let id = document.getElementById("key").value;

    if (!confirm("Are you sure?")) return;

    showLoader();

    await fetch(`https://cachex-engine.onrender.com/delete?id=${id}`);

    loadKeys();

    hideLoader();
    showToast("Deleted!");
}

async function updateItem() {
    showLoader();

    let id = document.getElementById("key").value;
    let value = document.getElementById("updateValue").value;

    if (!value) {
        alert("Enter new value");
        hideLoader();
        return;
    }

    await fetch(`https://cachex-engine.onrender.com/update?id=${id}&value=${value}`);

    document.getElementById("updateValue").value = "";

    loadKeys();

    hideLoader();
    showToast("Updated!");
}

// ===================== UI =====================

function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function showToast(msg) {
    let toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// ===================== CHART EFFECT =====================

const glowPlugin = {
    id: 'glow',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = "rgba(139,92,246,0.6)";
        ctx.shadowBlur = 15;
    },
    afterDraw: (chart) => {
        chart.ctx.restore();
    }
};

Chart.register(glowPlugin);