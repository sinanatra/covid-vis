import { loadData, loadChart } from './maps/data.js';
import { loadMap, loadEuropeMap } from './maps/loadMap.js';
import { loadPercentageMap } from './maps/percentageMap.js';
import { loadCirclesMap } from './maps/circlesMap.js';
import { loadCloropethMap } from './maps/cloropethMap.js';
import { loadEuropeCloropeth } from './maps/europeCloropeth.js';
import { loadGraph } from './chart/lineChart.js';

globalThis.margin = { top: 20, right: 20, bottom: 30, left: 50 },
    globalThis.height = 960 - margin.left - margin.right,
    globalThis.width = 1000 - margin.top - margin.bottom;

globalThis.colorInterpolator = globalThis.d3.interpolateRgb("#F4E5D2", "#FF6600");
globalThis.colorInterpolator = globalThis.d3.interpolateRgb("rgb(255, 213, 61)", "rgb(137, 145, 234)");

globalThis.steps = 9;
globalThis.colorArray = globalThis.d3.range(0, (1 + 1 / steps), 1 / (steps - 1)).map(function (d) {
    return colorInterpolator(d)
});

(async () => {
    await loadMap('map');
    await loadMap('map1');
    await loadMap('map2');
    // // await loadEuropeMap('europeFocus');
    const lineData = await loadChart();
    let searchedValue = 'Lombardia';

    await loadGraph(lineData, searchedValue, 'linear');

    const jsonItaProvinces = await loadData('province');

    loadCirclesMap(jsonItaProvinces, 'map', "2020-03-22");
    loadCloropethMap(jsonItaProvinces, 'map1', "2020-03-22");
    loadPercentageMap(jsonItaProvinces, 'map2', "2020-03-22");

    globalThis.$('.date input').change(async function () {
        globalThis.d3.selectAll('.maps circle').remove()
        globalThis.d3.selectAll('.maps text').remove()
        globalThis.d3.selectAll('.maps path').remove()
        globalThis.d3.selectAll('.maps rect').remove()

        loadCirclesMap(jsonItaProvinces, 'map', this.value);
        loadCloropethMap(jsonItaProvinces, 'map1', this.value);
        loadPercentageMap(jsonItaProvinces, 'map2', this.value);
    });

    globalThis.$('.search input').change(async function () {
        globalThis.$('#chart svg').remove()
        globalThis.$('#regionFocus').text(this.value)
        searchedValue = this.value;
        await loadGraph(lineData, searchedValue, 'linear');
    });

    globalThis.$('.radio input[type="radio"').change(async function () {
        globalThis.$('#chart svg').remove()
        await loadGraph(lineData, searchedValue, this.value);
    })

})();


