import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductsAdminComponent } from './view-products-admin.component';

describe('ViewProductsAdminComponent', () => {
  let component: ViewProductsAdminComponent;
  let fixture: ComponentFixture<ViewProductsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
