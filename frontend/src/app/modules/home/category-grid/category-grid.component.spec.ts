import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGridComponent } from './category-grid.component';

describe('CategoryGridComponent', () => {
  let component: CategoryGridComponent;
  let fixture: ComponentFixture<CategoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
