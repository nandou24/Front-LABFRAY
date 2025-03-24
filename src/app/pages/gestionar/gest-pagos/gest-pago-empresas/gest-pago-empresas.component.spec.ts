import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestPagoEmpresasComponent } from './gest-pago-empresas.component';

describe('GestPagoEmpresasComponent', () => {
  let component: GestPagoEmpresasComponent;
  let fixture: ComponentFixture<GestPagoEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestPagoEmpresasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestPagoEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
