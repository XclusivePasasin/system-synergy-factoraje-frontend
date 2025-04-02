import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesembolsosPage } from './desembolsos.page';

describe('DesembolsosComponent', () => {
  let component: DesembolsosPage;
  let fixture: ComponentFixture<DesembolsosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesembolsosPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesembolsosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
