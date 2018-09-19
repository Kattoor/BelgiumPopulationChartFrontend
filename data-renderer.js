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

    const xExtrema = getExtrema('x', pixelizedData);
    const yExtrema = getExtrema('y', pixelizedData);
    const amountExtrema = getExtrema('amount', pixelizedData);

    pixelizedData.forEach(data => {
        const newData = getCoords(xExtrema, yExtrema)(data);
        const size = Math.round(data.amount / (amountExtrema.max / 50));
        console.log(Math.round(data.amount / (amountExtrema.max / 100)));
        var a = Math.round((data.amount / (amountExtrema.max / 99))).toString(16);
        if (a.length === 1)
            a = '0' + a;
        ctx.beginPath();
        ctx.arc(newData.x - size / 2, mapHeight - (newData.y - size / 2), size, 0, 2 * Math.PI, false);
        //ctx.fillStyle = '#2980b9';
        ctx.fillStyle = '#0000ff99';
 //       console.log(ctx.fillStyle);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = (size / 2) + 'px Calibri';
        if (size > 10)
            ctx.fillText(data.city, newData.x - size, mapHeight - (newData.y - size / 1.25), 100000);
    });

    /*pixelizedData.forEach(obj => {
        //obj.pixelizedCoordinates = [[{x,y}, {x,y}, {x,y}, {x,y}, {x,y}, ...], [{x,y}, {x,y}, {x,y}, {x,y}, {x,y}, ...], [{x,y}, {x,y}, {x,y}, {x,y}, {x,y}, ...], ...]

        const coordsArray = obj.pixelizedCoordinates.map(district => district.map(getCoords(xExtrema, yExtrema)));
        coordsArray.forEach(district => {
            ctx.beginPath();
            ctx.moveTo(district[0].x, coordsArray[0].y);
            district.slice(1).forEach(coords => ctx.lineTo(coords.x, coords.y));
            ctx.closePath();
            ctx.fill();
        });
    });*/
}

fetch('data').then(response => response.text()).then(text => pixelizedData = text.split('\n').map(latLon2Pixel));

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
    return {
        city: line.split('|')[0],
        y: (line.split('|')[1] * mapHeight) / 180,
        x: (line.split('|')[2] * mapWidth) / 360,
        amount: line.split('|')[3]
    };
}

function getCoords(xExtrema, yExtrema) {
    return coords => {
        const x = (coords.x - xExtrema.min) / (xExtrema.max - xExtrema.min) * mapWidth;
        const y = (coords.y - yExtrema.min) / (yExtrema.max - yExtrema.min) * mapHeight;
        return {x, y};
    }
}
