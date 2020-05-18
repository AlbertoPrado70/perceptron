/**
 * Modulo: Perceptron simple
 * Alumno: Luis Alberto Prado Torres
 * Descripcion: Un perceptron simple para clasificar puntos
 */

const PERCEPTRON_SIZE = 380; 

let perceptron = new PIXI.Application({width: PERCEPTRON_SIZE, height: PERCEPTRON_SIZE});
let gp = new PIXI.Graphics();

document.querySelector(".perceptron").appendChild(perceptron.view);
perceptron.stage.addChild(gp);
 
let dataset = [];

for(let i = 0; i < 50; i++) {

    let px = Math.random() * PERCEPTRON_SIZE; 
    let py = Math.random() * PERCEPTRON_SIZE; 

    dataset[i] = {
        x: px,
        y: py, 
        color: (px > py) ? 0xff0000 : 0x00ff00,
        clase: (px > py) ? 1 : -1
    }; 

}

let puntoActual = 0;  
let pesos = [Math.random(), Math.random()]; 
let bias = Math.random(); 

perceptron.ticker.add(delta => {

    gp.clear();

    dataset.forEach(data => {
        gp.lineStyle(0, 0x000);
        gp.beginFill(data.color, 1);
        gp.drawCircle(data.x, data.y, 2);
        gp.endFill();
    });

    let m = (pesos[0] / bias) / (pesos[0] / pesos[1]);  
    let c = pesos[0] / bias;

    // console.log(`m: ${m}; c: ${c}`);

    for(let i = -500; i < 500; i++) {
        gp.beginFill(0x0000ff, 1);
        gp.drawCircle(i, i * m + c, 2);
        gp.endFill();
    }

    if(puntoActual < dataset.length) {

        let suma = (dataset[puntoActual].x * pesos[0]) + (dataset[puntoActual].y * pesos[1]) + bias; 
        let prediccion = (sigmoid(suma) > 0) ? 1 : -1;
        let error = Math.abs(dataset[puntoActual].clase - prediccion);

        pesos[0] += 0.001 * error * dataset[puntoActual].x; 
        pesos[1] += 0.001 * error * dataset[puntoActual].y;
        bias += 0.001 * error

        console.log(`preddicion: ${prediccion}; respuesta: ${dataset[puntoActual].clase}`)
        puntoActual++;

    }

}); 

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}