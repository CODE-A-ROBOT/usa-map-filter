// usa-map.component.ts

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';
import { GeoJsonService } from '../services/geojson.service';
import { GeoJsonObject } from 'geojson';

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

@Component({
  selector: 'app-usa-map',
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
      this.loadGeoJSON();
    });
  }

  initializeMap(): void {
    this.map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadGeoJSON(): void {
    // Load GeoJSON data for USA states using the GeoJsonService
    this.geoJsonService.getGeoJson().subscribe((data: any) => {
      const states = data.features;
  
      // Add both polygon and text label for each state
      states.forEach((state: any) => {
        const stateName = state.properties.name;
        const stateAbbreviation = state.properties.abbreviation;
  
        // Check if the state has valid coordinates
        if (state.geometry && state.geometry.coordinates) {
          // Handle both Polygon and MultiPolygon
          const coordinates = state.geometry.type === 'Polygon' ?
            [state.geometry.coordinates] :
            state.geometry.coordinates;
  
          // Check if the coordinates have valid latitude and longitude values
          if (coordinates) {
            // Create a colored polygon for the state
            const polygon = L.geoJSON(state, {
              style: {
                fillColor: this.getRandomColor(),
                color: 'white',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
              }
            });
  
            // Add the polygon to the map
            polygon.addTo(this.map);
  
            // Calculate the center of the state polygon
            const bounds = polygon.getBounds();
            const center = bounds.getCenter();
  
            // Create a text label for the state abbreviation
            const label = L.divIcon({
              className: 'state-label',
              html: `<b>${stateAbbreviation}</b>`,
            });
  
            // Add the text label to the map at the center of the state
            const labelMarker = L.marker(center, { icon: label }).addTo(this.map);
  
            // Add click event to set state filter option
            labelMarker.on('click', () => {
              this.selectedState = stateAbbreviation;
              console.log(`Selected state: ${stateAbbreviation}`);

              this.filterData();
            });
          } else {
            console.error(`Invalid coordinates for ${stateName}`);
          }
        } else {
          console.error(`Invalid geometry for ${stateName}`);
        }
      });
    });
  }
  



  private addGeoJSONLayer(stateName: string, coordinates: any): void {
    const geojsonLayer = L.geoJSON({
      type: 'Polygon',
      coordinates: coordinates,
      properties: {
        name: stateName,
      },
    } as GeoJsonObject, {
      style: () => ({
        fillColor: this.getRandomColor(),
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      }),
    });
  
    geojsonLayer.addTo(this.map);
  
    // Store the GeoJSON layer for potential future use
    this.geojsonLayers[stateName] = geojsonLayer;
  
    // Log coordinates for each state
   // this.logCoordinates(stateName, coordinates);
  }

 
  private logCoordinates(stateName: string, coordinates: any): void {
    coordinates.forEach((ring: any) => {
      ring.forEach((coordinate: number[]) => {
        console.log(`Coordinates for ${stateName}: ${coordinate}`);
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

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
