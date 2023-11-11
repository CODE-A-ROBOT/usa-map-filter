// usa-map.component.ts

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';
import { GeoJsonService } from '../services/geojson.service';
//import 'leaflet-defaulticon-compatibility';
//import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

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

    <h2> </h2>
    <div class="filters-container">
      <select [(ngModel)]="selectedState" (change)="filterData()">
        <option value="">All States</option>
        <option *ngFor="let state of states$ | async" [value]="state">{{ state }}</option>
      </select>
      <select [(ngModel)]="selectedCategory" (change)="filterData()">
        <option value="">All Categories</option>
        <option *ngFor="let category of categories$ | async" [value]="category">{{ category }}</option>
      </select>
    </div>
    <ul class="entry-list">
    <li *ngFor="let entry of filteredEntries" class="entry-item">
        <img *ngIf="entry.image" [src]="entry.image" alt="Entry Image" class="entry-image">
        <a href="{{ entry.website }}"><span class="entry-text">{{ entry.bizName }}</span></a>
        <span class="entry-text">&nbsp;- {{ entry.state }} - {{ entry.category }}</span>
      </li>
    </ul>
    `,
  styleUrls: ['./usa-map.component.css']
})



export class UsaMapComponent implements OnInit {
  map: any;
  //map: L.Map | undefined;
  geojsonLayers: { [key: string]: L.GeoJSON } = {}; 
  private geoJsonUrl = 'assets/usa-states.geojson';

  selectedState = '';
  states$ = this.dataService.getStates();
  selectedCategory = '';
  categories$ = this.dataService.getCategories();
  entries: any[] = [];
  filteredEntries: any[] = [];

  constructor(private dataService: DataService, private geoJsonService: GeoJsonService) {}
  

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.entries = data;
      this.filteredEntries = this.entries;
      this.initializeMap();
      //this.addGeoJSONLayers();
      this.loadGeoJSON();

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

  addGeoJSONLayers(): void {
    const geojsons = {
      AZ: azGeoJSON,
      CA: caGeoJSON,
      FL: flGeoJSON,
      MI: mnGeoJSON,
      MN: miGeoJSON,
      // Add more states/countries as needed
    };

    Object.entries(geojsons).forEach(([stateAbbreviation, geojson]) => {
      const geojsonLayer = L.geoJSON(geojson, {
        style: () => ({
          fillColor: this.getRandomColor(),
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            this.selectedState = stateAbbreviation;
            this.filterData();
          });
        }
      });
      console.log(`Adding GeoJSON layer for ${stateAbbreviation}`);
      console.log('GeoJSON Layer:', geojsonLayer); // Log the GeoJSON layer
  
      this.geojsonLayers[stateAbbreviation] = geojsonLayer;
    });
  
    console.log('All GeoJSON Layers:', this.geojsonLayers); // Log all GeoJSON layers
  
    this.updateMap();
  }

  updateMap(): void {
    if (this.map) {
      Object.values(this.geojsonLayers).forEach(layer => {
        layer.addTo(this.map!);
      });
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  private loadGeoJSON(): void {
    // Load GeoJSON data for USA states using the GeoJsonService
    this.geoJsonService.getGeoJson().subscribe((data: any) => {
      const states = data.features;
  
      // Add Markers for each state
      states.forEach((state: any) => {
        const stateName = state.properties.abbreviation;
  
        // Check if the state has valid coordinates
        if (state.geometry && state.geometry.coordinates && state.geometry.coordinates.length > 0) {
          const coordinates = state.geometry.coordinates[0][0]; // Adjust the structure based on your GeoJSON
          console.log(` coordinates for ${stateName}: ${coordinates}`);

          // Check if the coordinates have valid latitude and longitude values
          if (coordinates && coordinates.length === 2) {
            //const marker = L.marker([coordinates[1], coordinates[0]])
            //.bindPopup(stateName)
            //.addTo(this.map);          
          } else {
            console.error(`Invalid coordinates for ${stateName}`);
          }
        } else {
          console.error(`Invalid geometry for ${stateName}`);
        }
      });
    });
  }
  

  filterData(): void {
    this.filteredEntries = this.entries;

    if (this.selectedState) {
      this.filteredEntries = this.filteredEntries.filter(entry => entry.state === this.selectedState);
    }

    if (this.selectedCategory) {
      this.filteredEntries = this.filteredEntries.filter(entry => entry.category === this.selectedCategory);
    }
  }
}