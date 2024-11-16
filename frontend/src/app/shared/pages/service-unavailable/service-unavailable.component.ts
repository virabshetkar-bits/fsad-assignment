import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [],
  templateUrl: './service-unavailable.component.html',
  styleUrl: './service-unavailable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceUnavailableComponent {

}
