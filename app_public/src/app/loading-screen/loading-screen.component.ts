import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { LoadingScreenService } from "./loading-screen.service";

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {

  loading: boolean = false;
  loadingSubscription: Subscription | undefined;

  constructor(
    private loadingScreenService: LoadingScreenService,
    private _elmRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit():void {
    this.loadingSubscription = this.loadingScreenService.loadingStatus
    .pipe(debounceTime(200)).subscribe(
      (status: boolean) => {
        this._elmRef.nativeElement.style.display = status? 'block': 'none';
        this._changeDetectorRef.detectChanges();
      }
    );
    this._elmRef.nativeElement.style.display = 'none';
  }

  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe();
  }

}
