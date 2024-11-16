import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booklisting } from '../../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-listings-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './book-listings-item.component.html',
  styleUrl: './book-listings-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListingsItemComponent {

  showEdit = input(false);
  booklisting = input.required<Booklisting>();

  onEdit = output();
  onDelete = output();
  click = output();
}
