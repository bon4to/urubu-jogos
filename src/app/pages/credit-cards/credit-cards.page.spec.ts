import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditCardsPage } from './credit-cards.page';

describe('CreditCardsPage', () => {
  let component: CreditCardsPage;
  let fixture: ComponentFixture<CreditCardsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
