import pandas as pd
import numpy as np
import random
from faker import Faker

fake = Faker('pt_BR')
np.random.seed(42)

n = 1000
percentual_fraude = 0.10

ids = np.arange(1, n + 1)

valores = np.random.exponential(scale=4000, size=n).round(2)

for i in random.sample(range(n), k=int(n*0.03)):
    valores[i] *= random.uniform(5, 12)

datas = [fake.date_time_this_year() for _ in range(n)]
localizacoes = np.random.choice(['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Londres', 'Nova York', 'Tóquio'], n)
dispositivos = np.random.choice(['Mobile', 'Desktop', 'Tablet'], n, p=[0.6, 0.3, 0.1])
meios = np.random.choice(['Cartão Crédito', 'Cartão Débito', 'PIX', 'Boleto'], n)

score_risco = (valores / valores.max()) * 0.6
score_risco += np.where(pd.Series(localizacoes).isin(['Londres', 'Nova York', 'Tóquio']), 0.2, 0)
score_risco += np.where(dispositivos == 'Desktop', 0.1, 0)
score_risco += np.where(valores > np.percentile(valores, 85), 0.15, 0)  # Bônus para valores altos
score_risco += np.random.uniform(0, 0.2, n)
score_risco = np.clip(score_risco, 0, 1).round(2)

limite = np.percentile(score_risco, 90)
fraude = (score_risco > limite).astype(int)

df = pd.DataFrame({
    'id_transacao': ids,
    'valor': valores,
    'data_hora': datas,
    'localizacao': localizacoes,
    'dispositivo': dispositivos,
    'meio_pagamento': meios,
    'score_risco': score_risco,
    'fraude': fraude
})

df.to_csv('../data/dataset_transacoes.csv', index=False)
print('CSV gerado. Total de fraudes:', df["fraude"].sum())
print('Valor médio das despesas: R$', round(df["valor"].mean(),2))
print('Maior despesa: R$', round(df["valor"].max(),2))