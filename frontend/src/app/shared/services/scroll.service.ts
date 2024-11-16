import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinct, fromEvent, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollEvent = fromEvent(window, 'scroll');

  onTop = toSignal(
    this.scrollEvent.pipe(
      map(() => document.scrollingElement?.scrollTop === 0)
    ),
    { initialValue: true }
  );

  nearBottom = toSignal(
    this.scrollEvent.pipe(
      map(() => {
        if (!document.scrollingElement) return false;

        if (
          document.scrollingElement?.scrollHeight -
            document.scrollingElement?.clientHeight -
            document.scrollingElement?.scrollTop <
          100
        )
          return true;
        return false;
      }, distinct())
    )
  );
}
