import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantInfoCardComponent } from './plant-info-card.component';

describe('PlantInfoCardComponent', () => {
  let component: PlantInfoCardComponent;
  let fixture: ComponentFixture<PlantInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
