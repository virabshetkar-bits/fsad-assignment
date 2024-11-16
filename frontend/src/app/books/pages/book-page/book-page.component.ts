import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Booklisting } from '../../../book-listings/models';
import { ActivatedRoute } from '@angular/router';
import { JoinStringsPipe } from '../../../shared/pipes/join-strings.pipe';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [JoinStringsPipe, TitleCasePipe],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookPageComponent {

  booklisting = inject(ActivatedRoute).snapshot.data['booklisting'] as Booklisting;
}
