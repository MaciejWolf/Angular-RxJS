import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';

  pageTitle$ = this.productService.selectedProduct$
    .pipe(
      map((p: Product) => p ? `Product Detail for: ${p.productName}` : null)
    )

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  productSuppliers$ = this.productService.selectedProductSuppliersLazy$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) { }
}
