import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestCotiPersonalComponent } from './gest-coti-personal.component';

describe('GestCotiPersonalComponent', () => {
  let component: GestCotiPersonalComponent;
  let fixture: ComponentFixture<GestCotiPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestCotiPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestCotiPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
