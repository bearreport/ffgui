import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCustomizerComponent } from './character-customizer.component';

describe('CharacterCustomizerComponent', () => {
  let component: CharacterCustomizerComponent;
  let fixture: ComponentFixture<CharacterCustomizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterCustomizerComponent]
    });
    fixture = TestBed.createComponent(CharacterCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
