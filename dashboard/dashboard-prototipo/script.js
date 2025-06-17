document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;
    if (user === 'admin' && pass === '123456') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'flex';
    } else {
        document.getElementById('login-error').textContent = "Usuário ou senha inválidos!";
    }
});


document.querySelectorAll('.sidebar nav ul li').forEach(function(item) {
    item.addEventListener('click', function() {
        document.querySelectorAll('.sidebar nav ul li').forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('transacoes-section').style.display = 'none';

        if (this.dataset.section === 'dashboard') {
            document.getElementById('dashboard-section').style.display = 'block';
        } else if (this.dataset.section === 'transacoes') {
            document.getElementById('transacoes-section').style.display = 'block';
        } else if (this.dataset.section === 'logout') {
            document.getElementById('app-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            document.getElementById('login-form').reset();
            document.getElementById('login-error').textContent = "";
        }
    });
});


window.onload = function() {

    var ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Fraudes Reais', 'Fraudes Detectadas'],
            datasets: [{
                data: [90, 53],
                backgroundColor: ['#d32f2f', '#1976D2']
            }]
        },
        options: {
            responsive: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 10 } }
            }
        }
    });

    var ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Legítimas', 'Fraudes'],
            datasets: [{
                data: [910, 90],
                backgroundColor: ['#4CAF50', '#d32f2f']
            }]
        },
        options: {
            responsive: false
        }
    });
};

const csvURL = "https://raw.githubusercontent.com/Caue9/fraude-detector-ai/refs/heads/main/data/resultados_predicoesV2.csv";

function carregarTransacoesDoGithub() {
    Papa.parse(csvURL, {
        download: true,
        header: true,
        complete: function(results) {
            const dados = results.data;

            const tbody = document.querySelector("#transacoes-section tbody");
            tbody.innerHTML = "";

            dados.slice(0, 10).forEach(row => {
                const tr = document.createElement("tr");
                if (row.fraude == "1") tr.classList.add("fraude");
                tr.innerHTML = `
                    <td>${row.id_transacao}</td>
                    <td>${parseFloat(row.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                    <td>${row.localizacao}</td>
                    <td>${row.dispositivo}</td>
                    <td>${row.score_risco}</td>
                    <td>${row.fraude == "1" ? "FRAUDE" : "Legítima"}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
}


window.onload = function() {

    carregarTransacoesDoGithub();

};
