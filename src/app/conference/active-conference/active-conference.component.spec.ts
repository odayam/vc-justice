import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConferenceComponent } from './active-conference.component';

describe('ActiveConferenceComponent', () => {
  let component: ActiveConferenceComponent;
  let fixture: ComponentFixture<ActiveConferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveConferenceComponent]
    });
    fixture = TestBed.createComponent(ActiveConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
