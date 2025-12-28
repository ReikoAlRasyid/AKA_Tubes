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
    if (length <= 0) return "";
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
                        text: 'Jumlah Data',
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
                            if (value < 0.001) return value.toFixed(6) + ' ms';
                            if (value < 0.01) return value.toFixed(5) + ' ms';
                            if (value < 0.1) return value.toFixed(4) + ' ms';
                            if (value < 1) return value.toFixed(3) + ' ms';
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
    
    timeChart.options.scales.y.min = 0;
    timeChart.options.scales.y.suggestedMax = 10;
    
    timeChart.update();
    currentDataPoints = [];
    updateChartInfo();
    updateResults(0, 0);
}

function resetAll() {
    clearChart();
    document.getElementById('minData').value = 0;
    document.getElementById('maxData').value = 1000;
    document.getElementById('dataSteps').value = 10;
    document.getElementById('stepValue').textContent = '10';
    setIterations(5);
    document.getElementById('chartStatus').textContent = 'Siap';
    document.getElementById('chartStatus').style.color = '';
    
    // Reset input untuk single card dan CSV
    document.getElementById('singleCardInput').value = '';
    document.getElementById('singleTestResult').style.display = 'none';
    document.getElementById('csvUpload').value = '';
    document.getElementById('csvResult').style.display = 'none';
    document.getElementById('processCsvBtn').disabled = true;
    document.getElementById('processCsvBtn').innerHTML = '<i class="fas fa-cog"></i> Proses';
    
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
    
    // Format angka kecil dengan lebih baik
    const formatTime = (time) => {
        if (time < 0.001) return time.toFixed(6) + ' ms';
        if (time < 0.01) return time.toFixed(5) + ' ms';
        if (time < 0.1) return time.toFixed(4) + ' ms';
        if (time < 1) return time.toFixed(3) + ' ms';
        return time.toFixed(2) + ' ms';
    };
    
    iterativeElem.textContent = formatTime(iterativeTime);
    recursiveElem.textContent = formatTime(recursiveTime);
    
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

// Fungsi untuk menambahkan titik ke grafik utama
function addToChart(dataSize, iterativeTime, recursiveTime, label = null) {
    // Gunakan label kustom jika tersedia
    const dataLabel = label || dataSize.toString();
    
    // Cek apakah label sudah ada di chart
    const existingIndex = timeChart.data.labels.indexOf(dataLabel);
    
    if (existingIndex >= 0) {
        // Update nilai yang sudah ada (rata-rata)
        const oldIterative = timeChart.data.datasets[0].data[existingIndex];
        const oldRecursive = timeChart.data.datasets[1].data[existingIndex];
        timeChart.data.datasets[0].data[existingIndex] = (oldIterative + iterativeTime) / 2;
        timeChart.data.datasets[1].data[existingIndex] = (oldRecursive + recursiveTime) / 2;
    } else {
        // Tambahkan titik baru
        timeChart.data.labels.push(dataLabel);
        timeChart.data.datasets[0].data.push(iterativeTime);
        timeChart.data.datasets[1].data.push(recursiveTime);
        
        // Update jumlah data points
        currentDataPoints.push(dataSize);
        updateChartInfo();
    }
    
    // Update skala Y jika perlu
    const maxTime = Math.max(iterativeTime, recursiveTime);
    const currentMax = timeChart.options.scales.y.suggestedMax;
    if (maxTime > currentMax) {
        timeChart.options.scales.y.suggestedMax = Math.ceil(maxTime * 1.2);
    }
    
    // Update chart
    timeChart.update();
    
    // Update hasil keseluruhan
    updateResults(iterativeTime, recursiveTime);
}

// FUNGSI UTAMA UNTUK BATCH TEST - TOTAL WAKTU
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
        
        // Buat array ukuran data
        const dataSizes = [];
        
        if (steps <= 1) {
            dataSizes.push(maxData);
        } else {
            const interval = (maxData - minData) / (steps - 1);
            
            for (let i = 0; i < steps; i++) {
                const size = Math.round(minData + (i * interval));
                dataSizes.push(size);
            }
            
            dataSizes[dataSizes.length - 1] = maxData;
        }
        
        // Jalankan tes untuk setiap ukuran data
        for (let idx = 0; idx < dataSizes.length; idx++) {
            const size = dataSizes[idx];
            statusElem.textContent = `Menguji titik ${idx + 1}/${dataSizes.length} (jumlah ${size})...`;
            
            if (size === 0) {
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
                const cardNumber = generateRandomCardNumber(16);
                
                // Test iterative untuk batch - TOTAL WAKTU
                const iterativeStart = performance.now();
                for (let i = 0; i < size; i++) {
                    luhnIterative(cardNumber);
                }
                const iterativeEnd = performance.now();
                iterativeTotal += (iterativeEnd - iterativeStart); // TOTAL waktu untuk size eksekusi
                
                // Test recursive untuk batch - TOTAL WAKTU
                const recursiveStart = performance.now();
                for (let i = 0; i < size; i++) {
                    luhnRecursive(cardNumber);
                }
                const recursiveEnd = performance.now();
                recursiveTotal += (recursiveEnd - recursiveStart); // TOTAL waktu untuk size eksekusi
            }
            
            // Hitung rata-rata TOTAL waktu
            const avgIterative = iterativeTotal / currentIterations;
            const avgRecursive = recursiveTotal / currentIterations;
            
            iterativeTimes.push(avgIterative);
            recursiveTimes.push(avgRecursive);
            
            // Update chart
            addToChart(size, avgIterative, avgRecursive);
            
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

// Event listener untuk upload CSV
document.getElementById('csvUpload').addEventListener('change', function(e) {
    const processBtn = document.getElementById('processCsvBtn');
    if (e.target.files.length > 0) {
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-cog"></i> Proses (' + e.target.files[0].name + ')';
    } else {
        processBtn.disabled = true;
        processBtn.innerHTML = '<i class="fas fa-cog"></i> Proses';
    }
});

// FUNGSI TEST SINGLE CARD - TOTAL WAKTU (KONSISTEN DENGAN BATCH TEST)
function testSingleCard() {
    const cardNumber = document.getElementById('singleCardInput').value.trim();
    
    if (!cardNumber) {
        alert('Masukkan nomor kartu terlebih dahulu');
        return;
    }
    
    // Hapus spasi dan karakter non-digit
    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        alert('Nomor kartu harus 13-19 digit');
        return;
    }
    
    // Gunakan iterasi yang cukup untuk keakuratan - TOTAL WAKTU
    const iterations = 10000;
    
    // Waktu untuk iteratif - TOTAL WAKTU untuk iterations eksekusi
    const iterativeStart = performance.now();
    let iterativeValid;
    for (let i = 0; i < iterations; i++) {
        iterativeValid = luhnIterative(cleanCardNumber);
    }
    const iterativeEnd = performance.now();
    const iterativeTime = (iterativeEnd - iterativeStart); // TOTAL waktu
    
    // Waktu untuk rekursif - TOTAL WAKTU untuk iterations eksekusi
    const recursiveStart = performance.now();
    let recursiveValid;
    for (let i = 0; i < iterations; i++) {
        recursiveValid = luhnRecursive(cleanCardNumber);
    }
    const recursiveEnd = performance.now();
    const recursiveTime = (recursiveEnd - recursiveStart); // TOTAL waktu
    
    // Tampilkan hasil (total waktu)
    displaySingleTestResult(cleanCardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime);
    
    // Tambahkan ke grafik sebagai 1 card dengan TOTAL waktu
    addToChart(1, iterativeTime, recursiveTime, "1 card");
}

// Fungsi untuk menampilkan hasil tes single
function displaySingleTestResult(cardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('singleTestResult');
    const validityStatus = document.getElementById('validityStatus');
    
    // Format waktu untuk display
    const formatTime = (time) => {
        if (time < 0.001) return time.toFixed(6) + ' ms';
        if (time < 0.01) return time.toFixed(5) + ' ms';
        if (time < 0.1) return time.toFixed(4) + ' ms';
        if (time < 1) return time.toFixed(3) + ' ms';
        return time.toFixed(2) + ' ms';
    };
    
    document.getElementById('singleIterativeTime').textContent = formatTime(iterativeTime);
    document.getElementById('singleRecursiveTime').textContent = formatTime(recursiveTime);
    
    // Periksa konsistensi hasil
    if (iterativeValid && recursiveValid) {
        validityStatus.textContent = 'VALID';
        validityStatus.style.color = '#10b981';
    } else if (!iterativeValid && !recursiveValid) {
        validityStatus.textContent = 'INVALID';
        validityStatus.style.color = '#ef4444';
    } else {
        validityStatus.textContent = 'TIDAK KONSISTEN';
        validityStatus.style.color = '#f59e0b';
    }
    
    resultDiv.style.display = 'block';
}

// FUNGSI PROSES CSV - TOTAL WAKTU (KONSISTEN)
function processCSV() {
    const fileInput = document.getElementById('csvUpload');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        const cardNumbers = [];
        
        // Parse data
        for (let line of lines) {
            const cardNumber = line.trim().replace(/\D/g, '');
            if (cardNumber.length >= 13 && cardNumber.length <= 19) {
                cardNumbers.push(cardNumber);
            }
        }
        
        if (cardNumbers.length === 0) {
            alert('Tidak ada nomor kartu yang valid dalam file CSV');
            return;
        }
        
        // Gunakan beberapa iterasi untuk keakuratan
        const testIterations = 10;
        let totalIterativeTime = 0;
        let totalRecursiveTime = 0;
        let iterativeValidCount = 0;
        let recursiveValidCount = 0;
        
        // Jalankan beberapa iterasi untuk rata-rata
        for (let iter = 0; iter < testIterations; iter++) {
            // Jalankan pengujian dengan algoritma iteratif - TOTAL WAKTU
            const iterativeStart = performance.now();
            for (let cardNumber of cardNumbers) {
                if (luhnIterative(cardNumber)) {
                    if (iter === 0) iterativeValidCount++; // Hitung valid hanya di iterasi pertama
                }
            }
            const iterativeEnd = performance.now();
            totalIterativeTime += (iterativeEnd - iterativeStart);
            
            // Jalankan pengujian dengan algoritma rekursif - TOTAL WAKTU
            const recursiveStart = performance.now();
            for (let cardNumber of cardNumbers) {
                if (luhnRecursive(cardNumber)) {
                    if (iter === 0) recursiveValidCount++; // Hitung valid hanya di iterasi pertama
                }
            }
            const recursiveEnd = performance.now();
            totalRecursiveTime += (recursiveEnd - recursiveStart);
        }
        
        // Hitung rata-rata TOTAL waktu
        const avgIterativeTime = totalIterativeTime / testIterations;
        const avgRecursiveTime = totalRecursiveTime / testIterations;
        
        // Tampilkan hasil
        displayCSVResult(cardNumbers.length, iterativeValidCount, recursiveValidCount, avgIterativeTime, avgRecursiveTime);
        
        // Tambahkan ke grafik - TOTAL waktu untuk semua kartu
        addToChart(cardNumbers.length, avgIterativeTime, avgRecursiveTime, `${cardNumbers.length} cards`);
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menampilkan hasil CSV
function displayCSVResult(total, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('csvResult');
    
    // Format waktu untuk display
    const formatTime = (time) => {
        if (time < 0.001) return time.toFixed(6) + ' ms';
        if (time < 0.01) return time.toFixed(5) + ' ms';
        if (time < 0.1) return time.toFixed(4) + ' ms';
        if (time < 1) return time.toFixed(3) + ' ms';
        return time.toFixed(2) + ' ms';
    };
    
    document.getElementById('totalCards').textContent = total;
    document.getElementById('validCards').textContent = iterativeValid;
    document.getElementById('invalidCards').textContent = total - iterativeValid;
    document.getElementById('csvIterativeTime').textContent = formatTime(iterativeTime);
    document.getElementById('csvRecursiveTime').textContent = formatTime(recursiveTime);
    
    if (total > 0) {
        resultDiv.style.display = 'block';
    } else {
        resultDiv.style.display = 'none';
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

// Event listener untuk tombol reset chart
function resetChartOnly() {
    clearChart();
}

document.addEventListener('DOMContentLoaded', function() {
    initChart();
    updateChartInfo();
    
    const stepSlider = document.getElementById('dataSteps');
    const stepValue = document.getElementById('stepValue');
    stepSlider.addEventListener('input', function() {
        stepValue.textContent = this.value;
    });
    
    // Event listener untuk minData
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
    
    // Event listener untuk tombol reset all
    document.querySelector('.reset-btn').addEventListener('click', function() {
        resetAll();
    });
    
    // Event listener untuk tombol clear chart
    document.querySelector('.clear-btn').addEventListener('click', function() {
        resetChartOnly();
    });
    
    // Event listener untuk tombol single card test
    document.getElementById('testSingleBtn').addEventListener('click', testSingleCard);
    
    // Event listener untuk tombol process CSV
    document.getElementById('processCsvBtn').addEventListener('click', processCSV);
    
    // Event listener untuk enter di input single card
    document.getElementById('singleCardInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            testSingleCard();
        }
    });
});
