// usa-map.component.ts

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    [key: string]: any;
  };
}

// GeoJSON data for Alabama
const alabamaGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-88.473227, 34.9918],
        [-85.605165, 32.840576],
        [-87.407567, 30.850476],
        [-88.473227, 34.9918]
      ]
    ]
  },
  properties: {
    name: 'Alabama'
    // Add any additional properties if needed
  }
};

// GeoJSON data for Florida
const floridaGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-87.634765625, 30.816246],
        [-81.9140625, 24.367113],
        [-80.859375, 25.761679],
        [-80.859375, 30.816246],
        [-87.634765625, 30.816246],
      ]
    ]
  },
  properties: {
    name: 'Florida'
    // Add any additional properties if needed
  }
};

const states: GeoJSONFeature[] = [alabamaGeoJSON, floridaGeoJSON];

@Component({
  selector: 'app-usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.css']
})
export class UsaMapComponent implements OnInit {
  map: any;

  
  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add logic for state click events and filtering the list



    states.forEach(state => {
      L.geoJSON(state).addTo(this.map).on('click', () => {
        // Filter the list based on the clicked state (state.properties.name)
        // Update the list in your component accordingly
        console.log(`Clicked on ${state.properties['name']}`);
      });
    });
    
  }
}
