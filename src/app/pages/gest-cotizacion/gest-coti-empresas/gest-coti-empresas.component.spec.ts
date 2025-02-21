import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestCotiEmpresasComponent } from './gest-coti-empresas.component';

describe('GestCotiEmpresasComponent', () => {
  let component: GestCotiEmpresasComponent;
  let fixture: ComponentFixture<GestCotiEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestCotiEmpresasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestCotiEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
