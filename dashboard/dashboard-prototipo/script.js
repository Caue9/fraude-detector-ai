const csvURL = "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/1TK7ZwFlrILKcHgmW2oGDrBJiVNWm4bX1UNMSItD5Z-Y/export?format=csv";
const loginUser = "caue";
const loginPass = "uninove";

let dadosTransacoes = [];
let barChart, pieChart, fraudeLocalChart, dispositivoChart, valorChart;

// ========== LOGIN ==========
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let user = document.getElementById('user').value.trim();
    let pass = document.getElementById('pass').value;
    if (user === loginUser && pass === loginPass) {
        document.getElementById('login-error').textContent = "";
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'flex';
        mostrarSecao("dashboard-section");
        carregarDashboard();
    } else {
        document.getElementById('login-error').textContent = "Usuário ou senha inválidos!";
    }
});

// ========== SIDEBAR NAV ==========
document.querySelectorAll('.sidebar nav ul li').forEach(function(item) {
    item.addEventListener('click', function() {
        document.querySelectorAll('.sidebar nav ul li').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        if (this.dataset.section === "logout") {
            document.getElementById('app-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            document.getElementById('login-form').reset();
            document.getElementById('login-error').textContent = "";
        } else {
            mostrarSecao(this.dataset.section);
            if (this.dataset.section === "dashboard-section") {
                atualizarKPIs(dadosTransacoes);
                desenharGraficos(dadosTransacoes);
            }
            if (this.dataset.section === "transacoes-section") {
                carregarTransacoes(dadosTransacoes);
            }
        }
    });
});

function mostrarSecao(secaoId) {
    document.querySelectorAll('main .fade-in-section').forEach(sec => {
        sec.style.display = "none";
        sec.classList.remove('active-section');
    });
    let sec = document.getElementById(secaoId);
    sec.style.display = "block";
    setTimeout(() => sec.classList.add('active-section'), 20);
}

// ========== DASHBOARD E DADOS ==========
function carregarDashboard() {
    Papa.parse(csvURL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            dadosTransacoes = results.data.filter(r => r.id_transacao && r.valor);
            atualizarKPIs(dadosTransacoes);
            desenharGraficos(dadosTransacoes);
            carregarTransacoes(dadosTransacoes);
        },
        error: function(err) {
            document.getElementById("tbody-transacoes").innerHTML =
                `<tr><td colspan="6">Erro ao carregar os dados.</td></tr>`;
        }
    });
}

function atualizarKPIs(data) {
    let total = data.length;
    let fraudes_reais = data.filter(t => Number(t.fraude_real) === 1).length;
    let fraudes_detectadas = data.filter(t => Number(t.fraude_predita) === 1).length;
    let vp = data.filter(t => Number(t.fraude_real) === 1 && Number(t.fraude_predita) === 1).length;
    let fp = data.filter(t => Number(t.fraude_real) === 0 && Number(t.fraude_predita) === 1).length;
    let fn = data.filter(t => Number(t.fraude_real) === 1 && Number(t.fraude_predita) === 0).length;
    let precisao = (vp + fp === 0) ? 0 : vp/(vp+fp);
    let recall = (vp + fn === 0) ? 0 : vp/(vp+fn);

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-fraudes-reais').textContent = fraudes_reais;
    document.getElementById('kpi-fraudes-detectadas').textContent = fraudes_detectadas;
    document.getElementById('kpi-precisao').textContent = precisao.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    document.getElementById('kpi-recall').textContent = recall.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function desenharGraficos(data) {
    // 1. Bar: fraudes reais x detectadas
    let fraudes_reais = data.filter(t => Number(t.fraude_real) === 1).length;
    let fraudes_detectadas = data.filter(t => Number(t.fraude_predita) === 1).length;
    if (barChart) barChart.destroy();
    barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Fraudes Reais', 'Fraudes Detectadas'],
            datasets: [{
                data: [fraudes_reais, fraudes_detectadas],
                backgroundColor: ['#d32f2f', '#1976D2']
            }]
        },
        options: {
            responsive: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 5 } } }
        }
    });

    // 2. Pizza: legítimas x fraudes detectadas
    let legitimas = data.filter(t => Number(t.fraude_predita) !== 1).length;
    let fraudes = fraudes_detectadas;
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Legítimas', 'Fraudes'],
            datasets: [{
                data: [legitimas, fraudes],
                backgroundColor: ['#4CAF50', '#d32f2f']
            }]
        },
        options: { responsive: false }
    });

    // 3. Barra: fraudes por localizacao (estado/cidade)
    let locais = {};
    data.forEach(row => {
        if (Number(row.fraude_predita) === 1) {
            let loc = row.localizacao ? row.localizacao : "Não Informado";
            locais[loc] = (locais[loc] || 0) + 1;
        }
    });
    if (fraudeLocalChart) fraudeLocalChart.destroy();
    fraudeLocalChart = new Chart(document.getElementById('fraudeLocalChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(locais),
            datasets: [{
                label: "Fraudes Detectadas",
                data: Object.values(locais),
                backgroundColor: '#d32f2f'
            }]
        },
        options: {
            responsive: false,
            plugins: { legend: { display: false } },
            indexAxis: 'y',
            scales: { x: { beginAtZero: true } }
        }
    });

    // 4. Pizza: por tipo de dispositivo (fraudes)
    let dispositivos = {};
    data.forEach(row => {
        if (Number(row.fraude_predita) === 1) {
            let disp = row.dispositivo ? row.dispositivo : "Desconhecido";
            dispositivos[disp] = (dispositivos[disp] || 0) + 1;
        }
    });
    if (dispositivoChart) dispositivoChart.destroy();
    dispositivoChart = new Chart(document.getElementById('dispositivoChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(dispositivos),
            datasets: [{
                data: Object.values(dispositivos),
                backgroundColor: ['#1976D2', '#4CAF50', '#FFC107', '#E91E63', '#607D8B']
            }]
        },
        options: { responsive: false }
    });

    // 5. Histograma de valor
    let valores = data.map(row => Number(row.valor)).filter(v => !isNaN(v));
    let bins = Array(10).fill(0);
    let min = Math.min(...valores), max = Math.max(...valores);
    let binSize = (max - min) / bins.length || 1;
    valores.forEach(v => {
        let idx = Math.min(Math.floor((v - min) / binSize), bins.length - 1);
        bins[idx]++;
    });
    let binLabels = bins.map((_,i) => `R$${(min + i*binSize).toFixed(0)}-R$${(min + (i+1)*binSize).toFixed(0)}`);
    if (valorChart) valorChart.destroy();
    valorChart = new Chart(document.getElementById('valorChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Qtde',
                data: bins,
                backgroundColor: '#1976D2'
            }]
        },
        options: {
            responsive: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, stepSize: 1 } }
        }
    });
}

function carregarTransacoes(data) {
    const tbody = document.getElementById("tbody-transacoes");
    tbody.innerHTML = "";
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Nenhuma transação encontrada.</td></tr>`;
        return;
    }
    data.forEach(row => {
        const tr = document.createElement("tr");
        if (Number(row.fraude_real) === 1 || Number(row.fraude_predita) === 1) tr.classList.add("fraude");
        tr.innerHTML = `
            <td>${row.id_transacao}</td>
            <td>${parseFloat(row.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
            <td>${row.localizacao}</td>
            <td>${row.dispositivo}</td>
            <td>${row.score_risco}</td>
            <td>${Number(row.fraude_predita) === 1 ? "<b>FRAUDE</b>" : "Legítima"}</td>
        `;
        tbody.appendChild(tr);
    });
}
