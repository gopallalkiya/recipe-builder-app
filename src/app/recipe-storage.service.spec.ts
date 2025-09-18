import { RecipeStorageService, Recipe } from './recipe-storage.service';

describe('RecipeStorageService', () => {
  let service: RecipeStorageService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    service = new RecipeStorageService();
    mockLocalStorage = {};

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        })
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRecipes', () => {
    it('should handle empty storage, valid data, and invalid JSON', () => {
      // Empty storage
      expect(service.getAllRecipes()).toEqual([]);
      
      // Valid data
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Test Recipe',
          ingredients: ['1', '2'],
          totalCalories: 100,
          createdDate: new Date()
        }
      ];
      mockLocalStorage['saved-recipes'] = JSON.stringify(mockRecipes);
      const recipes = service.getAllRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].name).toBe('Test Recipe');
      
      // Invalid JSON
      mockLocalStorage['saved-recipes'] = 'invalid json';
      expect(service.getAllRecipes()).toEqual([]);
    });
  });

  describe('saveRecipe', () => {
    it('should save new recipe and append to existing ones', () => {
      const recipe: Recipe = {
        id: '1',
        name: 'New Recipe',
        ingredients: ['1'],
        totalCalories: 50,
        createdDate: new Date()
      };

      service.saveRecipe(recipe);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'saved-recipes',
        JSON.stringify([recipe])
      );
      
      // Test appending
      const newRecipe: Recipe = {
        id: '2',
        name: 'Second Recipe',
        ingredients: ['2'],
        totalCalories: 75,
        createdDate: new Date()
      };
      
      service.saveRecipe(newRecipe);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'saved-recipes',
        JSON.stringify([recipe, newRecipe])
      );
    });
  });

  describe('deleteRecipe', () => {
    it('should remove existing recipe and handle non-existent ids', () => {
      const recipes: Recipe[] = [
        {
          id: '1',
          name: 'Recipe 1',
          ingredients: ['1'],
          totalCalories: 50,
          createdDate: new Date()
        },
        {
          id: '2',
          name: 'Recipe 2',
          ingredients: ['2'],
          totalCalories: 75,
          createdDate: new Date()
        }
      ];
      mockLocalStorage['saved-recipes'] = JSON.stringify(recipes);

      // Delete existing recipe
      service.deleteRecipe('1');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'saved-recipes',
        JSON.stringify([recipes[1]])
      );
      
      // Handle non-existent id
      service.deleteRecipe('999');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'saved-recipes',
        JSON.stringify([recipes[1]])
      );
    });
  });


});