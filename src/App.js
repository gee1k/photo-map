import React, { Component } from "react";
import * as maptalks from "maptalks";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.map = new maptalks.Map("map", {
      center: [120.45, 31.23],
      zoom: 10,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c", "d"],
        attribution: '&copy; <a href="https://svend.cc">Svend</a>'
      }),
      layers: [new maptalks.VectorLayer("v", [new maptalks.Marker([180, 0])])]
    });

    // this.changeView();
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

export default App;
