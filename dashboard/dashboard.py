import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('../data/resultados_predicoesV2.csv')

st.title('Dashboard Antifraude com IA')

total = len(df)
total_fraudes_real = df['fraude_real'].sum()
total_fraudes_pred = df['fraude_predita'].sum()
detecao_certa = ((df['fraude_real'] == 1) & (df['fraude_predita'] == 1)).sum()
falso_positivo = ((df['fraude_real'] == 0) & (df['fraude_predita'] == 1)).sum()
falso_negativo = ((df['fraude_real'] == 1) & (df['fraude_predita'] == 0)).sum()

st.metric('Transações analisadas', total)
st.metric('Fraudes reais', int(total_fraudes_real))
st.metric('Fraudes detectadas pelo modelo', int(total_fraudes_pred))
st.metric('Fraudes detectadas corretamente', int(detecao_certa))
st.metric('Falsos positivos', int(falso_positivo))
st.metric('Falsos negativos', int(falso_negativo))

# Gráfico de barra
fig, ax = plt.subplots()
ax.bar(['Fraudes Reais', 'Fraudes Detectadas'], [total_fraudes_real, total_fraudes_pred], color=['#F44336', '#1976D2'])
ax.set_ylabel('Quantidade')
st.pyplot(fig)

# Gráfico de pizza
st.subheader('Distribuição das Previsões do Modelo')
fraudes = df['fraude_predita'].value_counts().sort_index()
labels = ['Legítimas', 'Fraudes']
fig2, ax2 = plt.subplots()
ax2.pie(fraudes, labels=labels, autopct='%1.1f%%', colors=['#4CAF50', '#F44336'])
st.pyplot(fig2)

# Lista das principais fraudes detectadas
st.subheader('Transações identificadas como Fraude')
fraudes_detectadas = df[df['fraude_predita'] == 1]
st.dataframe(fraudes_detectadas.head(20))

st.markdown("""
---
Dashboard para de detecção de fraudes.
""")