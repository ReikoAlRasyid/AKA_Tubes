let timeChart;
let currentDataPoints = [];
let chartType = 'line';
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
                },
                title: {
                    display: false
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
    
    timeChart.options.scales.x.title.text = 'Jumlah Data';
    timeChart.options.plugins.title = { display: false };
    timeChart.options.scales.y.min = 0;
    timeChart.options.scales.y.suggestedMax = 10;
    
    timeChart.update();
    currentDataPoints = [];
    updateChartInfo();
    updateResults(0, 0);
    
    document.getElementById('chartStatus').textContent = 'Siap';
    document.getElementById('chartStatus').style.color = '';
}

function resetAll() {
    clearChart();
    document.getElementById('minData').value = 0;
    document.getElementById('maxData').value = 1000;
    document.getElementById('dataSteps').value = 10;
    document.getElementById('stepValue').textContent = '10';
    document.getElementById('singleCardInput').value = '';
    
    document.getElementById('csvUpload').value = '';
    document.getElementById('processCsvBtn').disabled = true;
    document.getElementById('processCsvBtn').innerHTML = '<i class="fas fa-cog"></i> Proses';
    
    document.getElementById('singleTestResult').style.display = 'none';
    document.getElementById('csvResult').style.display = 'none';
    
    // Hilangkan reset iteration buttons
    
    document.getElementById('chartStatus').textContent = 'Siap';
    document.getElementById('chartStatus').style.color = '';
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
        let minData = parseInt(document.getElementById('minData').value) || 0;
        let maxData = parseInt(document.getElementById('maxData').value) || 1000;
        const steps = parseInt(document.getElementById('dataSteps').value) || 10;
        
        if (minData < 0) minData = 0;
        if (maxData < minData) maxData = minData + 10;
        if (maxData > 50000) maxData = 50000;
        
        timeChart.data.labels = [];
        timeChart.data.datasets[0].data = [];
        timeChart.data.datasets[1].data = [];
        
        timeChart.options.scales.x.title.text = 'Jumlah Data';
        timeChart.options.plugins.title = { 
            display: true,
            text: 'Random Test: Waktu vs Jumlah Data',
            color: '#f1f5f9',
            font: {
                size: 14,
                weight: 'bold'
            }
        };
        
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
            const dataCount = dataSizes[idx];
            statusElem.textContent = `Menguji titik ${idx + 1}/${dataSizes.length} (${dataCount} data)...`;
            
            if (dataCount === 0) {
                timeChart.data.labels.push('0');
                timeChart.data.datasets[0].data.push(0);
                timeChart.data.datasets[1].data.push(0);
                iterativeTimes.push(0);
                recursiveTimes.push(0);
                continue;
            }
            
            // Buat array dengan 'dataCount' nomor kartu
            const cardNumbers = [];
            for (let i = 0; i < dataCount; i++) {
                // Generate nomor kartu dengan panjang acak 13-19 digit
                const length = Math.floor(Math.random() * 7) + 13;
                cardNumbers.push(generateRandomCardNumber(length));
            }
            
            // Test Iteratif - 100 ITERASI
            const iterativeStart = performance.now();
            for (let i = 0; i < 100; i++) { // 100 ITERASI
                for (let cardNumber of cardNumbers) {
                    luhnIterative(cardNumber);
                }
            }
            const iterativeEnd = performance.now();
            const iterativeTime = iterativeEnd - iterativeStart;
            
            // Test Rekursif - 100 ITERASI
            const recursiveStart = performance.now();
            for (let i = 0; i < 100; i++) { // 100 ITERASI
                for (let cardNumber of cardNumbers) {
                    luhnRecursive(cardNumber);
                }
            }
            const recursiveEnd = performance.now();
            const recursiveTime = recursiveEnd - recursiveStart;
            
            iterativeTimes.push(iterativeTime);
            recursiveTimes.push(recursiveTime);
            
            timeChart.data.labels.push(`${dataCount}`);
            timeChart.data.datasets[0].data.push(iterativeTime);
            timeChart.data.datasets[1].data.push(recursiveTime);
            timeChart.update();
            
            updateResults(iterativeTime, recursiveTime);
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Hitung rata-rata keseluruhan
        let totalIterative = 0;
        let totalRecursive = 0;
        let count = 0;
        
        for (let i = 0; i < iterativeTimes.length; i++) {
            if (iterativeTimes[i] > 0 && recursiveTimes[i] > 0) {
                totalIterative += iterativeTimes[i];
                totalRecursive += recursiveTimes[i];
                count++;
            }
        }
        
        const overallIterative = count > 0 ? totalIterative / count : 0;
        const overallRecursive = count > 0 ? totalRecursive / count : 0;
        
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

// ================== SINGLE CARD TEST ==================

function testSingleCard() {
    const cardNumber = document.getElementById('singleCardInput').value.trim();
    
    if (!cardNumber) {
        alert('Masukkan nomor kartu terlebih dahulu');
        return;
    }
    
    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        alert('Nomor kartu harus 13-19 digit');
        return;
    }
    
    // 100 ITERASI
    const iterations = 100;
    
    const iterativeStart = performance.now();
    let iterativeValid;
    for (let i = 0; i < iterations; i++) {
        iterativeValid = luhnIterative(cleanCardNumber);
    }
    const iterativeEnd = performance.now();
    const iterativeTime = iterativeEnd - iterativeStart;
    
    const recursiveStart = performance.now();
    let recursiveValid;
    for (let i = 0; i < iterations; i++) {
        recursiveValid = luhnRecursive(cleanCardNumber);
    }
    const recursiveEnd = performance.now();
    const recursiveTime = recursiveEnd - recursiveStart;
    
    displaySingleTestResult(cleanCardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime);
    
    // Tambah ke chart
    addToChartAsTest(`Kartu`, iterativeTime, recursiveTime);
}

function addToChartAsTest(label, iterativeTime, recursiveTime) {
    // Cek apakah chart kosong atau ada data lain
    if (currentDataPoints.length > 0 && typeof currentDataPoints[0] === 'number') {
        clearChart();
    }
    
    timeChart.data.labels.push(label);
    timeChart.data.datasets[0].data.push(iterativeTime);
    timeChart.data.datasets[1].data.push(recursiveTime);
    
    timeChart.options.scales.x.title.text = 'Tes';
    timeChart.options.plugins.title = {
        display: true,
        text: 'Single Card Test',
        color: '#f1f5f9',
        font: {
            size: 16,
            weight: 'bold'
        }
    };
    
    const allData = [...timeChart.data.datasets[0].data, ...timeChart.data.datasets[1].data];
    const maxValue = Math.max(...allData);
    timeChart.options.scales.y.suggestedMax = maxValue * 1.2;
    
    timeChart.update();
    
    document.getElementById('dataPoints').textContent = timeChart.data.labels.length;
    document.getElementById('chartStatus').textContent = 'Single Card Test';
    document.getElementById('chartStatus').style.color = '#10b981';
    
    updateResults(iterativeTime, recursiveTime);
    
    currentDataPoints.push({
        type: 'singleTest',
        label: label,
        iterativeTime: iterativeTime,
        recursiveTime: recursiveTime
    });
}

function displaySingleTestResult(cardNumber, iterativeValid, recursiveValid, iterativeTime, recursiveTime) {
    const resultDiv = document.getElementById('singleTestResult');
    const validityStatus = document.getElementById('validityStatus');
    
    document.getElementById('singleIterativeTime').textContent = iterativeTime.toFixed(2) + ' ms';
    document.getElementById('singleRecursiveTime').textContent = recursiveTime.toFixed(2) + ' ms';
    
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

// ================== CSV TEST ==================

function processCSV() {
    const fileInput = document.getElementById('csvUpload');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Kumpulkan semua nomor kartu valid
        const allCards = [];
        for (let line of lines) {
            const cardNumber = line.trim().replace(/\D/g, '');
            if (cardNumber.length >= 13 && cardNumber.length <= 19) {
                allCards.push({
                    number: cardNumber,
                    length: cardNumber.length
                });
            }
        }
        
        if (allCards.length === 0) {
            alert('Tidak ada nomor kartu yang valid dalam file CSV');
            return;
        }
        
        // Langsung jalankan incremental test
        processCSVIncremental(allCards);
    };
    
    reader.readAsText(file);
}

function processCSVIncremental(allCards) {
    // Reset chart
    clearChart();
    timeChart.options.scales.x.title.text = 'Jumlah Data';
    timeChart.options.plugins.title = {
        display: true,
        text: `CSV Test: Waktu vs Jumlah Data (Total: ${allCards.length} data)`,
        color: '#f1f5f9',
        font: {
            size: 14,
            weight: 'bold'
        }
    };
    
    // Buat 10 titik data
    const totalDataPoints = 10;
    const stepSize = Math.floor(allCards.length / totalDataPoints);
    
    const statusElem = document.getElementById('chartStatus');
    statusElem.textContent = 'Memproses CSV...';
    statusElem.style.color = '#f59e0b';
    
    // Untuk setiap titik data
    for (let point = 1; point <= totalDataPoints; point++) {
        const dataCount = Math.min(point * stepSize, allCards.length);
        const testCards = allCards.slice(0, dataCount);
        
        // Update status
        statusElem.textContent = `Memproses ${point}/${totalDataPoints} (${dataCount} data)...`;
        
        // TEST ITERATIF - 100 ITERASI
        const iterativeStart = performance.now();
        for (let i = 0; i < 100; i++) { // 100 ITERASI
            for (let card of testCards) {
                luhnIterative(card.number);
            }
        }
        const iterativeEnd = performance.now();
        const avgIterative = iterativeEnd - iterativeStart;
        
        // TEST REKURSIF - 100 ITERASI
        const recursiveStart = performance.now();
        for (let i = 0; i < 100; i++) { // 100 ITERASI
            for (let card of testCards) {
                luhnRecursive(card.number);
            }
        }
        const recursiveEnd = performance.now();
        const avgRecursive = recursiveEnd - recursiveStart;
        
        // Tambahkan ke chart
        timeChart.data.labels.push(`${dataCount}`);
        timeChart.data.datasets[0].data.push(avgIterative);
        timeChart.data.datasets[1].data.push(avgRecursive);
        
        // Update chart
        timeChart.update();
        
        // Update hasil sementara
        updateResults(avgIterative, avgRecursive);
    }
    
    // Hitung statistik
    let totalValidIterative = 0;
    let totalValidRecursive = 0;
    let totalLength = 0;
    
    // Hitung validitas
    for (let card of allCards) {
        if (luhnIterative(card.number)) totalValidIterative++;
        if (luhnRecursive(card.number)) totalValidRecursive++;
        totalLength += card.length;
    }
    
    const avgLength = Math.round(totalLength / allCards.length);
    
    // Tampilkan hasil CSV
    displayCSVResult(
        allCards.length,
        totalValidIterative,
        totalValidRecursive,
        timeChart.data.datasets[0].data[timeChart.data.datasets[0].data.length - 1],
        timeChart.data.datasets[1].data[timeChart.data.datasets[1].data.length - 1],
        avgLength
    );
    
    // Update status akhir
    statusElem.textContent = `CSV Test Selesai (${allCards.length} data)`;
    statusElem.style.color = '#10b981';
    
    // Simpan data points
    currentDataPoints = [];
    for (let i = 0; i < totalDataPoints; i++) {
        const dataCount = Math.min((i + 1) * stepSize, allCards.length);
        currentDataPoints.push({
            type: 'csvIncremental',
            dataCount: dataCount,
            iterativeTime: timeChart.data.datasets[0].data[i],
            recursiveTime: timeChart.data.datasets[1].data[i]
        });
    }
    
    updateChartInfo();
}

function displayCSVResult(total, iterativeValid, recursiveValid, iterativeTime, recursiveTime, avgLength = 0) {
    const resultDiv = document.getElementById('csvResult');
    
    document.getElementById('totalCards').textContent = total;
    document.getElementById('validCards').textContent = iterativeValid;
    document.getElementById('invalidCards').textContent = total - iterativeValid;
    document.getElementById('csvIterativeTime').textContent = iterativeTime.toFixed(2) + ' ms';
    document.getElementById('csvRecursiveTime').textContent = recursiveTime.toFixed(2) + ' ms';
    
    // Tambahkan info avg length
    const avgDigitItem = document.getElementById('avgDigitItem');
    const avgDigitValue = document.getElementById('avgDigitValue');
    if (avgLength > 0) {
        avgDigitItem.style.display = 'flex';
        avgDigitValue.textContent = avgLength;
    } else {
        avgDigitItem.style.display = 'none';
    }
    
    resultDiv.style.display = 'block';
}

// ================== ALGORITHM FUNCTIONS ==================

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

// ================== EVENT LISTENERS ==================

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
    
    document.querySelector('.reset-btn').addEventListener('click', function() {
        resetAll();
    });
    
    document.querySelector('.clear-btn').addEventListener('click', function() {
        clearChart();
    });
});
