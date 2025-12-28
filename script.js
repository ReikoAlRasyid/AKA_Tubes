// Tambahkan variabel baru di bagian atas
let singleCardChart;
let csvChart;
let singleCardDataPoints = [];
let csvDataPoints = [];

// Fungsi inisialisasi grafik single card
function initSingleCardChart() {
    const ctx = document.getElementById('singleCardChart').getContext('2d');
    singleCardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Iteratif',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                },
                {
                    label: 'Rekursif',
                    data: [],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
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
                title: {
                    display: true,
                    text: 'Single Card Test',
                    color: '#f1f5f9',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Nomor Tes',
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
                    min: 0
                }
            }
        }
    });
}

// Fungsi inisialisasi grafik CSV
function initCSVChart() {
    const ctx = document.getElementById('csvChart').getContext('2d');
    csvChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Iteratif',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                },
                {
                    label: 'Rekursif',
                    data: [],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
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
                title: {
                    display: true,
                    text: 'CSV Test',
                    color: '#f1f5f9',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tes CSV',
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
                    min: 0
                }
            }
        }
    });
}

// Modifikasi fungsi testSingleCard untuk update grafik
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
    
    // Jalankan pengujian
    const iterations = 1000;
    
    // Waktu untuk iteratif
    const iterativeStart = performance.now();
    let iterativeValid;
    for (let i = 0; i < iterations; i++) {
        iterativeValid = luhnIterative(cleanCardNumber);
    }
    const iterativeEnd = performance.now();
    const iterativeTime = (iterativeEnd - iterativeStart);
    
    // Waktu untuk rekursif
    const recursiveStart = performance.now();
    let recursiveValid;
    for (let i = 0; i < iterations; i++) {
        recursiveValid = luhnRecursive(cleanCardNumber);
    }
    const recursiveEnd = performance.now();
    const recursiveTime = (recursiveEnd - recursiveStart);
    
    // Tampilkan hasil
    displaySingleTestResult(cleanCardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime);
    
    // Tambahkan ke grafik single card
    addToSingleCardChart(iterativeTime, recursiveTime);
    
    // Tambahkan juga ke grafik utama
    addToMainChart(cleanCardNumber.length, iterativeTime, recursiveTime);
}

// Fungsi untuk menambahkan data ke grafik single card
function addToSingleCardChart(iterativeTime, recursiveTime) {
    // Tambahkan label baru (nomor urut tes)
    const testNumber = singleCardChart.data.labels.length + 1;
    singleCardChart.data.labels.push(`Tes ${testNumber}`);
    
    // Tambahkan data
    singleCardChart.data.datasets[0].data.push(iterativeTime);
    singleCardChart.data.datasets[1].data.push(recursiveTime);
    
    // Update chart
    singleCardChart.update();
    
    // Simpan data point
    singleCardDataPoints.push({
        testNumber: testNumber,
        iterativeTime: iterativeTime,
        recursiveTime: recursiveTime,
        timestamp: new Date().toLocaleTimeString()
    });
}

// Fungsi untuk menambahkan data ke grafik CSV
function addToCSVChart(totalCards, iterativeTime, recursiveTime) {
    // Tambahkan label baru (nama file atau urutan tes)
    const testNumber = csvChart.data.labels.length + 1;
    csvChart.data.labels.push(`CSV ${testNumber} (${totalCards} kartu)`);
    
    // Tambahkan data
    csvChart.data.datasets[0].data.push(iterativeTime);
    csvChart.data.datasets[1].data.push(recursiveTime);
    
    // Update chart
    csvChart.update();
    
    // Simpan data point
    csvDataPoints.push({
        testNumber: testNumber,
        totalCards: totalCards,
        iterativeTime: iterativeTime,
        recursiveTime: recursiveTime,
        timestamp: new Date().toLocaleTimeString()
    });
}

// Modifikasi fungsi processCSV untuk update grafik
function processCSV() {
    const fileInput = document.getElementById('csvUpload');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        let validCount = 0;
        let invalidCount = 0;
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
        
        // Jalankan pengujian dengan algoritma iteratif
        const iterativeStart = performance.now();
        let iterativeValidCount = 0;
        for (let cardNumber of cardNumbers) {
            if (luhnIterative(cardNumber)) {
                iterativeValidCount++;
            }
        }
        const iterativeEnd = performance.now();
        const iterativeTime = (iterativeEnd - iterativeStart);
        
        // Jalankan pengujian dengan algoritma rekursif
        const recursiveStart = performance.now();
        let recursiveValidCount = 0;
        for (let cardNumber of cardNumbers) {
            if (luhnRecursive(cardNumber)) {
                recursiveValidCount++;
            }
        }
        const recursiveEnd = performance.now();
        const recursiveTime = (recursiveEnd - recursiveStart);
        
        // Tampilkan hasil
        displayCSVResult(cardNumbers.length, iterativeValidCount, recursiveValidCount, iterativeTime, recursiveTime);
        
        // Tambahkan ke grafik CSV
        addToCSVChart(cardNumbers.length, iterativeTime, recursiveTime);
        
        // Tambahkan juga ke grafik utama (rata-rata waktu per kartu)
        const avgIterativeTime = iterativeTime / cardNumbers.length;
        const avgRecursiveTime = recursiveTime / cardNumbers.length;
        addToMainChart(cardNumbers[0].length, avgIterativeTime, avgRecursiveTime);
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menambahkan ke grafik utama
function addToMainChart(dataLength, iterativeTime, recursiveTime) {
    // Cek apakah panjang data sudah ada di chart
    const existingIndex = timeChart.data.labels.indexOf(dataLength.toString());
    
    if (existingIndex >= 0) {
        // Update nilai yang sudah ada (rata-rata)
        const oldIterative = timeChart.data.datasets[0].data[existingIndex];
        const oldRecursive = timeChart.data.datasets[1].data[existingIndex];
        timeChart.data.datasets[0].data[existingIndex] = (oldIterative + iterativeTime) / 2;
        timeChart.data.datasets[1].data[existingIndex] = (oldRecursive + recursiveTime) / 2;
    } else {
        // Tambahkan titik baru
        timeChart.data.labels.push(dataLength.toString());
        timeChart.data.datasets[0].data.push(iterativeTime);
        timeChart.data.datasets[1].data.push(recursiveTime);
        
        // Update jumlah data points
        currentDataPoints.push(dataLength);
        updateChartInfo();
    }
    
    // Update chart
    timeChart.update();
    
    // Update hasil keseluruhan
    updateResults(iterativeTime, recursiveTime);
}

// Fungsi untuk menampilkan hasil tes single
function displaySingleTestResult(cardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('singleTestResult');
    const validityStatus = document.getElementById('validityStatus');
    
    document.getElementById('singleIterativeTime').textContent = iterativeTime.toFixed(2) + ' ms';
    document.getElementById('singleRecursiveTime').textContent = recursiveTime.toFixed(2) + ' ms';
    
    // Periksa konsistensi hasil
    if (iterativeValid && recursiveValid) {
        validityStatus.textContent = 'VALID';
        validityStatus.style.color = '#10b981';
    } else if (!iterativeValid && !recursiveValid) {
        validityStatus.textContent = 'INVALID';
        validityStatus.style.color = '#ef4444';
    } else {
        validityStatus.textContent = 'KONSISTEN';
        validityStatus.style.color = '#f59e0b';
    }
    
    resultDiv.style.display = 'block';
}

// Fungsi untuk menampilkan hasil CSV
function displayCSVResult(total, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('csvResult');
    
    document.getElementById('totalCards').textContent = total;
    document.getElementById('validCards').textContent = iterativeValid;
    document.getElementById('invalidCards').textContent = total - iterativeValid;
    document.getElementById('csvIterativeTime').textContent = iterativeTime.toFixed(2) + ' ms';
    document.getElementById('csvRecursiveTime').textContent = recursiveTime.toFixed(2) + ' ms';
    
    resultDiv.style.display = 'block';
}

// Modifikasi fungsi resetAll untuk reset semua grafik
function resetAll() {
    clearChart();
    
    // Reset single card chart
    if (singleCardChart) {
        singleCardChart.data.labels = [];
        singleCardChart.data.datasets[0].data = [];
        singleCardChart.data.datasets[1].data = [];
        singleCardChart.update();
    }
    
    // Reset CSV chart
    if (csvChart) {
        csvChart.data.labels = [];
        csvChart.data.datasets[0].data = [];
        csvChart.data.datasets[1].data = [];
        csvChart.update();
    }
    
    // Reset data points
    singleCardDataPoints = [];
    csvDataPoints = [];
    
    // Reset input values
    document.getElementById('minData').value = 0;
    document.getElementById('maxData').value = 1000;
    document.getElementById('dataSteps').value = 10;
    document.getElementById('stepValue').textContent = '10';
    document.getElementById('singleCardInput').value = '';
    
    // Reset file input
    document.getElementById('csvUpload').value = '';
    document.getElementById('processCsvBtn').disabled = true;
    document.getElementById('processCsvBtn').innerHTML = '<i class="fas fa-cog"></i> Proses';
    
    // Hide result sections
    document.getElementById('singleTestResult').style.display = 'none';
    document.getElementById('csvResult').style.display = 'none';
    
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

// Inisialisasi semua grafik ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    initSingleCardChart();
    initCSVChart();
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
    
    // Event listener untuk tombol reset
    document.querySelector('.reset-btn').addEventListener('click', function() {
        resetAll();
    });
    
    // Event listener untuk tombol clear
    document.querySelector('.clear-btn').addEventListener('click', function() {
        clearChart();
    });
});

// Fungsi-fungsi yang sudah ada sebelumnya (tetap dipertahankan)
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
    
    timeChart.options.scales.y.min = 0;
    timeChart.options.scales.y.suggestedMax = 10;
    
    timeChart.update();
    currentDataPoints = [];
    updateChartInfo();
    updateResults(0, 0);
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
        
        if (minData < 0) minData = 0;
        if (maxData < minData) maxData = minData + 10;
        if (maxData > 50000) maxData = 50000;
        
        timeChart.data.labels = [];
        timeChart.data.datasets[0].data = [];
        timeChart.data.datasets[1].data = [];
        
        const iterativeTimes = [];
        const recursiveTimes = [];
        
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
        
        for (let idx = 0; idx < dataSizes.length; idx++) {
            const size = dataSizes[idx];
            statusElem.textContent = `Menguji titik ${idx + 1}/${dataSizes.length} (panjang ${size})...`;
            
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
            
            for (let iter = 0; iter < currentIterations; iter++) {
                const cardNumber = generateRandomCardNumber(size);
                
                const iterativeStart = performance.now();
                for (let i = 0; i < 1000; i++) {
                    luhnIterative(cardNumber);
                }
                const iterativeEnd = performance.now();
                iterativeTotal += (iterativeEnd - iterativeStart);
                
                const recursiveStart = performance.now();
                for (let i = 0; i < 1000; i++) {
                    luhnRecursive(cardNumber);
                }
                const recursiveEnd = performance.now();
                recursiveTotal += (recursiveEnd - recursiveStart);
            }
            
            const avgIterative = iterativeTotal / currentIterations;
            const avgRecursive = recursiveTotal / currentIterations;
            iterativeTimes.push(avgIterative);
            recursiveTimes.push(avgRecursive);
            
            timeChart.data.labels.push(size.toString());
            timeChart.data.datasets[0].data.push(avgIterative);
            timeChart.data.datasets[1].data.push(avgRecursive);
            timeChart.update();
            
            updateResults(avgIterative, avgRecursive);
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        const validIterativeTimes = iterativeTimes.filter(time => time > 0);
        const validRecursiveTimes = recursiveTimes.filter(time => time > 0);
        
        const overallIterative = validIterativeTimes.length > 0 
            ? validIterativeTimes.reduce((a, b) => a + b, 0) / validIterativeTimes.length 
            : 0;
        const overallRecursive = validRecursiveTimes.length > 0
            ? validRecursiveTimes.reduce((a, b) => a + b, 0) / validRecursiveTimes.length
            : 0;
        
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
