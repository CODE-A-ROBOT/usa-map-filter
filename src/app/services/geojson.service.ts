// geojson.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoJsonService {
  private geoJsonUrl = 'assets/us-states.geojson';

  constructor(private http: HttpClient) { }

  getGeoJson(): Observable<any> {
    return this.http.get<any>(this.geoJsonUrl);
  }
}
