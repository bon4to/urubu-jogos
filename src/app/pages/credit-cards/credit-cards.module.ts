import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditCardsPageRoutingModule } from './credit-cards-routing.module';
import { HeaderModule } from '../../components/header/header.module';

import { CreditCardsPage } from './credit-cards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreditCardsPageRoutingModule,
    HeaderModule
  ],
  declarations: [
    CreditCardsPage
  ]
})
export class CreditCardsPageModule {}
