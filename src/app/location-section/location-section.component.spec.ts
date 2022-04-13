import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSectionComponent } from './location-section.component';

describe('LocationSectionComponent', () => {
  let component: LocationSectionComponent;
  let fixture: ComponentFixture<LocationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
