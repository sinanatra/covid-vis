export async function loadGraph(inputdata, denominazione_regione, toggle) {
    let data = []
    inputdata.forEach(element => {
        if (element.denominazione_regione.includes(denominazione_regione)
            && element.totale_casi != 0 && element.dimessi_guariti != 0
        ) {
            data.push(element)
        }
    });
    globalThis.$('#tooltip').html('<p class="line"> Numero totale di casi: ' + globalThis.d3.max(inputdata, function (d) { return Math.max(d.totale_casi, d.dimessi_guariti); }) + '</p><p class="line2"> Numero totale di guariti: ' + globalThis.d3.max(inputdata, function (d) { return Math.max(d.dimessi_guariti, d.dimessi_guariti); }) + '</p>')

    const x = globalThis.d3.scaleTime().range([0, width]);
    x.domain(globalThis.d3.extent(data, function (d) { return new Date(d.data); }));

    let y;

    if (toggle == 'log') {
        y = globalThis.d3.scaleLog()
            .domain([1, globalThis.d3.max(inputdata, function (d) { return Math.max(d.totale_casi, d.dimessi_guariti); })])
            .range([height, 0]);
    }

    else {
        y = globalThis.d3.scaleLinear().range([height, 0])
            .domain([0, globalThis.d3.max(inputdata, function (d) { return Math.max(d.totale_casi, d.dimessi_guariti); })])
            
    }


    // Scale the range of the data

    // define the line
    const valueIll = globalThis.d3.line()
        .x(function (d) { return x(new Date(d.data)); })
        .y(function (d) { return y(d.totale_casi); });

    // define the line
    const valueRecovered = globalThis.d3.line()
        .x(function (d) { return x(new Date(d.data)); })
        .y(function (d) { return y(d.dimessi_guariti); });

    const svg = globalThis.d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    const tooltip = globalThis.d3.select('#tooltip');
    const tooltipLine = svg.append('line');


    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueIll);

    svg.append("path")
        .data([data])
        .attr("class", "line line2")
        .attr("d", valueRecovered);

    //  x and y axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(globalThis.d3.axisBottom(x))

    svg.append("g")
        .call(globalThis.d3.axisLeft(y)
            .ticks(5)
            .tickFormat((d) => d))

    // Tooltip
    const tipBox = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
 
    function drawTooltip() {
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