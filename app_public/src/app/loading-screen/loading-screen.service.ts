import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {
  private _loading: number = 0;
  loadingStatus: Subject<boolean> = new Subject();
  isLoading() { return this._loading != 0; }
  startLoading() { ++this._loading; }
  stopLoading() {
    this._loading = Math.max(0, this._loading - 1);
    this.loadingStatus.next(!!this._loading);
  }
}
