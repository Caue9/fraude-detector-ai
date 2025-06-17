import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

df = pd.read_csv('../data/dataset_transacoes.csv')

features = ['valor', 'score_risco']
X = df[features]
y = df['fraude']

# Train/Test
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

indices_teste = X_test.index

extras = df.loc[indices_teste, ['id_transacao', 'localizacao', 'dispositivo']].reset_index(drop=True)

results = extras.copy()
results['valor'] = X_test['valor'].values
results['score_risco'] = X_test['score_risco'].values
results['fraude_real'] = y_test.values
results['fraude_predita'] = y_pred

results.to_csv('../data/resultados_predicoes.csv', index=False)

print('Arquivo de resultados salvo com sucesso!')
print(results.head())