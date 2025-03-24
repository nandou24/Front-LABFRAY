import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestPagoPersonasComponent } from './gest-pago-personas.component';

describe('GestPagoPersonasComponent', () => {
  let component: GestPagoPersonasComponent;
  let fixture: ComponentFixture<GestPagoPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestPagoPersonasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestPagoPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
