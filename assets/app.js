
const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const projection = globalThis.d3.geoMercator()
    .center([11, 44])
    .scale(3200)
    .precision(0.1)
    .translate([width / 2, height / 2.5]);

const path = globalThis.d3.geoPath()
    .projection(projection)

async function loadMap() {

    const svg = globalThis.d3.select('#map')
        .append('div')
        .attr('id', 'svg')
        .append('svg')
        .attr("width", width)
        .attr("height", height)

    const italy = await globalThis.d3.json('assets/json/italy.geojson');

    const g = svg.append('g');

    g.append('path')
        .datum(italy)
        .attr('d', path)
        .attr('class', 'mappa')
        .style('stroke', 'black')
        .style('stroke-width', '.5px')
        .style('fill', 'none')
};

function loadData(data) {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-' + data + '.json');
}

async function loadMarkers(features, data) {
    const g = globalThis.d3.select('g')

    let filteredData = []

    features.forEach(element => {
        if (element.data.includes(data)) {
            filteredData.push(element)
        }
    });

    console.log(filteredData)

    g.selectAll('circle')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', d => projection([d.long, d.lat])[0])
        .attr('cy', d => projection([d.long, d.lat])[1])
        .style('fill', 'none')
        .style('stroke', 'tan')
        .attr('r', d => d.totale_casi / 100)

    g.selectAll('text')
        .data(filteredData)
        .enter()
        .append("text")
        .attr('dx', d => projection([d.long, d.lat])[0])
        .attr('dy', d => projection([d.long, d.lat])[1])
        .style('fill', 'tan')
        .style("font-size", "10px")
        .text(function (d){
            if (d.totale_casi > 1000){
                return d.denominazione_provincia
            }
        });

}

(async () => {
    await loadMap();
    const geojson = await loadData('province');

    globalThis.$('.date input').change(async function () {
        console.log(this.value)
        globalThis.d3.selectAll('circle').remove()
        globalThis.d3.selectAll('text').remove()

        loadMarkers(geojson, this.value);

    });
})();
