const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
let mapWidth, mapHeight, pixelizedData;

setDimensions();

setInterval(() => {
    setDimensions();
    if (pixelizedData)
        draw();
}, 1000);

function setDimensions() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    mapWidth = canvas.width;
    mapHeight = canvas.height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nExtrema = getExtrema('n', pixelizedData);
    const eExtrema = getExtrema('e', pixelizedData);
    const popExtrema = getExtrema('pop', pixelizedData);

    pixelizedData.forEach(data => {
        const newData = getCoords(nExtrema, eExtrema)(data);
        ctx.fillStyle = 'black';
        ctx.imageSmoothingEnabled = true;
        ctx.fillRect(newData.x, mapHeight - newData.y, 5, 5);
    });

    pixelizedData.forEach(data => {
        const newData = getCoords(nExtrema, eExtrema)(data);
        const size = Math.round(data.pop / (popExtrema.max / 200));
        let a = (55 + size).toString(16);
        if (a.length === 1)
            a = '0' + a;
        if (data.pop > 200) {
            ctx.imageSmoothingEnabled = true;
            ctx.fillStyle = '#0000ff' + a;
            ctx.beginPath();
            ctx.arc(newData.x, mapHeight - (newData.y), 1, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#0000ff' + a;
            ctx.stroke();
        }
    });
}

fetch('data').then(response => response.text()).then(text => pixelizedData = text.split('\n').slice(1).map(latLon2Pixel));

function getExtrema(what, data) {
    return {
        min: Math.min(...data.map(coord => coord[what]).filter(value => !isNaN(value))),
        max: Math.max(...data.map(coord => coord[what]).filter(value => !isNaN(value)))
    };
}

/* latLon2Pixel
* From: [[lat, lon], [lat, lon], [lat, lon], ...]
* To:   [{x, y}, {x, y}, {x, y}, ...]
* */
function latLon2Pixel(line) {
    const split = line.split(',');
    const id = split[2].replace(/"/g, '');
    const pop = split[split.length - 3];
    const n = id.slice(4, 8);
    const e = id.slice(9, 13);
    return {n, e, pop};
}

function getCoords(nExtrema, eExtrema) {
    return coords => {
        const x = (coords.e - eExtrema.min) / (nExtrema.max - nExtrema.min) * mapHeight;
        const y = (coords.n - nExtrema.min) / (nExtrema.max - nExtrema.min) * mapHeight;
        return {x, y};
    }
}
