import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestCotizacionComponent } from './gest-cotizacion.component';

describe('GestCotizacionComponent', () => {
  let component: GestCotizacionComponent;
  let fixture: ComponentFixture<GestCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestCotizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
