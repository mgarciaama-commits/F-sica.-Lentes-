

/* Simulador de Lentes Delgadas (p5.js Sketch)
  Autor: Gemini AI
  Instrucciones: Copia esto en https://editor.p5js.org/
*/

let fSlider, doSlider, hoSlider;

function setup() {
  createCanvas(800, 500);
  
  // Crear controles
  createP('Distancia Focal (Negativo = Divergente, Positivo = Convergente)').position(10, 510);
  fSlider = createSlider(-150, 150, 100, 10);
  fSlider.position(10, 540);
  fSlider.style('width', '200px');
  
  createP('Distancia del Objeto').position(250, 510);
  doSlider = createSlider(10, 350, 200, 10);
  doSlider.position(250, 540);
  doSlider.style('width', '200px');
  
  createP('Altura del Objeto').position(500, 510);
  hoSlider = createSlider(10, 100, 60, 5);
  hoSlider.position(500, 540);
}

function draw() {
  background(255);
  
  let f = fSlider.value();
  if (f === 0) f = 1; // Evitar error div/0
  let doVal = doSlider.value();
  let ho = hoSlider.value();
  
  let cx = width / 2;
  let cy = height / 2;
  
  // Texto de valores
  fill(0); noStroke();
  text(`f: ${f}`, 20, 30);
  text(`do: ${doVal}`, 20, 50);
  text(f > 0 ? "Lente CONVERGENTE" : "Lente DIVERGENTE", 20, 70);
  
  // 1. DIBUJAR ESCENARIO
  // Eje óptico
  stroke(0); strokeWeight(1);
  line(0, cy, width, cy);
  
  // Lente
  stroke(0, 100, 255); strokeWeight(3);
  line(cx, cy - 150, cx, cy + 150);
  
  // Focos
  fill(255, 0, 0); noStroke();
  ellipse(cx - f, cy, 8, 8); // Foco izquierdo
  ellipse(cx + f, cy, 8, 8); // Foco derecho
  fill(0); text("F", cx - f - 5, cy + 20);
  
  // 2. CÁLCULOS
  // 1/f = 1/do + 1/di  =>  di = (f*do)/(do-f)
  let di = (f * doVal) / (doVal - f);
  let m = -di / doVal;
  let hi = m * ho;
  
  let objX = cx - doVal;
  let objY = cy - ho;
  let imgX = cx + di;
  let imgY = cy + hi; // p5 coordenadas Y crecen hacia abajo
  
  // 3. DIBUJAR OBJETO (Flecha azul)
  drawArrow(objX, cy, objX, objY, color(0, 0, 255));
  
  // 4. DIBUJAR IMAGEN (Flecha verde)
  // Verificar si es imagen virtual (mismo lado que objeto)
  let isVirtual = (di < 0); 
  let imgColor = isVirtual ? color(0, 150, 0, 100) : color(0, 150, 0);
  
  if (abs(di) < 3000) {
    drawArrow(imgX, cy, imgX, imgY, imgColor);
    noStroke(); fill(0, 150, 0);
    text(isVirtual ? "Imagen Virtual" : "Imagen Real", imgX, imgY + (hi > 0 ? 20 : -20));
  }
  
  // 5. TRAZADO DE RAYOS
  stroke(255, 0, 0, 150); strokeWeight(1);
  
  // Rayo 1: Paralelo -> Foco
  line(objX, objY, cx, objY); // Al lente
  if (f > 0) {
    // Convergente: Pasa por el foco del otro lado
    lineFull(cx, objY, cx + f, cy);
  } else {
    // Divergente: Diverge como si viniera del foco de este lado
    lineFull(cx, objY, cx + 500, objY + (objY - cy)*500/abs(f)); // Proyección hacia afuera
    drawingContext.setLineDash([5, 5]); // Punteado hacia atrás
    line(cx, objY, cx + f, cy);
    drawingContext.setLineDash([]);
  }
  
  // Rayo 2: Centro óptico (pasa recto)
  lineFull(objX, objY, cx, cy);
}

// Función auxiliar para dibujar flechas
function drawArrow(x1, y1, x2, y2, col) {
  stroke(col); strokeWeight(3);
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  rotate(angle);
  let arrowSize = 10;
  line(0, 0, -arrowSize, arrowSize/2);
  line(0, 0, -arrowSize, -arrowSize/2);
  pop();
}

// Dibuja una línea que se extiende para llenar la pantalla
function lineFull(x1, y1, x2, y2) {
  let angle = atan2(y2 - y1, x2 - x1);
  let dist = 2000;
  line(x1, y1, x1 + cos(angle)*dist, y1 + sin(angle)*dist);
}
