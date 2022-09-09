import { Component, Input, OnInit, Type } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/* NgRx */
import { Store } from '@ngrx/store';
import { State, getCurrentProduct } from '../state/product.reducer';
import * as ProductActions from '../state/product.actions';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../product';
@Component({
  selector: 'pm-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | null>;

  constructor(private store: Store<State>, private modalService: NgbModal) {}

  ngOnInit() {
    // Watch for changes to the currently selected product
    this.product$ = this.store
      .select(getCurrentProduct)
      .pipe(tap((currentProduct) => console.log(currentProduct)));
  }
  @Input() product;

  close() {
    this.modalService.dismissAll();
  }
}
