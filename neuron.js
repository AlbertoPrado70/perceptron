// Genera un nuevo conjunto de pesos y bias
function createNeuron(inputs) {

    let neuron = {
        weights_1: matrix(7, 6), 
        bias_1: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
        output_1: [0, 0, 0, 0, 0, 0, 0],
        weights_2: matrix(7, 7),
        bias_2: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
        output_2: [0, 0, 0, 0, 0, 0, 0],
        output_weights: matrix(4, 7), 
        output_bias: [Math.random(), Math.random(), Math.random(), Math.random()],
        outputs: [0, 0, 0, 0],
        distancia: 0
    }

    return(neuron); 

}

// Usa los pesos y bias proporcionados para calcular un nuevo
// movimiento a partir de la posición del jugador y el entorno
function makeMove(neuron, inputs) {

    for(let row = 0; row < neuron.weights_1.length; row++) {
        neuron.output_1[row] = dot(neuron.weights_1[row], inputs);
        neuron.output_1[row] += neuron.bias_1[row];
        neuron.output_1[row] = sigmoid(neuron.output_1[row]);
    }

    for(let row = 0; row < neuron.weights_2.length; row++) {
        neuron.output_2[row] = dot(neuron.weights_2[row], neuron.output_1);
        neuron.output_2[row] += neuron.bias_2[row];
        neuron.output_2[row] = sigmoid(neuron.output_2[row]);
    }

    for(let row = 0; row < neuron.output_weights.length; row++) {
        neuron.outputs[row] = dot(neuron.output_weights[row], neuron.output_2);
        neuron.outputs[row] += neuron.output_bias[row];
        neuron.outputs[row] = sigmoid(neuron.outputs[row]);
    }

    // Seleccionamos la salida
    move = indexOfMaxValue = neuron.outputs.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

    moveGhost(move);

}

// Actualizamos los pesos 
function updateWeights(neuron) {

    // Calculamos el error
    let error = Math.abs(0 - neuron.distancia);
    console.log(`Actualizando > error: ${error}; distancia: ${neuron.distancia}`);

    // Actualizamos con el error
    for(let row = 0; row < neuron.weights_1.length; row++) {
        for(let i = 0; i < neuron.weights_1[row].length; i++) {
            neuron.weights_1[row][i] += 0.0005 * error;
            neuron.bias_1[row][i] += 0.0005 * error;
        }
    }

    for(let row = 0; row < neuron.weights_2.length; row++) {
        for(let i = 0; i < neuron.weights_2[row].length; i++) {
            neuron.weights_2[row][i] += 0.0005 * error;
            neuron.bias_2[row][i] += 0.0005 * error;
        }
    }

    for(let row = 0; row < neuron.output_weights.length; row++) {
        for(let i = 0; i < neuron.output_weights[row].length; i++) {
            neuron.output_weights[row][i] += 0.0005 * error;
            neuron.output_bias[row][i] += 0.0005 * error;
        }
    }

}

// Crea una nueva matriz de dimensiones rows x columns y establece
// todos sus valores al azar en el rango -1, 1
function matrix(rows, columns) {

    let new_matrix = [rows];

    for(let i = 0; i < rows; i++) {
        new_matrix[i] = [columns];
        for(let j = 0; j < columns; j++) {
            new_matrix[i][j] = (Math.random() * 2) - 1;
        }
    }

    return(new_matrix);

}

// Mutamos la matriz a partir de los datos de otra matriz con mejor
// rendimiento
function mutar(objetivo) {
    
}

// Calcula el producto punto entre dos matrices
function dot(a, b) {
    return a.map((e, i) => e * b[i]).reduce((t, i) => t += i);
}

// Rectificador linear. Función de activacion
function relu(x) {
    return (x >= 0) ? x : 0;
}

// Sigmoide. Función de activación
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}