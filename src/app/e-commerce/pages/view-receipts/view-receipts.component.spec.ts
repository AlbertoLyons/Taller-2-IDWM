import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceiptsComponent } from './view-receipts.component';

describe('ViewReceiptsComponent', () => {
  let component: ViewReceiptsComponent;
  let fixture: ComponentFixture<ViewReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
