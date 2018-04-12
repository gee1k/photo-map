import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as maptalks from "maptalks";
import 'maptalks/dist/maptalks.css'
import './Map.css';
import PhotoUpload from '../../components/upload/PhotoUpload';
import './CoordinateTransform';

class Map extends Component {
  componentDidMount() {
    this.map = new maptalks.Map("map", {
      center: [120.45, 31.23],
      zoom: 10,
      layerSwitcherControl: {
        'position'  : 'top-left',
        'baseTitle' : '基础底图',
        'overlayTitle': '',
        'excludeLayers' : ['v'],
        'containerClass' : 'maptalks-layer-switcher'
      },
      baseLayer: new maptalks.GroupTileLayer('Base TileLayer', [
        new maptalks.TileLayer('Carto light',{
          'urlTemplate': 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'subdomains'  : ['a','b','c','d']
        }),
        new maptalks.TileLayer('Carto dark',{
          'visible' : false,
          'urlTemplate': 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          'subdomains'  : ['a','b','c','d']
        })
      ]),
      layers: [new maptalks.VectorLayer("v")]
    });

    this.initToolbar();
    this.initPanel();
    this.map.on('click', function(e){console.log(e)})
  }

  initToolbar() {
    new maptalks.control.Toolbar({
      'position' : 'top-right',
      items: [
        {
          'item' : '重置',
          'click' : () => {
            this.resetMap();
          }
        }
      ]
    }).addTo(this.map);
  }

  initPanel() {
    let customPanel = new maptalks.control.Panel({
      'position': {"top" : 0, "left" : document.body.clientWidth / 2},
      'draggable': true,
      'custom': true,
      'content': '<div id="photo-upload-container"></div>'
    });
    this.map.addControl(customPanel);
    ReactDOM.render(<PhotoUpload okCallback={this.uploadCallback.bind(this)}/>, document.getElementById('photo-upload-container'))
  }

  resetMap() {
    requestAnimationFrame(_ => {
      this.map.setPitch(0);
      this.map.setBearing(0);
    });
  }
  

  uploadCallback(list) {
    list.filter(item => !!item.exifData).forEach(item => {
      let marker = new maptalks.Marker(item.exifData.coord).addTo(this.map.getLayer('v'));
      marker.setInfoWindow({
        'content'   : `<img style="width: 100%; heihgt: 100%;" src="${item.base64}" />`,
        'autoPan': true,
        // 'width': 300,
        // 'minHeight': 120,
        // 'custom': false,
        //'autoOpenOn' : 'click',  //set to null if not to open when clicking on marker
        //'autoCloseOn' : 'click'
      });
    });
  }

  changeView() {
    this.map.animateTo({
      center: [120.45, 31.23],
      zoom: 4,
      pitch: 0,
      bearing: 20
    }, {
      duration: 5000
    });
    setTimeout(_ => {
      this.map.animateTo({
        center: [120.45, 31.23],
        zoom: 18,
        pitch: 65,
        bearing: 360
      }, {
        duration: 7000
      });
    }, 7000);
  }

  render() {
    return <div className="map-container" id="map" />;
  }
}

export default Map;