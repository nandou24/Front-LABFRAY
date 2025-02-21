import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantPersonalComponent } from './mant-personal.component';

describe('MantPersonalComponent', () => {
  let component: MantPersonalComponent;
  let fixture: ComponentFixture<MantPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
