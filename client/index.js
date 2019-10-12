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
getGeoJson().then(({ imds, geojson}) => {
  lmd = imds;
  var features = (new GeoJSON()).readFeatures(geojson);
  var vectorSource = new VectorSource({
    // features: (new GeoJSON()).readFeatures(geojsonObject)
    features: features
  });
  var vectorLayer = new VectorLayer({
    source: vectorSource,
    style: styleFunction
  });

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
      vectorLayer
    ],
    target: 'map',
    view: new View({
      center: fromLonLat([-0.127758, 51.507351]),
      zoom: 12
    })
  });

  map.addInteraction(select);

  const lsoaCount = 34753;
  select.on('select', function (e) {
    var panel = document.getElementById('lsoa-detail-panel');
    if (e && e.selected && e.selected.length) {
      var imdResultContainer = document.getElementById('imd-result');
      imdResultContainer.classList.remove('decile-10');
      imdResultContainer.classList.remove('decile-20');
      imdResultContainer.classList.remove('decile-30');
      imdResultContainer.classList.remove('decile-40');
      imdResultContainer.classList.remove('decile-50');
      imdResultContainer.classList.remove('decile-60');
      imdResultContainer.classList.remove('decile-70');
      imdResultContainer.classList.remove('decile-80');
      imdResultContainer.classList.remove('decile-90');
      imdResultContainer.classList.remove('decile-100');

      let values = e.selected[0].values_;
      let lsoaCode = values.lsoa01cd;
      var lmdData = lmd.find((lmd) => lmd.lsoa === lsoaCode);
      if (lmdData) {
        document.getElementById('lsoa-name').innerHTML = values.lsoa01nm;
        imdResultContainer.classList.add('decile-' + lmdData.imd_decile + '0');

        var rank = parseInt(lmdData.imd_rank.replace(',',''));
        var percentile = Math.round(rank / lsoaCount * 1000) / 10;
        document.getElementById('imd-percentile').innerHTML = percentile.toFixed(1) + '%';

        var detailContent = lmdData.imd_rank + '/' + formatNumber(lsoaCount)
        + '<br>';
        switch (lmdData.imd_decile) {
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
        document.getElementById('imd-detail').innerHTML = detailContent;
      } else {
        document.getElementById('lsoa-name').innerHTML = 'No data';
        document.getElementById('imd-percentile').innerHTML = '';
        document.getElementById('imd-detail').innerHTML = 'No data';
      }
      panel.classList.remove("invisible");

    } else {
      panel.classList.add("invisible");
    }
  });
});

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}