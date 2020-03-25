const height = 600;
const width = 1200;
let projection = [];
let path = "";

let italy = {};

const color = globalThis.d3.scaleThreshold()
    .domain([100, 500, 1000, 2000, 3000, 4000, 5000, 6500])
    .range(globalThis.d3.schemeYlOrRd[9])

    // .range("red", 'black');

async function loadMap() {
    italy = await globalThis.d3.json('../../assets/json/province.geojson');
    let population = await globalThis.d3.csv('../../dataset/tavola_pop_res.csv');
    console.log(population)

    projection = globalThis.d3.geoEquirectangular()
        .center([11, 44])
        .scale(3200)
        .precision(0.1)
        .fitSize([width/2, height], italy);

    path = globalThis.d3.geoPath()
        .projection(projection)

    const svg = globalThis.d3.select('#map')
        .append('div')
        .attr('id', 'svg')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    globalThis.d3.geoIdentity().fitSize([width, height], italy)
    
    // inserting the tooltip
    const tooltip = globalThis.d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    const g = svg.append('g');

    g.append('path')
        .datum(italy)
        .attr('d', path)
        .attr('class', 'mappa')
        .style('fill', 'none')
};

function loadData(data) {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-' + data + '.json');
}

async function loadMarkers(features, data) {
    const svg = globalThis.d3.select('svg')
    const g = globalThis.d3.select('g')
    const tooltip = globalThis.d3.select('.tooltip')

    let filteredData = []

    features.forEach(element => {
        if (element.data.includes(data)) {
            filteredData.push(element)
        }
    });

 
      
      svg.append("g")
        .attr("transform", "translate(600,40)")

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
        .style('stroke', 'black')
        .style('stroke-width', '.2px')
        .style('fill','#f9f9f9')

    g.selectAll('circle')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', d => projection([d.long, d.lat])[0])
        .attr('cy', d => projection([d.long, d.lat])[1])
        .style('fill', 'red')
        .style('stroke', 'red')
        .style('opacity', '.2')
        .attr('r', d => d.totale_casi / 100)

        .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d.totale_casi + ' casi')	
                .style("left", (globalThis.d3.event.pageX) + "px")		
                .style("top", (globalThis.d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
  
       
}

(async () => {
    await loadMap();
    const geojson = await loadData('province');
    loadMarkers(geojson, "2020-03-22");

    globalThis.$('.date input').change(async function () {
        globalThis.d3.selectAll('circle').remove()
        globalThis.d3.selectAll('text').remove()
        globalThis.d3.selectAll('path').remove()
        globalThis.d3.selectAll('rect').remove()

        loadMarkers(geojson, this.value);

    });
})();


