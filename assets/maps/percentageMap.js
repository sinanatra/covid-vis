import {population, italy as italyPromise} from '../maps/data.js';

export async function loadPercentageMap(features, id, data) {
    const pop = await population;
    const italy = await italyPromise;

    const svg = globalThis.d3.select('#svg' + id + ' svg')
    const g = globalThis.d3.select('#g' + id)

    const tooltip = globalThis.d3.select('.tooltip')

    let color = globalThis.d3.scaleThreshold()
        .domain([0.2,0.5, 1, 2, 3, 4, 5, 6])
        .range(colorArray)

    let filteredData = []

    features.forEach(element => {
        if (element.data.includes(data)) {
            filteredData.push(element)
        }
    });

    // Draw the legend
    const format = globalThis.d3.format(".1f")

    const legend = svg => {
        const x = globalThis.d3.scaleLinear()
            .domain(globalThis.d3.extent(color.domain()))
            .rangeRound([0, 350]);
      
        svg.selectAll("rect")
          .data(color.range().map(d => color.invertExtent(d)))
          .join("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill", d => color(d[0]));
      
        svg.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Percentage of population per region affected by COVID-19");
        
        svg.call(globalThis.d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(format)
            .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
          .select(".domain")
            .remove();
      }
      
      svg.append("g")
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

     //  Merge geojson and population ISTAT
 

    for (let i = 0; i < pop.length; i++) {
        let dataState = pop[i].Province;
        let dataValue = parseFloat(pop[i].total);
        for (let n = 0; n < italy.features.length; n++) {
            let jsonState = italy.features[n].properties.NOME_PRO;
            
            if (dataState == jsonState) {
                let populationPercentage =  (italy.features[n].properties.value * 100) / dataValue
                italy.features[n].properties.percentage = populationPercentage;
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
        .style("fill", function (d) {
            var value = d.properties.percentage;
            if (value > 0.2) {
                return color(value);
            } else {
                return "#f9f9f9"
            }
        })
        .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d.properties.NOME_PRO + '<br>' +  Math.round( d.properties.percentage  * 100) / 100+ ' %')	
                .style("left", (globalThis.d3.event.pageX) + "px")		
                .style("top", (globalThis.d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
       
}