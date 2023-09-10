import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterVisualizerComponent } from './character-visualizer.component';

describe('CharacterVisualizerComponent', () => {
  let component: CharacterVisualizerComponent;
  let fixture: ComponentFixture<CharacterVisualizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterVisualizerComponent]
    });
    fixture = TestBed.createComponent(CharacterVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
