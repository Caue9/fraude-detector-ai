# Sistema Antifraude com IA

Bem-vindo ao repositório do **Dashboard Antifraude com IA**: um sistema feito para um projeto academico da Uninove.

---

##  Descrição do Projeto

O objetivo deste projeto é construir um sistema capaz de identificar fraudes em transações financeiras utilizando algoritmos de Machine Learning, apresentando resultados em um dashboard dinâmico e de fácil compreensão.  
O sistema automatiza a análise de milhares de transações, reduz riscos operacionais e fornece informações essenciais para o setor de prevenção a fraudes.

---

## Principais Funcionalidades

- **Login seguro** para acesso ao painel
- **Dashboard de visão geral** com indicadores chave (transações, fraudes reais, fraudes detectadas, precisão, recall)
- **Gráficos dinâmicos** de fraudes detectadas e distribuição das previsões
- **Tabela detalhada** das transações suspeitas (com filtro automático)
- **Leitura automática dos dados** via arquivo CSV (local ou google sheets)
- **Design responsivo e animado**, pronto para desktop e mobile

---

##  Tecnologias Utilizadas

- **Python (Pandas, Scikit-learn, Numpy):** para geração, análise e modelagem dos dados
- **HTML, CSS e JavaScript:** para a construção do dashboard dinâmico
- **Chart.js:** geração de gráficos interativos
- **PapaParse:** leitura de arquivos CSV no frontend
- **GitHub:** versionamento e hospedagem do projeto
- **Google Sheets:** hospedagem da base de daos (opcional)

---

##  Como Rodar Localmente

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/Caue9/fraude-detector-ai.git
    cd fraude-detector-ai
    ```
2. **Garanta que o arquivo `resultados_predicoesV2.csv` está na mesma pasta do dashboard**  
   (ou ajuste o caminho em `script.js`).

3. **Rode um servidor local para evitar bloqueio do navegador:**  
   Se tiver Python:
   ```bash
   python -m http.server 8080
