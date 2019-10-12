import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {toStringXY} from 'ol/coordinate';
import Circle from 'ol/geom/Circle';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import geojson from './geojson';


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