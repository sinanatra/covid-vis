export const population = globalThis.d3.csv('./dataset/tavola_pop_res.csv');
export const italy = globalThis.d3.json('./assets/json/province.geojson');
export const europeFocus = globalThis.d3.json('./assets/json/europe-focus.geojson');

export function loadData(data) {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-' + data + '.json');
}

export function loadDataFrance() {
    return globalThis.d3.json('https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json');
}

export function loadDataGermany() {
    return globalThis.d3.csv('https://interaktiv.morgenpost.de/corona-virus-karte-infektionen-deutschland-weltweit/data/Coronavirus.regio.v2.csv');
}

export function loadDataAustria() {
    return globalThis.d3.csv('https://raw.githubusercontent.com/Ramblurr/Austria-COVID-19/master/data/cases.csv');
}

export function loadDataSwitzerland() {
    return globalThis.d3.csv('https://raw.githubusercontent.com/covid19-eu-zh/covid19-eu-data/master/dataset/covid-19-ch.csv');
}

export function loadChart() {
    return globalThis.d3.json('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json');
}
