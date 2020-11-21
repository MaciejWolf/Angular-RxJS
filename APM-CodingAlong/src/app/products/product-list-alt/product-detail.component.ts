import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private pageTitle$ = this.productService.selectedProduct$
    .pipe(
      map((p: Product) => p ? `Product Detail for: ${p.productName}` : null)
    )

  private product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  private productSuppliers$ = this.productService.selectedProductSuppliersLazy$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

    vm$ = combineLatest([
      this.product$,
      this.productSuppliers$,
      this.pageTitle$
    ]).pipe(
      filter(([product]) => Boolean(product)),
      map(([product, suppliers, pageTitle]) => ({ product, suppliers, pageTitle }))
    )

  constructor(private productService: ProductService) { }
}
