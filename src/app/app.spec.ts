import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { Recipe } from './recipe-storage.service';
import { SAMPLE_INGREDIENTS } from './sample-data';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title()).toBe('Recipe Builder App');
  });

  it('should initialize with sample ingredients', () => {
    expect(component.availableIngredients()).toEqual(SAMPLE_INGREDIENTS);
  });

  it('should handle recipe creation event', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockRecipe: Recipe = {
      id: 'test-1',
      name: 'Test Recipe',
      ingredients: ['1'],
      totalCalories: 100,
      createdDate: new Date()
    };

    component.onRecipeCreated(mockRecipe);
    
    expect(consoleSpy).toHaveBeenCalledWith('Recipe created:', mockRecipe);
    consoleSpy.mockRestore();
  });

  it('should render recipe builder component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-recipe-builder')).toBeTruthy();
  });
});
