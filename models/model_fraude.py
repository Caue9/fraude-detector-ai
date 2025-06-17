import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

df = pd.read_csv('../data/dataset_transacoes.csv')

features = ['valor', 'score_risco']
X = df[features]
y = df['fraude']

total_fraudes = int(df['fraude'].sum())
perc_fraudes = 100 * total_fraudes / len(df)
print(f'Total de fraudes no dataset: {total_fraudes} ({perc_fraudes:.2f}%)')

if perc_fraudes < 5:
    print("Identificado poucas fraudes, possivel modelo falho.")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = IsolationForest(contamination=0.07, random_state=42)
model.fit(X_train)

y_pred = model.predict(X_test)
y_pred = np.where(y_pred == -1, 1, 0)

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, zero_division=0)
rec = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)

print(f'Accuracy: {acc:.2f}')
print(f'Precision: {prec:.2f}')
print(f'Recall: {rec:.2f}')
print(f'F1-score: {f1:.2f}')

results = X_test.copy()
results['fraude_real'] = y_test.values
results['fraude_predita'] = y_pred
results.to_csv('../data/resultados_predicoesV2.csv', index=False)

print('Fraudes no conjunto de teste:', int(y_test.sum()))