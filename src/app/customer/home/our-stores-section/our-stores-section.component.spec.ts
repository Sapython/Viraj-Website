import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurStoresSectionComponent } from './our-stores-section.component';

describe('OurStoresSectionComponent', () => {
  let component: OurStoresSectionComponent;
  let fixture: ComponentFixture<OurStoresSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurStoresSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurStoresSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
