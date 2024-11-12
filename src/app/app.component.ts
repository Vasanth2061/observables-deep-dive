import { Component, DestroyRef, effect, inject, OnInit,signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval,map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  count = signal(0);
  count$ = toObservable(this.count);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$,{initialValue:0});

  customInterval$ = new Observable((subscriber) => {
    let countTimes = 0;
    const interval=setInterval(() => {
      if (countTimes > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      countTimes++;
      console.log('Emitting ...');
      subscriber.next({message:'New value'})
    }, 2000);
  })

  constructor() {
    // effect(() => {
    //   console.log(`The button was clicked ${this.count()} times`)
    // });
  }

  ngOnInit(): void {
    // const subscription = interval(1000).pipe(map((val) => val * 2))
    //   .subscribe({
    //     next: (val) => console.log(val)
    //   });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: ()=> console.log('COMPLETED!')
    });

    const subscription = this.count$.subscribe({
      next: (val) =>
        console.log(`The button was clicked ${this.count()} times`),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onClick() {
    this.count.update((prev) => prev + 1);
  }
}
