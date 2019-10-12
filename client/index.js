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
import geojson from './geojson';
import lmd from './lmd';


var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 1})
});

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
  'Shade1': new Style({
    stroke: new Stroke({
      color: '#99252e',
      width: 1,
    }),
    fill: new Fill({
      color: '#99252333'
    })
  }),
  'Shade2': new Style({
    stroke: new Stroke({
      color: '#99252e',
      width: 1,
    }),
    fill: new Fill({
      color: '#99252355'
    })
  }),
  'Shade3': new Style({
    stroke: new Stroke({
      color: '#99252e',
      width: 1,
    }),
    fill: new Fill({
      color: '#99252377'
    })
  }),
  'Shade4': new Style({
    stroke: new Stroke({
      color: '#99252e',
      width: 1,
    }),
    fill: new Fill({
      color: '#99252399'
    })
  }),
  'Shade5': new Style({
    stroke: new Stroke({
      color: '#99252e',
      width: 1,
    }),
    fill: new Fill({
      color: '#992523bb'
    })
  })
};

var styleFunction = function(feature) {
  //todo: based on IMD data, select the correct shade
  console.log(feature);
  if (feature.values_ && feature.values_.lsoa01cd === 'E01000001') {
    return styles['Shade1'];
  }

  return styles['Shade5'];
  return styles[feature.getGeometry().getType()];
};

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
  condition: click
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

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}