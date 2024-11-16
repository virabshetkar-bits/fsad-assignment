import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AutocompleteDataService } from '../../services/autocomplete-data.service';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  private autoCompleteData = inject(AutocompleteDataService);

  items = this.autoCompleteData.data;
  selectedItem = this.autoCompleteData.selectedItem;
}
