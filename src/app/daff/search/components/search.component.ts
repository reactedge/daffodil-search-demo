import {ChangeDetectorRef, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DaffTelemetryActivityFactory } from '@daffodil/telemetry';
import { ProductSearchService } from '../services/product-search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: '../templates/search.component.html',
  styleUrl: '../styles/search.component.scss'
})
export class SearchComponent {
  private readonly activity;

  public searchTerm = '';

  public message = '';

  public status:
    | 'idle'
    | 'searching'
    | 'success'
    | 'error' = 'idle';

  constructor(
    private readonly productSearchService: ProductSearchService,
    private readonly cdr: ChangeDetectorRef,
    private readonly activityFactory: DaffTelemetryActivityFactory
  ) {
    this.activity = this.activityFactory.create('search-demo');
  }
  async handleSearch() {

    const searchTerm = this.searchTerm.trim();

    if (!searchTerm) {
      return;
    }

    const operation =
      this.activity.startOperation(
        'search',
        { searchTerm }
      );

    try {
      this.setStatus('searching');

      const resultCount =
        await this.productSearchService.searchProducts(searchTerm);

      if (searchTerm === 'error') {
        throw new Error('Search backend unavailable');
      }

      this.activity.endOperation(
        operation,
        {
          resultCount
        }
      );

      this.setStatus(
        'success',
        `found ${resultCount} products`
      );

    } catch (error) {
      this.activity.failOperation(
        operation,
        {
          error: error instanceof Error
            ? error.message
            : 'Unknown error'
        }
      );

      this.setStatus('error');
    }
  }

  private setStatus(
    status: 'idle' | 'searching' | 'success' | 'error',
    message?: string
  ): void {

    this.status = status;

    if (message !== undefined) {
      this.message = message;
    }

    if (status === 'error') {
      this.message = ''
    }

    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
