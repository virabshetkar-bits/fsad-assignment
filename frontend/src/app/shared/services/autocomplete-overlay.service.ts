import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { AutocompleteDataService } from './autocomplete-data.service';

export type AutoCompleteData = { id: number | string; name: string };

@Injectable({
  providedIn: 'root',
})
export class AutocompleteOverlayService {
  private overlay = inject(Overlay);
  private overlayRef = this.overlay.create();
  private autoCompleteComponent = new ComponentPortal(AutocompleteComponent);
  private autoCompleteRef: ComponentRef<AutocompleteComponent> | null = null;

  private orginElement: HTMLElement | null = null;

  get selectedItem() {
    return this.autoCompleteRef?.instance.selectedItem ?? null;
  }

  setInputControl(el: HTMLElement) {
    this.orginElement = el;
    this.overlayRef.updatePositionStrategy(
      this.overlay
        .position()
        .flexibleConnectedTo(el)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
          },
        ])
    );
    this.overlayRef.updateSize({
      width: (el as HTMLElement).clientWidth,
    });
  }

  updatePosition() {
    this.overlayRef.updatePosition();
    if (!this.orginElement) return;
    this.overlayRef.updateSize({
      width: this.orginElement.clientWidth,
    });
  }

  showOverlay() {
    this.autoCompleteRef = this.overlayRef.attach(this.autoCompleteComponent);
  }

  closeOverlay() {
    this.overlayRef.detach();
  }
}
