import { loadData, loadChart } from './components/data.js';
import { loadMap } from './components/loadMap.js';
import { loadPercentageMap } from './components/percentageMap.js';
import { loadCirclesMap } from './components/circlesMap.js';
import { loadCloropethMap } from './components/cloropethMap.js';
import { loadGraph } from './components/lineChart.js';

globalThis.margin = { top: 80, right: 20, bottom: 30, left: 50 },
    globalThis.height = 400 - margin.left - margin.right,
    globalThis.width = 620 - margin.top - margin.bottom;

globalThis.colorInterpolator = globalThis.d3.interpolateRgb("#F4E5D2", "#FF6600");
globalThis.colorInterpolator = globalThis.d3.interpolateRgb("rgb(255, 213, 61)", "rgb(137, 145, 234)");

globalThis.steps = 9;
globalThis.colorArray = globalThis.d3.range(0, (1 + 1 / steps), 1 / (steps - 1)).map(function (d) {
    return colorInterpolator(d)
});

(async () => {
    // await loadMap('map');
    await loadMap('map1');
    await loadMap('map2');
    const lineData = await loadChart();
    let searchedValue = 'Lombardia';

    await loadGraph(lineData, searchedValue, 'linear');

    const jsonItaProvinces = await loadData('province');

    loadCirclesMap(jsonItaProvinces, 'map', "2020-04-15");
    loadCloropethMap(jsonItaProvinces, 'map1', "2020-04-15");
    loadPercentageMap(jsonItaProvinces, 'map2', "2020-04-15");

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
        
        globalThis.$('.radio input[checked]').prop('checked', false);
        globalThis.$('.radio input[value="linear"]').prop('checked', true);

        await loadGraph(lineData, searchedValue, 'linear');
    });

    globalThis.$('.radio input[type="radio"]').change(async function () {
        globalThis.$('#chart svg').remove()
        await loadGraph(lineData, searchedValue, this.value);
    })

})();


