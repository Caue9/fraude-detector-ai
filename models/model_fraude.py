import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

df = pd.read_csv('../data/dataset_transacoes.csv')

features = ['valor', 'score_risco']
X = df[features]

y = df['fraude']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = IsolationForest(contamination=0.07, random_state=42)  # Aproximadamente % de fraudes no dataset
model.fit(X_train)

y_pred = model.predict(X_test)

y_pred = np.where(y_pred == -1, 1, 0)

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred)
rec = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f'Accuracy: {acc:.2f}')
print(f'Precision: {prec:.2f}')
print(f'Recall: {rec:.2f}')
print(f'F1-score: {f1:.2f}')

results = X_test.copy()
results['fraude_real'] = y_test.values
results['fraude_predita'] = y_pred
results.to_csv('../data/resultados_predicoes.csv', index=False)
