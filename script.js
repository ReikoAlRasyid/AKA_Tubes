let timeChart;
let currentDataPoints = [];
let chartType = 'line';
let currentIterations = 5;
let isRunning = false;

function luhnIterative(cardNumber) {
    let total = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        total += digit;
        isEven = !isEven;
    }
    return total % 10 === 0;
}

function luhnRecursive(cardNumber, index = 0, total = 0, isEven = false) {
    if (index >= cardNumber.length) {
        return total % 10 === 0;
    }
    const reverseIndex = cardNumber.length - index - 1;
    let digit = parseInt(cardNumber[reverseIndex]);
    if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
    }
    return luhnRecursive(cardNumber, index + 1, total + digit, !isEven);
}

function generateRandomCardNumber(length) {
    if (length <= 0) return ""; // Handle kasus panjang 0
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function initChart() {
    const ctx = document.getElementById('timeChart').getContext('2d');
    timeChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Iteratif',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Rekursif',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Panjang Data',
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Waktu (ms)',
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value.toFixed(2) + ' ms';
                        }
                    },
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}

function updateChartInfo() {
    document.getElementById('dataPoints').textContent = currentDataPoints.length;
    document.getElementById('chartMode').textContent = chartType === 'line' ? 'Linear' : 'Bar';
}

function setIterations(count) {
    currentIterations = count;
    document.querySelectorAll('.iter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function toggleChartType() {
    chartType = chartType === 'line' ? 'bar' : 'line';
    timeChart.config.type = chartType;
    timeChart.update();
    updateChartInfo();
}

function clearChart() {
    timeChart.data.labels = [];
    timeChart.data.datasets[0].data = [];
    timeChart.data.datasets[1].data = [];
    
    // Reset skala Y ke 0
    timeChart.options.scales.y.min = 0;
    timeChart.options.scales.y.suggestedMax = 10;
    
    timeChart.update();
    currentDataPoints = [];
    updateChartInfo();
    updateResults(0, 0);
}

function resetAll() {
    clearChart();
    // Ubah nilai default minData menjadi 0
    document.getElementById('minData').value = 0;
    document.getElementById('maxData').value = 1000;
    document.getElementById('dataSteps').value = 10;
    document.getElementById('stepValue').textContent = '10';
    setIterations(5);
    document.getElementById('chartStatus').textContent = 'Siap';
    document.getElementById('chartStatus').style.color = '';
    
    // Pastikan skala Y kembali ke 0
    if (timeChart) {
        timeChart.options.scales.y.min = 0;
        timeChart.options.scales.y.suggestedMax = 10;
        timeChart.update();
    }
}

function updateResults(iterativeTime, recursiveTime) {
    const iterativeElem = document.getElementById('iterativeTime');
    const recursiveElem = document.getElementById('recursiveTime');
    const iterativePercent = document.getElementById('iterativePercent');
    const recursivePercent = document.getElementById('recursivePercent');
    const speedupElem = document.getElementById('speedupFactor');
    const speedupDesc = document.querySelector('.result-desc');
    iterativeElem.textContent = iterativeTime.toFixed(2) + ' ms';
    recursiveElem.textContent = recursiveTime.toFixed(2) + ' ms';
    const totalTime = iterativeTime + recursiveTime;
    if (totalTime > 0) {
        const iterativePercentage = ((iterativeTime / totalTime) * 100).toFixed(1);
        const recursivePercentage = ((recursiveTime / totalTime) * 100).toFixed(1);
        iterativePercent.textContent = iterativePercentage + '%';
        recursivePercent.textContent = recursivePercentage + '%';
        if (iterativeTime > 0 && recursiveTime > 0) {
            const speedup = recursiveTime / iterativeTime;
            speedupElem.textContent = speedup.toFixed(2) + 'x';
            if (speedup > 1) {
                speedupDesc.textContent = 'Iteratif lebih cepat';
            } else if (speedup < 1) {
                speedupDesc.textContent = 'Rekursif lebih cepat';
            } else {
                speedupDesc.textContent = 'Sama cepat';
            }
        }
    }
}

async function runTest() {
    if (isRunning) return;
    isRunning = true;
    const runBtn = document.querySelector('.run-btn');
    const statusElem = document.getElementById('chartStatus');
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MENJALANKAN...';
    statusElem.textContent = 'Menjalankan tes...';
    statusElem.style.color = '#f59e0b';
    
    try {
        const minData = parseInt(document.getElementById('minData').value);
        const maxData = parseInt(document.getElementById('maxData').value);
        const steps = parseInt(document.getElementById('dataSteps').value);
        
        // Validasi input
        if (minData < 0) minData = 0;
        if (maxData < minData) maxData = minData + 10;
        if (maxData > 50000) maxData = 50000;
        
        // Reset chart data
        timeChart.data.labels = [];
        timeChart.data.datasets[0].data = [];
        timeChart.data.datasets[1].data = [];
        
        const iterativeTimes = [];
        const recursiveTimes = [];
        
        // Buat array ukuran data dengan cara yang lebih sederhana
        const dataSizes = [];
        
        if (steps <= 1) {
            // Jika steps = 1, hanya gunakan maxData
            dataSizes.push(maxData);
        } else {
            // Hitung interval yang tepat
            const interval = (maxData - minData) / (steps - 1);
            
            // Generate titik-titik data
            for (let i = 0; i < steps; i++) {
                const size = Math.round(minData + (i * interval));
                dataSizes.push(size);
            }
            
            // Pastikan titik terakhir adalah maxData
            dataSizes[dataSizes.length - 1] = maxData;
        }
        
        // Jalankan tes untuk setiap ukuran data
        for (let idx = 0; idx < dataSizes.length; idx++) {
            const size = dataSizes[idx];
            statusElem.textContent = `Menguji titik ${idx + 1}/${dataSizes.length} (panjang ${size})...`;
            
            if (size === 0) {
                // Handle kasus khusus untuk panjang 0
                timeChart.data.labels.push('0');
                timeChart.data.datasets[0].data.push(0);
                timeChart.data.datasets[1].data.push(0);
                iterativeTimes.push(0);
                recursiveTimes.push(0);
                continue;
            }
            
            let iterativeTotal = 0;
            let recursiveTotal = 0;
            
            // Jalankan pengujian sebanyak currentIterations
            for (let iter = 0; iter < currentIterations; iter++) {
                const cardNumber = generateRandomCardNumber(size);
                
                // Test iterative
                const iterativeStart = performance.now();
                for (let i = 0; i < 1000; i++) {
                    luhnIterative(cardNumber);
                }
                const iterativeEnd = performance.now();
                iterativeTotal += (iterativeEnd - iterativeStart);
                
                // Test recursive
                const recursiveStart = performance.now();
                for (let i = 0; i < 1000; i++) {
                    luhnRecursive(cardNumber);
                }
                const recursiveEnd = performance.now();
                recursiveTotal += (recursiveEnd - recursiveStart);
            }
            
            // Hitung rata-rata waktu
            const avgIterative = iterativeTotal / currentIterations;
            const avgRecursive = recursiveTotal / currentIterations;
            iterativeTimes.push(avgIterative);
            recursiveTimes.push(avgRecursive);
            
            // Update chart
            timeChart.data.labels.push(size.toString());
            timeChart.data.datasets[0].data.push(avgIterative);
            timeChart.data.datasets[1].data.push(avgRecursive);
            timeChart.update();
            
            // Update hasil sementara
            updateResults(avgIterative, avgRecursive);
            
            // Beri jeda agar UI tetap responsif
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Hitung rata-rata keseluruhan
        const validIterativeTimes = iterativeTimes.filter(time => time > 0);
        const validRecursiveTimes = recursiveTimes.filter(time => time > 0);
        
        const overallIterative = validIterativeTimes.length > 0 
            ? validIterativeTimes.reduce((a, b) => a + b, 0) / validIterativeTimes.length 
            : 0;
        const overallRecursive = validRecursiveTimes.length > 0
            ? validRecursiveTimes.reduce((a, b) => a + b, 0) / validRecursiveTimes.length
            : 0;
        
        // Update hasil akhir
        updateResults(overallIterative, overallRecursive);
        currentDataPoints = dataSizes;
        updateChartInfo();
        
        statusElem.textContent = `Selesai (${dataSizes.length} titik data)`;
        statusElem.style.color = '#10b981';
        
    } catch (error) {
        console.error('Error running test:', error);
        statusElem.textContent = 'Error: ' + error.message;
        statusElem.style.color = '#ef4444';
    } finally {
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<i class="fas fa-play"></i> JALANKAN TES';
    }
}

function showAlgorithm(type) {
    document.querySelectorAll('.algo-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.algorithm-code').forEach(code => {
        code.classList.remove('active');
    });
    event.target.classList.add('active');
    document.getElementById(`${type}-code`).classList.add('active');
}

function copyCurrentAlgorithm() {
    const activeCode = document.querySelector('.algorithm-code.active');
    const codeText = activeCode.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initChart();
    updateChartInfo();
    
    const stepSlider = document.getElementById('dataSteps');
    const stepValue = document.getElementById('stepValue');
    stepSlider.addEventListener('input', function() {
        stepValue.textContent = this.value;
    });
    
    // Event listener untuk minData (diubah agar bisa 0)
    document.getElementById('minData').addEventListener('change', function() {
        let min = parseInt(this.value);
        const max = parseInt(document.getElementById('maxData').value);
        
        if (isNaN(min)) min = 0;
        if (min < 0) min = 0;
        
        if (min >= max) {
            this.value = max - 10;
            if (this.value < 0) this.value = 0;
        } else {
            this.value = min;
        }
    });
    
    // Event listener untuk maxData
    document.getElementById('maxData').addEventListener('change', function() {
        let max = parseInt(this.value);
        const min = parseInt(document.getElementById('minData').value);
        
        if (isNaN(max)) max = 1000;
        if (max <= min) {
            this.value = min + 10;
        }
        if (max > 50000) {
            this.value = 50000;
        }
        if (max < 10) {
            this.value = 10;
        }
    });
    
    // Event listener untuk tombol reset
    document.querySelector('.reset-btn').addEventListener('click', function() {
        resetAll();
    });
    
    // Event listener untuk tombol clear
    document.querySelector('.clear-btn').addEventListener('click', function() {
        clearChart();
    });
});

