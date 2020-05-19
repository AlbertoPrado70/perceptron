/**
 * Proyecto: Perceptron multicapa para el reconocimiento de numeros
 * Alumno: Luis Alberto Prado Torres
 * Materia: Seminario de Inteligencia Artificial
 * Profesor: Judith
 */

const CANVAS_SIZE = 280; 
const NEURAL_INPUTS = 784; 
const DIRECCIONES = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Creamos un nuevo conjunto de datos usando la información de MNIST. Todas
// las imagenes tienen una resolución de 28x28 (784 pixeles)
let dataset = mnist.set(100, 10);

// Creamos nuestro modelo con la libreria brain.js
const modelo = new brain.NeuralNetwork();

// Canvas para dibujar. Usamos un tamaño menor para que el calculo se mas 
// rapido y simplemente completamos el arreglo con ceros 
let canvas = new PIXI.Application({width: CANVAS_SIZE, height: CANVAS_SIZE});
let graphics = new PIXI.Graphics; 
canvas.stage.addChild(graphics); 
canvas.renderer.backgroundColor = 0xdadada;
document.querySelector(".canvas").appendChild(canvas.view);

// Almacenamos el dibujo del usuario en un arreglo de 28x28 pixeles para 
// probar el funcionamiento de nuestra red neuronal
let canvas_input = [NEURAL_INPUTS];
limpiarCanvas();

// Los cuadros de nuestro dibujo. Cada cuadro tiene un tamaño de CANVAS_BRUSH_SIZE
// y los pasamos al canvas_input despues de dibujarlos
let draw_square = false; 
let entrenando = false; 
let graficar = false;
let totalEntrenamiento = 0;
let numeroActual = 0;
let error_iteraciones = [];


// Evento de mouse. Cuando presionen un boton del mouse comenzamos a dibujar en
// canvas y cuando lo liberen eliminamos los eventos
document.querySelector("canvas").addEventListener("mousedown", () => {
    draw_square = true;
    limpiarCanvas();
});

// Cuando dejan de dibujar en el canvas realizamos la predicción
document.querySelector("canvas").addEventListener("mouseup", () => {
    draw_square = false;
    imprimeMatriz(canvas_input);
    let a = modelo.run(canvas_input);
    var indexOfMaxValue = a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    document.querySelector(".prediccion").innerHTML = indexOfMaxValue;
    console.log(a);
    console.log(indexOfMaxValue);
});

// Loop principal. Actualizamos el canvas con el dibujo que hace el usuario y 
// almacenamos los valores en el canvas_input
canvas.ticker.add(delta => {

    if(draw_square) {

        let mouse_x = Math.round(canvas.renderer.plugins.interaction.mouse.global.x / 10);
        let mouse_y = Math.round(canvas.renderer.plugins.interaction.mouse.global.y / 10);   

        if(mouse_x >= 0 && mouse_x < CANVAS_SIZE && mouse_y >= 0 && mouse_y < CANVAS_SIZE){
            canvas_input[mouse_y * 28 + mouse_x] = 1
            DIRECCIONES.forEach(i => {
                canvas_input[(mouse_y + i[1]) * 28 + (mouse_x + i[0])] = 1;
            })
        }
        
    }

    if(entrenando) {

        for(let i = 0; i < dataset.training[numeroActual].input.length; i++) {
            canvas_input[i] = (dataset.training[numeroActual].input[i] > 0) ? 1 : 0;
        }

        if (numeroActual < dataset.training.length - 1) {
            numeroActual ++
        }

        else {
            entrenando = false;
            limpiarCanvas();
        }

    }

    

    graphics.clear();

    for(let i = 0; i < 28; i++) {
        for(let j = 0; j < 28; j++) {      
            if(canvas_input[i * 28 + j] > 0) {
                graphics.beginFill(0x000000, 1);
                graphics.drawRect(j * 10, i * 10, 10, 10);
                graphics.endFill();
            }
        }
    }

});


// Canvas PIXI para graficar el error durante el entrenamiento 
let grafica = new PIXI.Application({width: 680, height: 280});
let g = new PIXI.Graphics;
grafica.stage.addChild(g);
grafica.renderer.backgroundColor = 0xdadada;
document.querySelector(".canvas").appendChild(grafica.view);
let error_actual = 0; 
grafica.ticker.maxFPS = 15;

grafica.ticker.add(delta => {

    g.clear();
    g.lineStyle(1, 0xcacaca);
    
    for(let i = 0; i < 680; i += 10) {
        g.moveTo(i, 0); 
        g.lineTo(i, 280);
    }

    for(let i = 0; i < 680; i += 10) {
        g.moveTo(0, i); 
        g.lineTo(680, i);
    }

    g.lineStyle(1, 0x000000);
    g.moveTo(10, 0); 
    g.lineTo(10, 280);
    g.moveTo(0, 140); 
    g.lineTo(680, 140);

    if(graficar) {
    
        g.lineStyle(1, 0x0000ff);

        for(let i = 0; i < error_actual; i++) {
            
            let x1 = scale(i, 0, error_iteraciones.length, 0, 680); 
            let y1 = scale(error_iteraciones[i], 0, 0.25, 0, 280);
            let x2 = scale(i + 1, 0, error_iteraciones.length, 0, 680); 
            let y2 = scale(error_iteraciones[i + 1], 0, 0.25, 0, 280);

            g.moveTo(x1 + 10, 140 - y1);
            g.lineTo(x2 + 10, 140 - y2);

        }

        error_actual += (error_actual < error_iteraciones.length - 2) ? 1 : 0;

    }

})

// Comienza el entrenamiento de nuestra red neuronal. Antes de entrenar
// mostramos el contenido de cada entrada en el canvas 
document.querySelector(".entrenar").addEventListener("click", () => {

    document.querySelector(".overlay").style.display = "flex";
    error_iteraciones = [];
    graficar = false;

    setTimeout(() => {
        let dataset_length = document.querySelector(".dataset_length").value;
        dataset = mnist.set(dataset_length, 10);
        let error = modelo.train(dataset.training, {logPeriod: 1, log: detail => error_iteraciones.push(detail.error)});
        document.querySelector(".error_modelo").value = "Error: " + error_iteraciones[error_iteraciones.length - 1];
        entrenando = true; 
        graficar = true; 
        document.querySelector(".overlay").style.display = "none";
    }, 2500);

})

// Imprime en consola la matriz pasada como parametro de forma que sea
// mas facil de entender su contenido
function imprimeMatriz(matriz) {
    
    let fila = "";
    
    for(let i = 0; i < 28; i++) {
        for(let j = 0; j < 28; j++) {
            fila += (matriz[i * 28 + j] > 0) ? 1 : 0;
            fila += " "
        }
        fila += "\n";
    }

    console.log(fila);

}

// Llena de ceros la matriz canvas_input
function limpiarCanvas() {
    for(let i = 0; i < NEURAL_INPUTS; i++) {
        canvas_input[i] = 0;
    }
}

// Función para convertir un valor a otro rango
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}