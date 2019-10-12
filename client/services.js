import axios from 'axios';

const imdHost = 'http://localhost:3000';

const host = 'https://ons-inspire.esriuk.com';
const path = '/arcgis/rest/services/Census_Boundaries/Lower_Super_Output_Areas_December_2001_Boundaries/MapServer/2/';
const queryforLsoas = lsoas => `${host}${path}query?outFields=objectid,lsoa01cd,lsoa01nm,lsoa01nmw,shape&f=geojson&where=lsoa01cd%20IN%20%28%27${lsoas.join('%27,%27')}%27%29&outSR=3857`

export function getGeoJson (postcode) {
  return axios.get(`${imdHost}?postcode=${postcode}`)
  .then(({ data }) => {
    return {
      imds: data,
      lsoas: data.map(({ lsoa }) => lsoa)
    }
  })
  .then(({ imds, lsoas }) => {
    console.log(imds);
    return axios.get(queryforLsoas(lsoas)).then(({ data }) => ({
      imds,
      geojson: data
    }));
  }).catch(err => console.log(err))
}
