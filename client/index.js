import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {click} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { getGeoJson } from './services';
var imdDataKey = 'imd_decile';
const lsoaCount = 34753;

var lmd = [];

function buildShadeStyle(color, stroke) {
  return new Style({
    stroke: new Stroke({
      color: stroke || 'black',
      width: 1
    }),
    fill: new Fill({
      color: color,
    }),
  });
}
var styles = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.5)'
    })
  }),
  'Shade1': buildShadeStyle('#dc354588'),
  'Shade2': buildShadeStyle('#e4606d88'),
  'Shade3': buildShadeStyle('#eb8c9588'),
  'Shade4': buildShadeStyle('#f3b7bd88'),
  'Shade5': buildShadeStyle('#f6cdd188'),
  'Shade6': buildShadeStyle('#afecbd88'),
  'Shade7': buildShadeStyle('#86e29b88'),
  'Shade8': buildShadeStyle('#5dd87988'),
  'Shade9': buildShadeStyle('#34ce5788'),
  'Shade10': buildShadeStyle('#28a74588'),
};

var styleFunction = function(feature) {
  let values = feature.values_;
  let lsoaCode = values.lsoa01cd;
  var lmdData = lmd.find((lmd) => lmd.lsoa === lsoaCode);
  if (lmdData) {
    return styles['Shade' + lmdData[imdDataKey]];
  }

  return styles['Shade5'];
  return styles[feature.getGeometry().getType()];
};

// Interaction / Event Handlers
var select = new Select({
  condition: click,
  style: new Style({
    stroke: new Stroke({
      color: '#4a49ff',
      width: 1,
    }),
    fill: new Fill({
      color: '#4a49ff88',
    }),
  }),
});
  
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
  ],
  target: 'map',
  view: new View({
    center: fromLonLat([-0.127758, 51.507351]),
    zoom: 12
  })
});

var vectorLayer;

document.getElementById('submit').addEventListener('click', e => {
  e.preventDefault();
  const postcode = document.getElementById('postcode').value;

  if(vectorLayer) {
    map.removeLayer(vectorLayer);
  }

  getGeoJson(postcode).then(({ imds, geojson}) => {
    lmd = imds;
    var features = (new GeoJSON()).readFeatures(geojson);
    var vectorSource = new VectorSource({
      // features: (new GeoJSON()).readFeatures(geojsonObject)
      features: features
    });

    vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction
    });

    map.addInteraction(select);
    map.addLayer(vectorLayer);

    select.on('select', function (e) {
      var panel = document.getElementById('lsoa-detail-panel');
      if (e && e.selected && e.selected.length) {
        let values = e.selected[0].values_;
        let lsoaCode = values.lsoa01cd;
        var lmdData = lmd.find((lmd) => lmd.lsoa === lsoaCode);
        if (lmdData) {
          document.getElementById('lsoa-name').innerHTML = values.lsoa01nm;
        } else {
          document.getElementById('lsoa-name').innerHTML = 'No data';
        }
      renderLsoaDetail(lmdData, 'imd');
      renderLsoaDetail(lmdData, 'income');
      renderLsoaDetail(lmdData, 'education');
      renderLsoaDetail(lmdData, 'employment');
      renderLsoaDetail(lmdData, 'environment');
      renderLsoaDetail(lmdData, 'health');
      renderLsoaDetail(lmdData, 'crime');
      renderLsoaDetail(lmdData, 'housing');
      renderLsoaDetail(lmdData, 'child');
      renderLsoaDetail(lmdData, 'older');

        renderLsoaDetail(lmdData, 'imd');
        renderLsoaDetail(lmdData, 'income');

        panel.classList.remove("invisible");

      } else {
        panel.classList.add("invisible");
      }
    });
  });
});

function renderLsoaDetail(imdData, dataKey) {
  var resultContainer = document.getElementById(dataKey + '-result');
  resultContainer.classList.remove('decile-10');
  resultContainer.classList.remove('decile-20');
  resultContainer.classList.remove('decile-30');
  resultContainer.classList.remove('decile-40');
  resultContainer.classList.remove('decile-50');
  resultContainer.classList.remove('decile-60');
  resultContainer.classList.remove('decile-70');
  resultContainer.classList.remove('decile-80');
  resultContainer.classList.remove('decile-90');
  resultContainer.classList.remove('decile-100');

  if (imdData) {
    resultContainer.classList.add('decile-' + imdData[dataKey + '_decile'] + '0');

    var rank = parseInt(imdData[dataKey + '_rank'].replace(',',''));
    var percentile = Math.round(rank / lsoaCount * 1000) / 10;
    document.getElementById(dataKey + '-percentile').innerHTML = percentile.toFixed(1) + '%';

    var detailContent = imdData[dataKey + '_rank'] + '/' + formatNumber(lsoaCount)
      + '<br>';
    switch (imdData[dataKey + '_decile']) {
      case "1":
      case "2":
      case "3":
        detailContent += 'Most Deprived';
        break;
      case "4":
      case "5":
      case "6":
      case "7":
        detailContent += 'Somewhat Deprived';
        break;
      case "8":
      case "9":
      case "10":
        detailContent += 'Least Deprived';
        break;
    }
    document.getElementById(dataKey + '-detail').innerHTML = detailContent;
  } else {
    document.getElementById(dataKey + '-percentile').innerHTML = '';
    document.getElementById(dataKey + '-detail').innerHTML = 'No data';
  }
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

var radioButtons = document.getElementsByClassName('radio-data-key');
for (var i=0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener("click", function (e) {
    console.log(e.target.value);
    imdDataKey = e.target.value + '_decile';

    if (vectorLayer) {
      vectorLayer.getSource().changed();
    }
  });
}