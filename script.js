// Variabel untuk single card test
let singleCardTestCount = 0;

// Fungsi testSingleCard yang diperbaiki
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
    
    // Tambahkan ke grafik utama (sebagai tes baru)
    addToMainChartAsTest(iterativeTime, recursiveTime);
}

// Fungsi untuk menambahkan ke grafik utama sebagai TES (bukan berdasarkan digit)
function addToMainChartAsTest(iterativeTime, recursiveTime) {
    // Tambahkan label baru (tes ke-berapa)
    const testNumber = singleCardTestCount + 1;
    singleCardTestCount = testNumber;
    
    // Cek apakah grafik utama kosong atau berisi data range digit
    if (currentDataPoints.length > 0 && typeof currentDataPoints[0] === 'number') {
        // Jika grafik utama berisi data range digit, kita perlu reset
        clearChart();
        singleCardTestCount = 1; // Reset counter
    }
    
    // Tambahkan ke grafik
    timeChart.data.labels.push(`Tes ${testNumber}`);
    timeChart.data.datasets[0].data.push(iterativeTime);
    timeChart.data.datasets[1].data.push(recursiveTime);
    
    // Update judul dan skala
    timeChart.options.scales.x.title.text = 'Nomor Tes';
    timeChart.options.plugins.title = {
        display: true,
        text: 'Single Card Test',
        color: '#f1f5f9',
        font: {
            size: 16,
            weight: 'bold'
        }
    };
    
    // Auto adjust skala Y
    const allData = [...timeChart.data.datasets[0].data, ...timeChart.data.datasets[1].data];
    const maxValue = Math.max(...allData);
    timeChart.options.scales.y.suggestedMax = maxValue * 1.2; // 20% lebih tinggi
    
    timeChart.update();
    
    // Update info chart
    document.getElementById('dataPoints').textContent = testNumber;
    document.getElementById('chartStatus').textContent = 'Single Card Test';
    document.getElementById('chartStatus').style.color = '#10b981';
    
    // Update hasil keseluruhan
    updateResults(iterativeTime, recursiveTime);
    
    // Simpan sebagai tes (bukan digit)
    currentDataPoints.push({
        type: 'singleTest',
        testNumber: testNumber,
        iterativeTime: iterativeTime,
        recursiveTime: recursiveTime
    });
}

// Fungsi untuk processCSV yang diperbaiki
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
        
        // Tambahkan ke grafik utama sebagai tes CSV
        addToMainChartAsCSVTest(cardNumbers.length, iterativeTime, recursiveTime);
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menambahkan CSV test ke grafik utama
function addToMainChartAsCSVTest(totalCards, iterativeTime, recursiveTime) {
    // Cek apakah grafik utama kosong atau berisi data range digit
    if (currentDataPoints.length > 0 && typeof currentDataPoints[0] === 'number') {
        // Jika grafik utama berisi data range digit, kita perlu reset
        clearChart();
    }
    
    // Hitung tes CSV ke-berapa
    const csvTestCount = currentDataPoints.filter(p => p.type === 'csvTest').length + 1;
    
    // Tambahkan ke grafik
    timeChart.data.labels.push(`CSV ${csvTestCount}`);
    timeChart.data.datasets[0].data.push(iterativeTime);
    timeChart.data.datasets[1].data.push(recursiveTime);
    
    // Update judul dan skala
    timeChart.options.scales.x.title.text = 'Tes CSV';
    timeChart.options.plugins.title = {
        display: true,
        text: 'CSV Test (' + totalCards + ' kartu)',
        color: '#f1f5f9',
        font: {
            size: 16,
            weight: 'bold'
        }
    };
    
    // Auto adjust skala Y
    const allData = [...timeChart.data.datasets[0].data, ...timeChart.data.datasets[1].data];
    const maxValue = Math.max(...allData);
    timeChart.options.scales.y.suggestedMax = maxValue * 1.2;
    
    timeChart.update();
    
    // Update info chart
    document.getElementById('dataPoints').textContent = currentDataPoints.length + 1;
    document.getElementById('chartStatus').textContent = 'CSV Test';
    document.getElementById('chartStatus').style.color = '#3b82f6';
    
    // Update hasil keseluruhan
    updateResults(iterativeTime, recursiveTime);
    
    // Simpan sebagai tes CSV
    currentDataPoints.push({
        type: 'csvTest',
        testNumber: csvTestCount,
        totalCards: totalCards,
        iterativeTime: iterativeTime,
        recursiveTime: recursiveTime
    });
}

// Modifikasi fungsi runTest untuk reset singleCardTestCount
async function runTest() {
    // Reset single card test count saat menjalankan test range
    singleCardTestCount = 0;
    
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
        
        // Reset chart data
        timeChart.data.labels = [];
        timeChart.data.datasets[0].data = [];
        timeChart.data.datasets[1].data = [];
        
        // Reset title dan skala ke default
        timeChart.options.scales.x.title.text = 'Panjang Data';
        timeChart.options.plugins.title = {
            display: false
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
        
        // Simpan sebagai data range (angka saja)
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

// Modifikasi fungsi clearChart
function clearChart() {
    timeChart.data.labels = [];
    timeChart.data.datasets[0].data = [];
    timeChart.data.datasets[1].data = [];
    
    // Reset title dan skala
    timeChart.options.scales.x.title.text = 'Panjang Data';
    timeChart.options.plugins.title = {
        display: false
    };
    timeChart.options.scales.y.min = 0;
    timeChart.options.scales.y.suggestedMax = 10;
    
    timeChart.update();
    currentDataPoints = [];
    singleCardTestCount = 0;
    updateChartInfo();
    updateResults(0, 0);
    
    // Reset status
    document.getElementById('chartStatus').textContent = 'Siap';
    document.getElementById('chartStatus').style.color = '';
}

// Modifikasi fungsi resetAll
function resetAll() {
    clearChart();
    
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
}

// Inisialisasi chart dengan title
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
                    display: false // Awalnya tidak ditampilkan
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
