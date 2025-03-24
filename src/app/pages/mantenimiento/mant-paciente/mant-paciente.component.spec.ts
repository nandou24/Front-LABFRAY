import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantPacienteComponent } from './mant-paciente.component';

describe('MantPacienteComponent', () => {
  let component: MantPacienteComponent;
  let fixture: ComponentFixture<MantPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
