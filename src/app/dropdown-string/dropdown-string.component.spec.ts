import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownStringComponent } from './dropdown-string.component';

describe('DropdownStringComponent', () => {
  let component: DropdownStringComponent;
  let fixture: ComponentFixture<DropdownStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownStringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
