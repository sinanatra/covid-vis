import { population, italy as italyPromise } from '../components/data.js';


export async function loadCirclesMap(features, id, data) {
    const pop = await population;
    const italy = await italyPromise;

    const svg = globalThis.d3.select('#svg' + id + ' svg')
    const g = globalThis.d3.select('#g' + id)
    const tooltip = globalThis.d3.select('.tooltip')

    let filteredData = []

    features.forEach(element => {
        if (element.data.includes(data)) {
            filteredData.push(element)
        }
    });


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
        .attr("d", globalThis.path)
        .style('stroke', 'black')
        .style('stroke-width', '.2px')
        .style('fill', '#f9f9f9')

    g.selectAll('circle')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', d => globalThis.projection([d.long, d.lat])[0])
        .attr('cy', d => globalThis.projection([d.long, d.lat])[1])
        .style('fill', 'rgb(152, 154, 212)')
        .style('stroke', 'rgb(152, 154, 212)')
        .style('opacity', '.7')
        .attr('r', d => d.totale_casi / 250)

        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.totale_casi + ' cases')
                .style("left", (globalThis.d3.event.pageX) + "px")
                .style("top", (globalThis.d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}