// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  getStates(): Observable<string[]> {
    return this.getData().pipe(
      map(data => Array.from(new Set(data.map(entry => entry.state)))),
      map(states => states.sort()) // Sort the states alphabetically
    );
  }
  getCategories(): Observable<string[]> {
    return this.getData().pipe(
      map(data => Array.from(new Set(data.map(entry => entry.category)))),
      map(categories => categories.sort()) // Sort the categories alphabetically
    );
  }
}
