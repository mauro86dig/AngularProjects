import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ExponentialStrengthPipe } from './pipe/exponential-strength.pipe';
import { PipeComponent } from './pipe/pipe.component';
import { PowerBoostCalculatorComponent } from './pipe/power-boost-calculator.component';
//import { PowerBoostCalculatorComponent } from './pipe/power-boost-calculator.component';

const productRoutes: Routes = [
  { path: '/pipe', component: PipeComponent },

  // { path: ':id', component: ModalContainerComponent },
];

@NgModule({
  imports: [SharedModule],
  declarations: [
    PipeComponent,
    ExponentialStrengthPipe,
    PowerBoostCalculatorComponent,
  ],
})
export class ExamplesModule { }
