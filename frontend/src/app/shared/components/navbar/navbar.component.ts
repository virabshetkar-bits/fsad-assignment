import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollService } from '../../services/scroll.service';
import { map, Subscription, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { BooksSearchService } from '../../../books/services/books-search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  host: {
    '[class.small]': 'isSmall()',
    '[class.top]': 'onTop()',
  },
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    CdkMenuModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private booksSearch = inject(BooksSearchService);

  params = this.booksSearch.params;

  user = this.auth.user;

  onTop = inject(ScrollService).onTop;
  sub = new Subscription();
  observer = inject(BreakpointObserver);
  isSmall = toSignal(
    this.observer.observe([Breakpoints.XSmall]).pipe(
      map((data) => data.matches),
      tap((data) => console.log(data))
    )
  );

  logout() {
    this.auth.logout();
  }
}
