import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizerComponent } from './recognizer.component';

describe('RecognizerComponent', () => {
  let component: RecognizerComponent;
  let fixture: ComponentFixture<RecognizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
