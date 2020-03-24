
const height = 600;
const width = 900;
let projection = [];
let path = "";

let italy = {};

const color = globalThis.d3.scaleThreshold()
    .domain([100, 1000, 2000, 3000, 4000, 5000, 6000])
    .range(globalThis.d3.schemeBuPu[8]);

async function loadMap() {
    italy = await globalThis.d3.json('assets/json/province.geojson');

    projection = globalThis.d3.geoEquirectangular()
        .center([11, 44])
        .scale(3200)
        .precision(0.1)
        .fitSize([width, height], italy);

    path = globalThis.d3.geoPath()
        .projection(projection)

    const svg = globalThis.d3.select('#map')
        .append('div')
        .attr('id', 'svg')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

 

    globalThis.d3.geoIdentity().fitSize([width, height], italy)


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

    // Draw the legend
    const format = globalThis.d3.format("d")

    const legend = g => {
        const x = globalThis.d3.scaleLinear()
            .domain(globalThis.d3.extent(color.domain()))
            .rangeRound([0, 250]);
      
        g.selectAll("rect")
          .data(color.range().map(d => color.invertExtent(d)))
          .join("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill", d => color(d[0]));
      
        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Affected by covid-19");
        
        g.call(globalThis.d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(format)
            .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
          .select(".domain")
            .remove();
      }
      
      g.append("g")
        .attr("transform", "translate(600,40)")
        .call(legend);

    //  Merge geojson and filteredData
    for (let i = 0; i < filteredData.length; i++) {
        let dataState = filteredData[i].denominazione_provincia;

        let dataValue = parseFloat(filteredData[i].totale_casi);

        for (let n = 0; n < italy.features.length; n++) {

            let jsonState = italy.features[n].properties.NOME_PRO;
            if (dataState == jsonState) {
                italy.features[n].properties.value = dataValue;
                break;
            }
        }
    }
    g.selectAll("path")
        .data(italy.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function (d) {
            var value = d.properties.value;
            if (value) {
                return color(value);
            } else {
                return "#f9f9f9"
            }

        });

    // g.selectAll('circle')
    //     .data(filteredData)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', d => projection([d.long, d.lat])[0])
    //     .attr('cy', d => projection([d.long, d.lat])[1])
    //     .style('fill', 'none')
    //     .style('stroke', 'tan')
    //     .attr('r', d => d.totale_casi / 100)

    g.selectAll('text')
        .data(filteredData)
        .enter()
        .append("text")
        .attr('dx', d => projection([d.long, d.lat])[0])
        .attr('dy', d => projection([d.long, d.lat])[1])
        .style('fill', 'black')
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
    loadMarkers(geojson, "2020-03-22");
    console.log(geojson)

    globalThis.$('.date input').change(async function () {
        console.log(this.value)
        globalThis.d3.selectAll('circle').remove()
        globalThis.d3.selectAll('text').remove()
        globalThis.d3.selectAll('path').remove()
        globalThis.d3.selectAll('rect').remove()

        loadMarkers(geojson, this.value);

    });
})();


