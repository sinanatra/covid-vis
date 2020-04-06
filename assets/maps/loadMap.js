import {italy as italyPromise, europeFocus as europeFocusPromise, } from '../maps/data.js';

export async function loadMap(id) {
    const italy = await italyPromise;
    
    globalThis.projection = globalThis.d3.geoEquirectangular()
        .center([11, 44])
        .scale(3200)
        .precision(0.1)
        .fitSize([globalThis.width / 2, globalThis.height],  italy);

    globalThis.path = globalThis.d3.geoPath()
        .projection(globalThis.projection)
    
    let svg  = globalThis.d3.select('#' + id)
        .append('div')
        .attr('id', 'svg' + id)
        .append('svg')
        .attr("width", globalThis.width)
        .attr("height", globalThis.height);

    globalThis.d3.geoIdentity().fitSize([globalThis.width, globalThis.height],  italy)
    
    // inserting the tooltip
    const tooltip = globalThis.d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    const g = svg.append('g').attr('id', 'g' + id);

    g.append('path')
        .datum( italy)
        .attr('d', globalThis.path)
        .attr('class', 'mappa')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '.1px')

};


export async function loadEuropeMap(id){
    const europeFocus = await europeFocusPromise;
    console.log(europeFocus)
    
    globalThis.europeProjection = globalThis.d3.geoEquirectangular()
        .center([9.6, 45.6])
        .scale(2000)
        .precision(0.1)
        // .fitSize([globalThis.width / 2, globalThis.height],  europeFocus);

    globalThis.europePath = globalThis.d3.geoPath()
        .projection(globalThis.europeProjection)
    
    let svg  = globalThis.d3.select('#' + id)
        .append('div')
        .attr('id', 'svg' + id)
        .append('svg')
        .attr("width", globalThis.width)
        .attr("height", globalThis.height);

    globalThis.d3.geoIdentity().fitSize([globalThis.width, globalThis.height],  europeFocus)
    
    // inserting the tooltip
    const tooltip = globalThis.d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    const g = svg.append('g').attr('id', 'g' + id);

    g.append('path')
        .datum( europeFocus)
        .attr('d',  globalThis.europePath)
        .attr('class', 'mappa')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '.1px')

};
