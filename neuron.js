let inputs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 

let weights_1 = matrix(7, inputs.length);
let bias_1 = [0, 0, 0, 0, 0, 0, 0] 
let output_1 = [0, 0, 0, 0, 0, 0, 0];

let weights_2 = matrix(7, 7);
let bias_2 = [0, 0, 0, 0, 0, 0, 0] 
let output_2 = [0, 0, 0, 0, 0, 0, 0];

let output_weights = matrix(4, 7);
let output_bias = [0, 0, 0, 0];
let outputs = [0, 0, 0, 0]; 

function makeMove() {

    for(let row = 0; row < weights_1.length; row++) {
        output_1[row] = dot(weights_1[row], inputs);
        output_1[row] += bias_1[row];
        output_1[row] = relu(output_1[row]);
    }

    for(let row = 0; row < weights_2.length; row++) {
        output_2[row] = dot(weights_2[row], output_1);
        output_2[row] += bias_2[row];
        output_2[row] = relu(output_2[row]);
    }

    for(let row = 0; row < output_weights.length; row++) {
        outputs[row] = dot(output_weights[row], output_2);
        outputs[row] += output_bias[row];
        outputs[row] = relu(outputs[row]);
    }

}

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

function dot(a, b) {
    return a.map((e, i) => e * b[i]).reduce((t, i) => t += i);
}

function relu(x) {
    return (x >= 0) ? x : 0;
}

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}