/*_________________________________
This function checks if the series z(k+1) = z(k)^e + c diverges
z : initial value of the series;
c : added number;
e : exponent of the complex number z; 
When used for the mandelbrot set, different exponents e will result in different symmetries of the set.
These new sets are colled "Multibrot sets".
Check: https://en.wikipedia.org/wiki/Mandelbrot_set
_________________________________*/
function diverges(z, c, e = 2, max_iterations = 100) {
    zz = z;
    count = 0;
    // if the modulo goes over 2 then it will surely diverge
    while (zz.modulo() <= 2 && count < max_iterations) {
        zz = zz.pow(e).add(c);
        count++;
    }
    // if the count didn't reach 100 then the complex number z(count) had modulo larger than 2, which means it diverges
    return { 'diverges': count < max_iterations, 'intensity': count };
}

function fromUV(u, v, remin, remax, immin, immax) {
    // maps r and i values between 0 and 1
    return { 'r': u * (remax - remin) + remin, 'i': (1 - v) * (immax - immin) + immin };
}

function mapColor(v, r1, g1, b1, r2 = 255, g2 = 255, b2 = 255) {
    // maps value to a range of colors:
    // the first set of numbers maps to what is outside the set, the second to what is inside the set
    let nr = r1 + (r2 - r1) * v;
    let nb = b1 + (b2 - b1) * v;
    let ng = g1 + (g2 - g1) * v;
    return `rgb(${nr},${ng},${nb})`;
}

/*____________________________________
The following function draws the mandelbrot set:
canvas: reference to the canvas where the image will be drawn;
remin, immin: real and imaginary minima;
remax, immax: real and imaginary maxima;
step: precision;
outsideColor, insideColor: colors that will be shown inside and outside the mandelbrot set.
____________________________________*/
async function mandelbrot(canvas, remin, remax, immin, immax, outsideColor = '#000000', insideColor = '#8EF7F7') {
    let w = canvas.width;
    let h = canvas.height;
    let max_iterations = 100;
    document.body.style.backgroundColor = `${outsideColor}`;
    let ctx = canvas.getContext('2d');
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let pos = fromUV(x / w, y / h, remin, remax, immin, immax);
            z = new Complex(pos.r, pos.i);
            div = diverges(new Complex(0, 0), z, 2, max_iterations);
            // choose color based on the iteration on which the series started diverging
            let color = mapColor(div.intensity / max_iterations, ...hexToRgb(outsideColor), ...hexToRgb(insideColor));
            with (ctx) {
                // draw the pixel on the canvas
                fillStyle = color;
                fillRect(x, y, 1, 1);
                stroke();
            }
        }
    }
}


/*______________________________________________
The following function draws the julia set of the complex number c:
canvas: HTMLElement on which the picture will be drawn;
c: number to use for the julia set;
remin, immin: real and imaginary minima;
remax, immax: real and immaginary maxima;
outsideColor, insideColor: colors that will be shown inside and outside the julia set.
_______________________________________________*/
async function julia(canvas, c, remin, remax, immin, immax, outsideColor = '#000000', insideColor = '#8EF7F7') {
    console.log(c);
    let w = canvas.width;
    let h = canvas.height;
    let max_iterations = 75;
    document.body.style.backgroundColor = `${outsideColor}`;
    let ctx = canvas.getContext('2d');
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let pos = fromUV(x / w, y / h, remin, remax, immin, immax);
            z = new Complex(pos.r, pos.i);
            div = diverges(z, c, 2, max_iterations);
            // choose color based on the iteration on which the series started diverging
            let color = mapColor(div.intensity / max_iterations, ...hexToRgb(outsideColor), ...hexToRgb(insideColor));
            with (ctx) {
                // draw the pixel on the canvas
                fillStyle = color;
                fillRect(x, y, 1, 1);
                stroke();
            }
        }
    }
}



// coverts hex color to rgb
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // use regex
    return result ? [
        parseInt(result[1], 16), //r
        parseInt(result[2], 16), //g
        parseInt(result[3], 16) //b
    ] : [0, 0, 0];
}

// Changes the colors of the page:
function changeColor(e) {
    optionsMenu.style.display = 'none';
    insideColor = document.getElementById('inside-color').value;
    outsideColor = document.getElementById('outside-color').value;
    document.getElementById('mandelbrot-button')
    init();
}

// Show Text Near Mouse:
function showText(e) {
    let offset = [cursorDiv.offsetWidth, cursorDiv.offsetHeight]; // get the offset of the div showing the text
    let x = (e.clientX - offset[0]); // calculate position of themouse relative to the div
    let y = (e.clientY - offset[1]);
    let canvas_rect = canvas.getBoundingClientRect(); // get the bounding rect of the canvas
    let r = (e.clientX - canvas_rect.left) / canvas.width; // calculate the position of the mouse relative to the canvas
    let i = (e.clientY - canvas_rect.top) / canvas.height;
    let pos = fromUV(r, i, remin, remax, immin, immax); // transform mouse position to equivalent complex number
    cursorDiv.innerHTML = `${pos.r.toFixed(3)}+${pos.i.toFixed(3)}i`; // show text with 3 decimal places only
    cursorDiv.style.left = `${x}px`; // set div position
    cursorDiv.style.top = `${y}px`;
}

function init() {
    // initializes the colors of the images
    let env = document.querySelector('html');
    env.style.setProperty('--outside-color', outsideColor);
    env.style.setProperty('--inside-color', insideColor);
    mandelbrot(canvas, remin, remax, immin, immax, outsideColor, insideColor); // start by drawing the mandelbrot set
}



//*________________________MAIN________________________*

var canvas = document.getElementById('display');
var optionsMenu = document.getElementById('options-menu');
let size = Math.min(window.innerWidth, window.innerHeight); // calculate size of the canvas
canvas.width = size;
canvas.height = size;

// real and imaginary axis sizes
let remin = -2.0;
let immin = -2.0;
let remax = +2.0;
let immax = +2.0;
var insideColor = '#8EF7F7';
var outsideColor = '#000000';


var cursorDiv = document.getElementById('show-complex'); // this div shows the complex number near the cursor


canvas.onmousemove = showText;
// show the julia set of the corresponding complex number when clicking on the canvas
canvas.onclick = (e) => {
    let canvas_rect = canvas.getBoundingClientRect();
    let r = (e.clientX - canvas_rect.left) / canvas.width;
    let i = (e.clientY - canvas_rect.top) / canvas.height;
    let pos = fromUV(r, i, remin, remax, immin, immax);
    julia(canvas, new Complex(pos.r, pos.i), remin, remax, immin, immax, outsideColor, insideColor);
};
document.getElementById('mandelbrot-button').onclick = (e) => { mandelbrot(canvas, remin, remax, immin, immax, outsideColor, insideColor); }
document.getElementById('options-button').onclick = (e) => { optionsMenu.style.display = 'block'; };
document.getElementById('close-button').onclick = (e) => { optionsMenu.style.display = 'none'; };
document.getElementById('color-button').onclick = changeColor;

init()





// made by @dedeartbit (on instagram) 20220103