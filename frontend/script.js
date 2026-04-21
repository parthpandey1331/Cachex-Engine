let dataPoints = [];

const ctx = document.getElementById('chart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgba(139,92,246,0.6)");
gradient.addColorStop(1, "rgba(139,92,246,0.05)");

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Cache Hit Rate',
            data: [],
            borderColor: '#8b5cf6',
            backgroundColor:  gradient,
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
                        color: "#a5b4fc",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
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
                        color: "#a5b4fc",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    },
                    ticks: {
                        color: "#94a3b8"
                    }
                }
            }
        }
     });

function updateChart(hitRate) {
    dataPoints.push(hitRate);

    chart.data.labels.push(dataPoints.length);
    chart.data.datasets[0].data = dataPoints;

    chart.update('active');
}

async function loadKeys() {
    try {
        let res = await fetch("http://localhost:8080/keys");
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

loadKeys(); 

async function fetchData() {
    showLoader();
    let key = document.getElementById("key").value;

    try {
        let res = await fetch(`http://localhost:8080/get?key=${key}`);
        let data = await res.json();

        console.log(data); 

        document.getElementById("result").innerText = data.result;
        document.getElementById("hitRate").innerText =
            data.hitRate.toFixed(2) + "%";
            
            document.querySelector(".hit").innerText =
                "✔ Hits " + (data.hits ?? 0);

            document.querySelector(".miss").innerText =
                "✖ Misses " + (data.misses ?? 0);
           
            updateChart(data.hitRate);
    } catch (error) {
        console.log("Error:", error);
    }

    hideLoader();
    showToast("Fetched successfully!");
}

async function clearCache() {
    showLoader();

    await fetch("http://localhost:8080/clear");

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

    await fetch(`http://localhost:8080/add?value=${value}`);

    alert("Added!");
    document.getElementById("newValue").value = "";

    loadKeys();
    
    hideLoader();
    showToast("Added!");
    
}

async function deleteItem() {
    let id = document.getElementById("key").value;

    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }

    showLoader();

    await fetch(`http://localhost:8080/delete?id=${id}`);

    alert(`Deleted ID ${id}`);

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

    await fetch(`http://localhost:8080/update?id=${id}&value=${value}`);

    showToast(`Updated ID ${id}`);   

    document.getElementById("updateValue").value = "";

    loadKeys();

    hideLoader();
}
 

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

const glowPlugin = {
    id: 'glow',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = "rgba(139,92,246,0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    },
    afterDraw: (chart) => {
        chart.ctx.restore();
    }
};

Chart.register(glowPlugin);