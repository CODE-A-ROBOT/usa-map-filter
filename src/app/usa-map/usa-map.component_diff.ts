import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.css']
})
export class UsaMapComponent implements OnInit {
  ngOnInit(): void {
    const statesData = [
      { name: 'Alabama', abbreviation: 'AL', color: 'green' },
      { name: 'Alaska', abbreviation: 'AK', color: 'blue' },
      // Add more states with colors
    ];

    const map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('/assets/us-states.geojson')
      .then(response => response.json())
      .then(geojson => {
        console.log('Fetched GeoJSON:', geojson);

        statesData.forEach(state => {
          //const stateGeoJSON = geojson.features.find(feature => feature.properties.name === state.name);
          const stateGeoJSON = geojson.features.find((feature: any) => feature.properties.name === state.name);

          if (stateGeoJSON) {
            console.log('Processing state:', state.name, 'with GeoJSON:', stateGeoJSON);

            const stateLayer = L.geoJSON(stateGeoJSON, {
              style: {
                fillColor: state.color,
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7,
              },
            })
              .addTo(map)
              .bindPopup(state.abbreviation) // Display state abbreviation on click
              .on('click', () => {
                console.log(`Clicked on ${state.name} (${state.abbreviation})`);
              });

            const bounds = stateLayer.getBounds();
            const center = bounds.getCenter();

            // Display state abbreviation over each state
            L.marker(center, {
              icon: L.divIcon({
                className: 'state-label',
                html: state.abbreviation,
              }),
            }).addTo(map);
          } else {
            console.error('Could not find GeoJSON for state:', state.name);
          }
        });
      })
      .catch(error => console.error('Error fetching GeoJSON:', error));
  }
}
