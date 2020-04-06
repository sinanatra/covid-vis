export async function loadGraph(inputdata, denominazione_regione) {

    let data = []

    inputdata.forEach(element => {
        if (element.denominazione_regione.includes(denominazione_regione)) {
            data.push(element)
        }
    });

    console.log(data)
    // set the ranges
    const x = globalThis.d3.scaleTime().range([0, width]);
    const y = globalThis.d3.scaleLinear().range([height, 0]);

    // define the line
    const valueIll = globalThis.d3.line()
        .x(function (d) { return x(new Date(d.data)); })
        .y(function (d) { return y(d.totale_casi); });

    // define the line
    const valueRecovered = globalThis.d3.line()
        .x(function (d) { return x(new Date(d.data)); })
        .y(function (d) { return y(d.dimessi_guariti); });

    const valueIntensiveCare = globalThis.d3.line()
        .x(function (d) { return x(new Date(d.data)); })
        .y(function (d) { return y(d.terapia_intensiva); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = globalThis.d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);

    const tooltip = globalThis.d3.select('#tooltip');
    const tooltipLine = svg.append('line');

    // Scale the range of the data
    x.domain(globalThis.d3.extent(data, function (d) { return new Date(d.data); }));
    y.domain([0, globalThis.d3.max(inputdata, function (d) { return Math.max(d.totale_casi, d.dimessi_guariti); })]);

    // Add the valueIll path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueIll);

    // Add the valueIll path.
    svg.append("path")
        .data([data])
        .attr("class", "line line2")
        .attr("d", valueRecovered);

    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line line3")
    //     .attr("d", valueIntensiveCare);

    //  x and y axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(globalThis.d3.axisBottom(x))

    svg.append("g")
        .call(globalThis.d3.axisLeft(y))

    const legend = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend");

    // Tooltip
    const tipBox = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        // .on('mouseout', removeTooltip);

    function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }


    function drawTooltip() {
        let mousePos = globalThis.d3.mouse(this)[0]
        const time = (x.invert(globalThis.d3.mouse(tipBox.node())[0]));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        tooltipLine.attr('stroke', 'black')
            .style("stroke-dasharray", ("3, 3"))
            .attr('x1', x(time))
            .attr('x2', x(time))
            .attr('y1', 0)
            .attr('y2', height);

        tooltip.html((new Date(time)).toLocaleDateString('it-IT', options))
            .style('display', 'block')
            .style('class', 'tooltip')
            .selectAll()
            .data(data.filter((d) => {
                const data = new Date(d.data);
                return data.getDate() == time.getDate() && data.getMonth() == time.getMonth() && data.getYear() == time.getYear()
            })).enter()
            .append('div')
            .style('color', 'black')
            .html(d => '<p class="line"> Numero totale di casi: ' + d.totale_casi + '</p><p class="line2"> Numero totale di guariti: ' + d.dimessi_guariti + '</p>');
    }
}