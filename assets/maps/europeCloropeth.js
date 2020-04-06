
import { loadData, loadDataFrance, loadDataGermany, loadDataAustria, loadDataSwitzerland } from '../maps/data.js';
import { population, europeFocus as europeFocusPromise } from '../maps/data.js';

export async function loadEuropeCloropeth(id, data) {
    let jsonIta = await loadData('province');
    let jsonFrance = await loadDataFrance();
    let jsonSwitzerland = await loadDataSwitzerland();
    let jsonGermany = await loadDataGermany();
    let jsonAustria = await loadDataAustria();

    const europe = await europeFocusPromise;

    const svg = globalThis.d3.select('#svg' + id + ' svg')
    const g = globalThis.d3.select('#g' + id)
    const tooltip = globalThis.d3.select('.tooltip')

    const color = globalThis.d3.scaleThreshold()
        .domain([100, 500, 1000, 2000, 3000, 4000, 5000, 6000])
        .range(colorArray)

    let filteredData = []

    jsonIta.forEach(element => {
        if (element.data.includes(data)) {
            filteredData.push(element)
        }
    });

    jsonFrance.forEach(element => {
        if (element.date.includes(data)) {
            filteredData.push(element)
        }
    });

    jsonGermany.forEach(element => {
        if (element.date.includes(data)) {
            filteredData.push(element)
        }
    });

    jsonAustria.forEach(element => {
        if (element.date.includes(data)) {
            filteredData.push(element)
        }
    });

    jsonSwitzerland.forEach(element => {
        if (element.datetime.includes(data)) {
            filteredData.push(element)
        }
    });

    // Draw the legend
    const format = globalThis.d3.format("d")

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
            .text("People affected by COVID-19");

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
        let dataItaly = filteredData[i].denominazione_provincia;

        let dataFrance = filteredData[i].nom;
        let dataGermany = filteredData[i].label;
        let dataAustria = filteredData[i];
        let dataSwitzerland = filteredData[i].nuts_2;

        let affectedItaly = parseFloat(filteredData[i].totale_casi);
        let affectedFrance = parseFloat(filteredData[i].casConfirmes);
        let affectedGermany = parseFloat(filteredData[i].confirmed);
        let affectedAustria = parseFloat(filteredData[i].total_cases);
        let affectedSwitzerland = parseFloat(filteredData[i].cases);

        for (let n = 0; n < europe.features.length; n++) {

            let name1 = europe.features[n].properties.NAME_1;
            let name2 = europe.features[n].properties.NAME_2;
            let iso = europe.features[n].properties.ISO;

            if (dataItaly == name2) {
                europe.features[n].properties.value = affectedItaly;
                break;
            }
            if (dataFrance == name2) {
                // Fixing the french json
                if (!isNaN(affectedFrance)) {
                    europe.features[n].properties.value = affectedFrance;
                    break;
                }
            }

            // if (dataSwitzerland == iso) {
            //     europe.features[n].properties.value = affectedSwitzerland;
            //     break
            // }

            if (dataGermany == name2) {
                europe.features[n].properties.value = affectedGermany;
                break;
            }

            console.log(dataAustria, name2)
            if (dataAustria.name2 == name2) {
                europe.features[n].properties.value = affectedAustria;
                break;
            }
        }
    }

    g.selectAll("path")
        .data(europe.features)
        .enter()
        .append("path")
        .attr("d", globalThis.europePath)
        .style('stroke', 'black')
        .style('stroke-width', '.2px')
        .style("fill", function (d) {
            var value = d.properties.value;
            if (value > 10) {
                return color(value);
            } else {
                return "#f9f9f9"
            }
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.properties.NAME_2 + '<br>' + d.properties.value + ' cases')
                .style("left", (globalThis.d3.event.pageX) + "px")
                .style("top", (globalThis.d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


}