// usa-map.component.ts

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';

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
const alGeoJSON: GeoJSONFeature = {
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
    name: 'AL'
    // Add any additional properties if needed
  }
};

// GeoJSON data for Florida
const flGeoJSON: GeoJSONFeature = {
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
    name: 'FL'
    // Add any additional properties if needed
  }
};
const azGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: 'AZ'
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-114.818, 37.004],
        [-109.045, 37.004],
        [-109.045, 31.332],
        [-114.818, 31.332],
        [-114.818, 37.004]
      ]
    ]
  }
};

const caGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: 'CA'
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-124.482003, 35.813046],
        [-118.593969, 35.813046],
        [-118.593969, 32.534156],
        [-124.482003, 32.534156],
        [-124.482003, 35.813046]
      ]
    ]
  }
};
const miGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: 'MI'
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-89.6, 45.6],
        [-84.5, 45.6],
        [-83.3, 45],
        [-82.4, 43],
        [-84.5, 41.8],
        [-86.2, 41.8],
        [-88, 43],
        [-89.6, 45.6]
      ]
    ]
  }
};

const mnGeoJSON: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: 'MN'
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-92.1, 46.7],
        [-89.5, 46.7],
        [-89.5, 49],
        [-95.3, 49],
        [-97.2, 48.6],
        [-97.2, 45.9],
        [-92.1, 46.7]
      ]
    ]
  }
};
const states: GeoJSONFeature[] = [azGeoJSON, caGeoJSON, flGeoJSON, miGeoJSON, mnGeoJSON];

@Component({
  selector: 'app-usa-map',
  //templateUrl: './usa-map.component.html',
  template: `
    <div id="map" style="height: 500px;"></div>

    <h2>List of Entries</h2>
    <select [(ngModel)]="selectedState" (change)="filterData()">
      <option value="">All States</option>
      <option *ngFor="let state of states$ | async" [value]="state">{{ state }}</option>
    </select>
    <ul>
      <li *ngFor="let entry of filteredEntries">
        {{ entry.bizName }} - {{ entry.state }}
      </li>
    </ul>
    `,
  styleUrls: ['./usa-map.component.css']
})
export class UsaMapComponent implements OnInit {
  map: any;
  selectedState = '';
  states$ = this.dataService.getStates();
  entries: any[] = [];
  filteredEntries: any[] = [];

  constructor(private dataService: DataService) {}
  
  ngOnInit(): void {
    this.initializeMap();
    this.dataService.getData().subscribe(data => {
      this.entries = data;
      this.filteredEntries = this.entries;
      console.log("States: ", this.states$);
    });
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
        this.selectedState = state.properties['name'];
        this.filterData();
      });
    });
    
  }


  filterData(): void {
    this.filteredEntries = this.selectedState
      ? this.entries.filter(entry => entry.state === this.selectedState)
      : this.entries;
  }
}