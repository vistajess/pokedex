import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service for managing filters
 */
@Injectable({ providedIn: 'root' })
export class FilterService {
  /**
   * Subject for clearing filters
   */
  onClearFiltersClicked = new Subject<void>();
}
