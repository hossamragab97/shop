import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPhotoSliderComponent } from './admin-photo-slider.component';

describe('AdminPhotoSliderComponent', () => {
  let component: AdminPhotoSliderComponent;
  let fixture: ComponentFixture<AdminPhotoSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPhotoSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPhotoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
