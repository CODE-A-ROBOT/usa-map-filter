// iplog.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const IPINFO_API_TOKEN="a1172bd46d836a";
const IPGEOLOCATION_API = "https://api.ipgeolocationapi.com/geolocate";
const LOGIP_URL = `${origin}/logIP`;

@Injectable({
  providedIn: 'root'
})
export class IPLogService {

    constructor(private http: HttpClient) { }

    logUserIpAddress(): void {
        // Make an HTTP request to an IP geolocation service

        this.http.get(IPGEOLOCATION_API, { headers: { 'Api-Key': IPINFO_API_TOKEN } }).subscribe(
          (response: any) => {
            const ipAddress = response.ip;
            console.log(`User's IP Address: ${ipAddress}`);
            // You can now display the IP address or use it for other purposes

            this.http.post(LOGIP_URL, { ip: ipAddress }).subscribe(
                (response: any) => {
                    console.log('Server response:', response);
                },
                (error) => {
                    console.error('Error posting data to server:', error);
                }
                );
          },
          (error) => {
            console.error('Error fetching IP address:', error);
          }
        );
    }
    
}