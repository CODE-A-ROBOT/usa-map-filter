// usa-map.component.ts

import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';
import { GeoJsonService } from '../services/geojson.service';
import { GeoJsonObject } from 'geojson';
import { first } from 'rxjs/operators';

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
    <div id="map" style="height: 360px;"></div>
    <!-- Your component template -->

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
      <li *ngFor="let entry of filteredEntries" class="entry-item" [ngClass]="{ 'verified-false': !(entry.verified==true) }">
        <img *ngIf="entry.image&&entry.verified==true" [src]="entry.image" alt="Entry Image" class="entry-image">
        <a *ngIf="entry.verified==true; else unverified" href="{{ entry.website }}">
          <span class="entry-text">{{ entry.bizName }}</span>
        </a>
        <ng-template #unverified>
          <span class="entry-text">(under review) {{ entry.bizName }}</span>
        </ng-template>
        <span class="entry-text">&nbsp;- {{ entry.state }} - {{ entry.category }}</span>
      </li>
    </ul>
    <div class="form-container">
      <h3>Submit New Entry for Review:</h3>
      <form (submit)="onAddNewEntry()">
        <!-- Thank you message -->
        <div *ngIf="showThankYouMessage">
          Thank you for submitting, your entry will be reviewed soon.
        </div>       
         <!-- Error message -->
        <div *ngIf="showErrorMessage">
          Something went wrong, please try again with valid information.
        </div>
        <div>
        <label class="form-label" for="bizName">Entity Name: </label>
        <input class="form-field" type="text" id="bizName" name="bizName" [(ngModel)]="newEntry.bizName" required>
        </div>
        <div>
        <label class="form-label" for="state">State: </label>
        <select class="form-select" id="state" name="state" [(ngModel)]="newEntry.state">
          <option value="">Select</option>
          <option *ngFor="let state of states$ | async" [value]="state">{{ state }}</option>
        </select>
        </div>
        <div>
        <label class="form-label" for="category">Category: </label>
        <select class="form-select" id="category" name="category" [(ngModel)]="newEntry.category">
          <option value="">Select</option>
          <option *ngFor="let category of categories$ | async" [value]="category">{{ category }}</option>
        </select>
        </div>
        <div>
        <label class="form-label" for="description">Description: </label>
        <input class="form-field" type="text" id="description" name="description" [(ngModel)]="newEntry.description" required>
        </div>
        <div>
        <label class="form-label" for="description">Website: </label>
        <input class="form-field" type="text" id="website" name="website" [(ngModel)]="newEntry.website" required>
        </div>
        <div>
        <label class="form-label" for="description">Address: </label>
        <input class="form-field" type="text" id="address" name="address" [(ngModel)]="newEntry.address" optional>
        </div>
        <div>
        <label class="form-label" for="description">Phone: </label>
        <input class="form-field" type="text" id="phone" name="phone" [(ngModel)]="newEntry.phone" optional>
        </div>
        <div>
        <label class="form-label" for="description">Email: </label>
        <input class="form-field" type="text" id="email" name="email" [(ngModel)]="newEntry.email" optional>
        </div>
        <div>
        <label class="form-label" for="description">Contact: </label>
        <input class="form-field" type="text" id="contact" name="contact" [(ngModel)]="newEntry.contact" optional>
        </div>
        <div>
        <button class="form-button" type="submit">Submit</button>
        </div>
        
      </form>
    </div>
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
  newEntry: { 
    bizName: string, 
    state: string, 
    category: string, 
    description: string, 
    website: string, 
    address: string, 
    phone: string, 
    email: string, 
    contact: string,
    verified: boolean
  } = { 
    bizName: '', 
    state: '' , 
    category: '', 
    description: '', 
    website: '', 
    address: '', 
    phone: '', 
    email: '', 
    contact: '',
    verified: false
  };
  showThankYouMessage = false;
  showErrorMessage = false;

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

    // Add Pagini Romanesti SUA text overlay
    const mapTitle = L.DomUtil.get('map-title') || L.DomUtil.create('div', 'map-title');
    mapTitle.innerHTML = '<h2>Pagini Romanesti SUA</h2>';
    mapTitle.style.position = 'absolute';
    mapTitle.style.top = '20px'; // Adjust the top position as needed
    mapTitle.style.left = '50%';
    mapTitle.style.transform = 'translateX(-50%)';
    this.map.getContainer().appendChild(mapTitle);
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


  onAddNewEntry(): void {
    // Perform validation or additional logic as needed
    if (this.newEntry.bizName && this.newEntry.state && this.newEntry.category) {
      // Add the new entry to your data
      this.dataService.addEntry(this.newEntry).subscribe((addedEntry) => {
        // Handle the added entry as needed
        console.log('Added Entry:', addedEntry);
      });

      // Filter and update the map as needed
      this.filterData();

      // Clear the form after adding the entry
      this.newEntry = { 
        bizName: '', 
        state: '' , 
        category: '', 
        description: '', 
        website: '', 
        address: '', 
        phone: '', 
        email: '', 
        contact: '',
        verified: false
      };
      // Set the flag to true after successful submission
      this.showThankYouMessage = true;

      // Hide the message after 5 seconds
      setTimeout(() => {
        this.showThankYouMessage = false;
      }, 5000);
    } else {
      console.error('Please fill in all fields.');
      // Set the flag to true after successful submission
      this.showErrorMessage = true;

      // Hide the message after 5 seconds
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 5000);
    }
  }

}
