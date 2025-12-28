let timeChart;
let currentDataPoints = [];
let chartType = 'line';
let currentIterations = 5;
let isRunning = false;

// Variabel untuk tracking data
let singleCardTested = false;
let csvDataProcessed = false;

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
                    label: 'Iteratif (Random)',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Rekursif (Random)',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Iteratif (Single)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                },
                {
                    label: 'Rekursif (Single)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'triangle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                },
                {
                    label: 'Iteratif (CSV)',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'rect',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                },
                {
                    label: 'Rekursif (CSV)',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'rectRot',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
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
                            size: 11
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
    if (!timeChart) return;
    
    timeChart.data.labels = [];
    timeChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    
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
    
    // Reset input fields
    document.getElementById('singleCardInput').value = '';
    document.getElementById('csvUpload').value = '';
    document.getElementById('processCsvBtn').disabled = true;
    document.getElementById('processCsvBtn').innerHTML = '<i class="fas fa-cog"></i> Proses CSV';
    document.getElementById('singleTestResult').style.display = 'none';
    document.getElementById('csvResult').style.display = 'none';
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
        
        // Reset hanya dataset data acak
        timeChart.data.datasets[0].data = [];
        timeChart.data.datasets[1].data = [];
        timeChart.data.labels = [];
        timeChart.data.datasets[0].counts = [];
        timeChart.data.datasets[1].counts = [];
        
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
        
        // Jalankan tes untuk setiap ukuran data
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

// ============================================
// FUNGSI UNTUK INPUT DATA
// ============================================

// Event listener untuk upload CSV
document.getElementById('csvUpload').addEventListener('change', function(e) {
    const processBtn = document.getElementById('processCsvBtn');
    if (e.target.files.length > 0) {
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-cog"></i> Proses (' + e.target.files[0].name + ')';
    } else {
        processBtn.disabled = true;
        processBtn.innerHTML = '<i class="fas fa-cog"></i> Proses CSV';
    }
});

// Fungsi untuk menguji satu kartu (PERBAIKAN)
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
    
    // Jalankan pengujian dengan iterasi yang wajar
    const iterations = 10000; // Diperkecil agar lebih realistis
    
    // Waktu untuk iteratif
    const iterativeStart = performance.now();
    let iterativeValid;
    for (let i = 0; i < iterations; i++) {
        iterativeValid = luhnIterative(cleanCardNumber);
    }
    const iterativeEnd = performance.now();
    const iterativeTime = (iterativeEnd - iterativeStart) / iterations; // Waktu per eksekusi
    
    // Waktu untuk rekursif
    const recursiveStart = performance.now();
    let recursiveValid;
    for (let i = 0; i < iterations; i++) {
        recursiveValid = luhnRecursive(cleanCardNumber);
    }
    const recursiveEnd = performance.now();
    const recursiveTime = (recursiveEnd - recursiveStart) / iterations; // Waktu per eksekusi
    
    // Tampilkan hasil
    displaySingleTestResult(cleanCardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime);
    
    // Tambahkan ke grafik sebagai titik terpisah
    addSingleCardToChart(cleanCardNumber.length, iterativeTime, recursiveTime);
}

// Fungsi untuk menampilkan hasil tes single (PERBAIKAN)
function displaySingleTestResult(cardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('singleTestResult');
    const validityStatus = document.getElementById('validityStatus');
    
    document.getElementById('singleIterativeTime').textContent = iterativeTime.toFixed(6) + ' ms';
    document.getElementById('singleRecursiveTime').textContent = recursiveTime.toFixed(6) + ' ms';
    
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

// Fungsi untuk memproses CSV (PERBAIKAN)
function processCSV() {
    const fileInput = document.getElementById('csvUpload');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        let totalCards = 0;
        let validCount = 0;
        const cardNumbers = [];
        
        // Parse data dari CSV
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Coba parse sebagai CSV dengan kolom card_number
            let cardNumber = '';
            
            if (line.includes(',')) {
                // Format CSV dengan koma
                const parts = line.split(',');
                // Cari bagian yang berisi angka (bisa jadi card_number)
                for (let part of parts) {
                    const cleaned = part.trim().replace(/\D/g, '');
                    if (cleaned.length >= 13 && cleaned.length <= 19) {
                        cardNumber = cleaned;
                        break;
                    }
                }
            } else {
                // Format satu kolom saja
                cardNumber = line.replace(/\D/g, '');
            }
            
            if (cardNumber.length >= 13 && cardNumber.length <= 19) {
                cardNumbers.push(cardNumber);
                totalCards++;
            }
        }
        
        if (cardNumbers.length === 0) {
            alert('Tidak ada nomor kartu yang valid dalam file CSV');
            return;
        }
        
        // Jalankan pengujian dengan algoritma iteratif
        const iterations = 1000;
        const iterativeStart = performance.now();
        let iterativeValidCount = 0;
        
        for (let cardNumber of cardNumbers) {
            if (luhnIterative(cardNumber)) {
                iterativeValidCount++;
            }
        }
        const iterativeEnd = performance.now();
        const iterativeTime = (iterativeEnd - iterativeStart) / cardNumbers.length; // Rata-rata per kartu
        
        // Jalankan pengujian dengan algoritma rekursif
        const recursiveStart = performance.now();
        let recursiveValidCount = 0;
        for (let cardNumber of cardNumbers) {
            if (luhnRecursive(cardNumber)) {
                recursiveValidCount++;
            }
        }
        const recursiveEnd = performance.now();
        const recursiveTime = (recursiveEnd - recursiveStart) / cardNumbers.length; // Rata-rata per kartu
        
        // Tampilkan hasil
        displayCSVResult(cardNumbers.length, iterativeValidCount, recursiveValidCount, iterativeTime, recursiveTime);
        
        // Tambahkan ke grafik
        if (cardNumbers.length > 0) {
            const sampleLength = cardNumbers[0].length; // Ambil panjang kartu pertama sebagai representasi
            addCsvToChart(sampleLength, iterativeTime, recursiveTime);
        }
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menampilkan hasil CSV (PERBAIKAN)
function displayCSVResults(results) {
    const resultDiv = document.getElementById('csvResult');
    
    if (!resultDiv) {
        console.error('Element csvResult tidak ditemukan!');
        return;
    }
    
    try {
        const fileNameSpan = document.getElementById('csvFileName');
        const totalCardsSpan = document.getElementById('totalCards');
        const validCardsSpan = document.getElementById('validCards');
        const invalidCardsSpan = document.getElementById('invalidCards');
        const iterativeTimeSpan = document.getElementById('csvIterativeTime');
        const recursiveTimeSpan = document.getElementById('csvRecursiveTime');
        
        // Validasi semua element
        if (!fileNameSpan || !totalCardsSpan || !validCardsSpan || !invalidCardsSpan || !iterativeTimeSpan || !recursiveTimeSpan) {
            console.error('Satu atau lebih element hasil CSV tidak ditemukan!');
            return;
        }
        
        // Update data utama
        fileNameSpan.textContent = currentCsvFileName || 'Unknown File';
        totalCardsSpan.textContent = results.totalCards || 0;
        validCardsSpan.textContent = results.iterative?.validCount || 0;
        invalidCardsSpan.textContent = (results.totalCards || 0) - (results.iterative?.validCount || 0);
        
        // Format waktu
        const iterativeAvg = results.iterative?.avgTime || (results.iterative?.totalTime / (results.totalCards || 1));
        const recursiveAvg = results.recursive?.avgTime || (results.recursive?.totalTime / (results.totalCards || 1));
        
        iterativeTimeSpan.textContent = `${(results.iterative?.totalTime || 0).toFixed(2)} ms (${iterativeAvg.toFixed(4)} ms/kartu)`;
        recursiveTimeSpan.textContent = `${(results.recursive?.totalTime || 0).toFixed(2)} ms (${recursiveAvg.toFixed(4)} ms/kartu)`;
        
        // ... sisa kode untuk menampilkan sample ...
        
    } catch (error) {
        console.error('Error displaying CSV results:', error);
        alert('Terjadi kesalahan saat menampilkan hasil CSV');
    }
}
// ============================================
// FUNGSI UNTUK MENAMBAHKAN DATA KE GRAFIK
// ============================================

// Fungsi untuk menambahkan single card ke grafik
function addSingleCardToChart(dataLength, iterativeTime, recursiveTime) {
    // Tambahkan label jika belum ada
    const label = `S-${dataLength}`;
    const existingIndex = timeChart.data.labels.indexOf(label);
    
    if (existingIndex === -1) {
        timeChart.data.labels.push(label);
        
        // Reset semua dataset untuk panjang label baru
        timeChart.data.datasets.forEach((dataset, index) => {
            // Isi dengan null untuk semua dataset kecuali yang sesuai
            if (index === 2 || index === 3) { // Dataset untuk single card
                dataset.data.push(index === 2 ? iterativeTime : recursiveTime);
            } else {
                dataset.data.push(null);
            }
        });
    } else {
        // Update data yang sudah ada
        timeChart.data.datasets[2].data[existingIndex] = iterativeTime;
        timeChart.data.datasets[3].data[existingIndex] = recursiveTime;
    }
    
    // Update skala chart
    updateChartScale();
    
    // Update chart
    timeChart.update();
    
    singleCardTested = true;
}


function addCsvToGraph(results) {
    // Pastikan timeChart sudah diinisialisasi
    if (!timeChart || !timeChart.data || !timeChart.data.datasets) {
        console.error('Chart belum diinisialisasi!');
        return;
    }
    
    if (results.totalCards === 0 || !results.iterative || !results.recursive) {
        console.error('Data results tidak valid!');
        return;
    }
    
    // Hitung panjang kartu rata-rata untuk posisi di grafik
    let avgLength = 0;
    let totalLength = 0;
    
    if (!csvCardNumbers || csvCardNumbers.length === 0) {
        console.error('Data kartu CSV kosong!');
        return;
    }
    
    csvCardNumbers.forEach(card => {
        totalLength += card.length;
    });
    
    avgLength = Math.round(totalLength / csvCardNumbers.length);
    
    // Pastikan datasets ada dan cukup panjang
    const datasets = timeChart.data.datasets;
    if (datasets.length < 6) {
        console.error('Dataset chart tidak lengkap!');
        return;
    }
    
    // Dataset 4: Iteratif (CSV)
    // Dataset 5: Rekursif (CSV)
    
    // Inisialisasi arrays jika belum ada
    if (!timeChart.data.labels) timeChart.data.labels = [];
    datasets.forEach(dataset => {
        if (!dataset.data) dataset.data = [];
    });
    
    // Cari apakah sudah ada data untuk panjang ini
    const label = `CSV-${avgLength}`;
    let existingIndex = -1;
    
    if (timeChart.data.labels && Array.isArray(timeChart.data.labels)) {
        existingIndex = timeChart.data.labels.indexOf(label);
    }
    
    if (existingIndex === -1) {
        // Tambahkan label baru
        timeChart.data.labels.push(label);
        
        console.log('Menambahkan label baru:', label, 'ke chart');
        
        // Tambahkan data ke semua dataset
        datasets.forEach((dataset, index) => {
            if (!dataset.data) dataset.data = [];
            
            if (index === 4) { // Iteratif CSV
                dataset.data.push(results.iterative.avgTime || results.iterative.totalTime / csvCardNumbers.length);
                console.log('Dataset 4 (Iteratif CSV):', dataset.data);
            } else if (index === 5) { // Rekursif CSV
                dataset.data.push(results.recursive.avgTime || results.recursive.totalTime / csvCardNumbers.length);
                console.log('Dataset 5 (Rekursif CSV):', dataset.data);
            } else {
                // Untuk dataset lain, tambahkan null untuk menjaga alignment
                dataset.data.push(null);
            }
        });
    } else {
        // Update data yang sudah ada
        console.log('Update data existing di index:', existingIndex);
        
        if (datasets[4] && datasets[4].data) {
            datasets[4].data[existingIndex] = results.iterative.avgTime || results.iterative.totalTime / csvCardNumbers.length;
        }
        
        if (datasets[5] && datasets[5].data) {
            datasets[5].data[existingIndex] = results.recursive.avgTime || results.recursive.totalTime / csvCardNumbers.length;
        }
    }

    updateChartScale();
    
    // Update grafik
    try {
        timeChart.update('none'); // 'none' untuk update tanpa animasi
        console.log('Chart berhasil diupdate dengan data CSV');
    } catch (error) {
        console.error('Error updating chart:', error);
    }
    
    console.log('CSV data berhasil ditambahkan ke graph:', {
        avgLength,
        iterativeTime: results.iterative.avgTime,
        recursiveTime: results.recursive.avgTime,
        totalCards: results.totalCards
    });
}

// Fungsi untuk mengupdate skala grafik (DIPERBAIKI)
function updateChartScale() {
    if (!timeChart || !timeChart.data || !timeChart.data.datasets) {
        console.error('Chart tidak tersedia untuk update scale');
        return;
    }
    
    const allTimes = [];
    timeChart.data.datasets.forEach(dataset => {
        if (dataset && dataset.data && Array.isArray(dataset.data)) {
            dataset.data.forEach(time => {
                if (time !== null && time !== undefined && typeof time === 'number') {
                    allTimes.push(time);
                }
            });
        }
    });
    
    if (allTimes.length > 0) {
        const maxTime = Math.max(...allTimes);
        if (maxTime > 0) {
            // Pastikan options.scales.y ada
            if (!timeChart.options.scales) timeChart.options.scales = {};
            if (!timeChart.options.scales.y) timeChart.options.scales.y = {};
            
            timeChart.options.scales.y.suggestedMax = maxTime * 1.3;
            console.log('Updated chart scale, suggestedMax:', timeChart.options.scales.y.suggestedMax);
        }
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
            copyBtn.style.background = '';
        }, 2000);
    });
}

// Event listener untuk DOM
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    updateChartInfo();
    
    const stepSlider = document.getElementById('dataSteps');
    const stepValue = document.getElementById('stepValue');
    stepSlider.addEventListener('input', function() {
        stepValue.textContent = this.value;
    });
    
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
    
    document.querySelector('.reset-btn').addEventListener('click', function() {
        resetAll();
    });
    
    document.querySelector('.clear-btn').addEventListener('click', function() {
        clearChart();
    });
});


