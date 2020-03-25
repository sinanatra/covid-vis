import {loadData} from './maps/data.js';
import {loadMap} from './maps/loadMap.js';
import {loadPercentageMap} from './maps/percentageMap.js';
import {loadCirclesMap} from './maps/circlesMap.js';
import {loadCloropethMap} from './maps/cloropethMap.js';

globalThis.height = 600;
globalThis.width = 1200;

(async () => { 
    await loadMap('map');
    await loadMap('map1');
    await loadMap('map2');

    const geojson = await loadData('province');
    loadCirclesMap(geojson, 'map' ,"2020-03-22");
    loadCloropethMap(geojson, 'map1' ,"2020-03-22");
    loadPercentageMap(geojson,'map2' ,"2020-03-22");

    globalThis.$('.date input').change(async function () {
        globalThis.d3.selectAll('circle').remove()
        globalThis.d3.selectAll('text').remove()
        globalThis.d3.selectAll('path').remove()
        globalThis.d3.selectAll('rect').remove()
        
        loadCirclesMap(geojson, 'map',this.value);
        loadCloropethMap(geojson,'map1', this.value);
        loadPercentageMap(geojson,'map2' ,this.value);

    });
})();


