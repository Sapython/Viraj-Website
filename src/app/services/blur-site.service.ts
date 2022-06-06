import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlurSiteService {

  constructor() { }

  startBlur(): void {
    document.getElementById('loading-on-blur')!.style.display = 'flex';
  }

  stopBlur(): void {
    document.getElementById('loading-on-blur')!.style.display = 'none';
  }
}
