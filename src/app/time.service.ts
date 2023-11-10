// timer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private expirationTimeSubject = new BehaviorSubject<number>(0);

  get expirationTime$() {
    return this.expirationTimeSubject.asObservable();
  }

  startExpirationCountdown(expirationTime: number) {
    const expirationDate = new Date().getTime() + expirationTime;

    setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = Math.max(expirationDate - now, 0);
      this.expirationTimeSubject.next(remainingTime);

      if (remainingTime <= 0) {
        localStorage.removeItem('inventory');
      }
    }, 1000);
  }
}
