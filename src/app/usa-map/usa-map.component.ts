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
      });
    });
    
  }


  filterData(): void {
    this.filteredEntries = this.selectedState
      ? this.entries.filter(entry => entry.state === this.selectedState)
      : this.entries;
  }
}