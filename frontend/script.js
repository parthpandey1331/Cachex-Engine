let dataPoints = [];

const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Cache Hit Rate',
            data: [],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 5
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: "#475569"
                }
            }
        },
        scales: {
            x: {
                ticks: { color: "#64748b" }
            },
            y: {
                ticks: { color: "#64748b" }
            }
        }
    }
});

function updateChart(hitRate) {
    dataPoints.push(hitRate);

    chart.data.labels.push(dataPoints.length);
    chart.data.datasets[0].data = dataPoints;

    chart.update();
}

async function loadKeys() {
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
}

loadKeys(); 

async function fetchData() {
    showLoader();
    let key = document.getElementById("key").value;

    try {
        let res = await fetch(`http://localhost:8080/get?key=${key}`);
        let data = await res.json();

        console.log(data); // ✅ DEBUG

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