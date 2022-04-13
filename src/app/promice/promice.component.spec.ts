import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromiceComponent } from './promice.component';

describe('PromiceComponent', () => {
  let component: PromiceComponent;
  let fixture: ComponentFixture<PromiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
