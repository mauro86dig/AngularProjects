import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductDetailsComponent } from './product-details.component';

@Component({
  selector: 'app-modal-container',
  template: '',
})
export class ModalContainerComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog = null;

  constructor(
    private modalService: NgbModal,
    route: ActivatedRoute,
    router: Router
  ) {
    route.params.pipe(takeUntil(this.destroy)).subscribe((params) => {
      // When router navigates on this component is takes the params
      // and opens up the photo detail modal
      this.currentDialog = this.modalService.open(ProductDetailsComponent, {
        centered: true,
      });
      this.currentDialog.componentInstance.product = params.id;
      console.log(params);

      // Go back to home page after the modal is closed
      this.currentDialog.result.then(
        (result) => {
          console.log('hello');
          router.navigateByUrl('/products');
        },
        (reason) => {
          router.navigateByUrl('/products');
        }
      );
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
