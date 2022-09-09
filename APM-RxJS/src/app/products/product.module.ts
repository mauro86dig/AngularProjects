import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ProductShellComponent } from './product-shell/product-shell.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { productReducer } from './state/product.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductEffects } from './state/product.effects';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ModalContainerComponent } from './product-details/modal-container.component';

const productRoutes: Routes = [
  { path: '', component: ProductShellComponent },
  { path: ':id', component: ModalContainerComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(productRoutes),
    StoreModule.forFeature('products', productReducer),
    EffectsModule.forFeature([ProductEffects]),
  ],
  declarations: [
    ProductShellComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductDetailsComponent,
  ],
})
export class ProductModule {}
