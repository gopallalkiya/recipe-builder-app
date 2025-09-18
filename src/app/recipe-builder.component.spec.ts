import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeBuilderComponent, Ingredient } from './recipe-builder.component';
import { RecipeStorageService, Recipe } from './recipe-storage.service';
import { signal } from '@angular/core';

describe('RecipeBuilderComponent', () => {
  let component: RecipeBuilderComponent;
  let fixture: ComponentFixture<RecipeBuilderComponent>;
  let mockStorageService: jest.Mocked<RecipeStorageService>;

  const mockIngredients: Ingredient[] = [
    { id: '1', name: 'Chicken', category: 'protein', calories: 165 },
    { id: '2', name: 'Rice', category: 'grain', calories: 130 },
    { id: '3', name: 'Broccoli', category: 'vegetable', calories: 25 }
  ];

  const mockSavedRecipe: Recipe = {
    id: 'recipe-1',
    name: 'Test Recipe',
    ingredients: ['1', '2'],
    totalCalories: 295,
    createdDate: new Date()
  };

  beforeEach(async () => {
    mockStorageService = {
      saveRecipe: jest.fn(),
      getAllRecipes: jest.fn().mockReturnValue([mockSavedRecipe]),
      deleteRecipe: jest.fn(),
      STORAGE_KEY: 'saved-recipes'
    } as any;

    await TestBed.configureTestingModule({
      imports: [RecipeBuilderComponent],
      providers: [
        { provide: RecipeStorageService, useValue: mockStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeBuilderComponent);
    component = fixture.componentInstance;
    
    // Set required input
    fixture.componentRef.setInput('ingredients', mockIngredients);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create and initialize correctly', () => {
      expect(component).toBeTruthy();
      expect(component.ingredients()).toEqual(mockIngredients);
      expect(component.recipeName()).toBe('');
      expect(component.selectedIngredients()).toEqual([]);
      expect(mockStorageService.getAllRecipes).toHaveBeenCalled();
    });
  });

  describe('Ingredient Selection', () => {
    it('should add and remove ingredients correctly', () => {
      component.addIngredient('1');
      expect(component.selectedIngredients()).toContain('1');
      expect(component.isIngredientSelected('1')).toBe(true);
      
      component.addIngredient('1'); // duplicate
      expect(component.selectedIngredients()).toEqual(['1']);
      
      component.removeIngredient('1');
      expect(component.isIngredientSelected('1')).toBe(false);
    });
  });

  describe('Computed Values', () => {
    it('should calculate total calories correctly', () => {
      expect(component.totalCalories()).toBe(0);
      
      component.addIngredient('1'); // 165 calories
      component.addIngredient('2'); // 130 calories
      expect(component.totalCalories()).toBe(295);
      
      component.selectedIngredients.set(['invalid-id']);
      expect(component.totalCalories()).toBe(0);
    });

    it('should group ingredients by category', () => {
      const grouped = component.groupedIngredients();
      expect(grouped.protein).toEqual([mockIngredients[0]]);
      expect(grouped.grain).toEqual([mockIngredients[1]]);
      expect(grouped.vegetable).toEqual([mockIngredients[2]]);
    });

    it('should determine if recipe can be saved', () => {
      expect(component.canSave()).toBe(false);
      
      component.recipeName.set('Test Recipe');
      component.addIngredient('1');
      expect(component.canSave()).toBe(true);
      
      component.recipeName.set('');
      expect(component.canSave()).toBe(false);
    });
  });

  describe('Recipe Saving', () => {
    it('should save valid recipe and clear form', () => {
      component.recipeName.set('Test Recipe');
      component.addIngredient('1');
      component.addIngredient('2');
      
      const emitSpy = jest.spyOn(component.recipeCreated, 'emit');
      
      component.saveRecipe();
      
      expect(mockStorageService.saveRecipe).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
      expect(component.recipeName()).toBe('');
      expect(component.selectedIngredients()).toEqual([]);
      
      const savedRecipe = mockStorageService.saveRecipe.mock.calls[0][0];
      expect(savedRecipe.name).toBe('Test Recipe');
      expect(savedRecipe.totalCalories).toBe(295);
    });

    it('should not save invalid recipe', () => {
      component.recipeName.set('');
      component.saveRecipe();
      expect(mockStorageService.saveRecipe).not.toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    it('should get ingredient name by id and delete recipes', () => {
      expect(component.getIngredientName('1')).toBe('Chicken');
      expect(component.getIngredientName('invalid')).toBe('');
      
      component.deleteRecipe('recipe-1');
      expect(mockStorageService.deleteRecipe).toHaveBeenCalledWith('recipe-1');
      expect(mockStorageService.getAllRecipes).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty ingredients and storage errors', () => {
      fixture.componentRef.setInput('ingredients', []);
      fixture.detectChanges();
      expect(component.ingredients()).toEqual([]);
      
      mockStorageService.getAllRecipes.mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('Template Integration', () => {
    it('should render ingredients and handle empty state', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Protein');
      expect(compiled.textContent).toContain('Grain');
      expect(compiled.textContent).toContain('Vegetable');
      
      fixture.componentRef.setInput('ingredients', []);
      fixture.detectChanges();
      expect(compiled.textContent).toContain('No ingredients available');
    });

    it('should handle save button state correctly', () => {
      const saveButton = fixture.nativeElement.querySelector('.save-btn');
      expect(saveButton.disabled).toBe(true);
      
      component.recipeName.set('Valid Recipe');
      component.addIngredient('1');
      fixture.detectChanges();
      expect(saveButton.disabled).toBe(false);
    });
  });


});