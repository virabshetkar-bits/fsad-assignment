import { computed, Injectable, signal } from '@angular/core';

type AutoCompleteData = {
  id: number | string;
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class AutocompleteDataService {
  private dataSignal = signal<AutoCompleteData[]>([]);
  data = this.dataSignal.asReadonly();

  private selectedIndexSignal = signal<number | null>(null);

  selectedItem = computed(() => {
    const selectedIndex = this.selectedIndexSignal();
    if (selectedIndex === null) return null;
    return this.dataSignal()[selectedIndex];
  });

  selectItem(index: number | null) {
    this.selectedIndexSignal.set(index);
  }

  next() {
    this.selectedIndexSignal.update((index) => {
      if (index === null) return 0;
      return (index + 1) % this.dataSignal().length;
    });
  }

  prev() {
    this.selectedIndexSignal.update((index) => {
      if (index === null) return 0;
      const len = this.dataSignal().length;
      return (index - 1 + len) % len;
    });
  }

  setData(data: AutoCompleteData[]) {
    this.dataSignal.set(data);
  }
}
