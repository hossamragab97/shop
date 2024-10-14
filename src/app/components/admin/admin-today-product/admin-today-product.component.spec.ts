import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTodayProductComponent } from './admin-today-product.component';

describe('AdminTodayProductComponent', () => {
  let component: AdminTodayProductComponent;
  let fixture: ComponentFixture<AdminTodayProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTodayProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTodayProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
