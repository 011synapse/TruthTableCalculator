# Generador de Tablas de Verdad y Parser Lógico

Un proyecto en JavaScript puro que toma fórmulas de lógica proposicional, valida si están bien formadas (f.b.f.) y genera su tabla de verdad en pantalla de forma automática.

El desarrollo surgió para resolver la parte pesada de la validación lógica mediante código: parsear cadenas de texto con paréntesis, evaluar operadores lógicos y renderizar la matriz de interpretaciones en el DOM.

---

## ⚡ Qué hace el proyecto

* **Validador de sintaxis:** Analiza las fórmulas usando la función `parseFunction` para asegurar que los paréntesis, variables y operadores respeten la estructura formal.
* **Evaluador de operadores:** Resuelve la lógica de la proposición contemplando:
* Conjunción ($\land$) y Disyunción ($\lor$)
* Implicación ($\rightarrow$) y Bicondicional ($\leftrightarrow$)
* Disyunción Exclusiva / XOR ($\oplus$)
* Negación ($\neg$)


* **Generador de interpretaciones:** Calcula todas las combinaciones de valores de verdad posibles ($2^n$ filas según la cantidad de variables) convirtiendo enteros a binario.
* **Interfaz dinámica:** Incluye botones para insertar símbolos directo en la posición del cursor, soporte para la tecla `Enter` y un generador aleatorio de fórmulas válidas.

---

## 🛠️ Tecnologías utilizadas

* **JavaScript (ES6+):** Lógica principal, recursión para evaluar subfórmulas y manipulación directa del DOM.
* **HTML5 / CSS3:** Estructura de la interfaz y estilos para la tabla de resultados.

---

## 🚀 Cómo probarlo

No necesita dependencias ni instalar paquetes:

1. Clonas el repositorio:
```bash

git clone https://github.com/011synapse/TruthTableCalculator.git

```


2. Abrís el archivo `index.html` en cualquier navegador y listo.
