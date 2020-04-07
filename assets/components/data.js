export const population = globalThis.d3.csv('./assets/dataset/tavola_pop_res.csv');
export const italy = globalThis.d3.json('./assets/json/province.geojson');
export const europeFocus = globalThis.d3.json('./assets/json/europe-focus.geojson');

export function loadData(data) {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-' + data + '.json');
}

export function loadChart() {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json');
}
