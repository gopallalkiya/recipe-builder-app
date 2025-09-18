import { Component, input, output, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeStorageService, Recipe } from './recipe-storage.service';

export type Ingredient = {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'grain';
  calories: number;
}

@Component({
  selector: 'app-recipe-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-builder.component.html',
  styleUrls: ['./recipe-builder.component.css']
})
export class RecipeBuilderComponent implements OnInit {
  ingredients = input.required<Ingredient[]>();
  recipeCreated = output<Recipe>();

  private storageService = inject(RecipeStorageService);

  recipeName = signal('');
  selectedIngredients = signal<string[]>([]);
  savedRecipes = signal<Recipe[]>([]);
  
  totalCalories = computed(() => {
    const selected = this.selectedIngredients();
    const ingredientsList = this.ingredients();
    return selected.reduce((total, id) => {
      const ingredient = ingredientsList.find(ing => ing.id === id);
      return total + (ingredient?.calories || 0);
    }, 0);
  });

  groupedIngredients = computed(() => {
    const ingredientsList = this.ingredients();
    return {
      protein: ingredientsList.filter(ing => ing.category === 'protein'),
      vegetable: ingredientsList.filter(ing => ing.category === 'vegetable'),
      grain: ingredientsList.filter(ing => ing.category === 'grain')
    };
  });

  canSave = computed(() => {
    return this.recipeName().trim() !== '' && this.selectedIngredients().length > 0;
  });

  ngOnInit() {
    try {
      this.savedRecipes.set(this.storageService.getAllRecipes());
    } catch {
      this.savedRecipes.set([]);
    }
  }

  addIngredient(ingredientId: string) {
    const current = this.selectedIngredients();
    if (!current.includes(ingredientId)) {
      this.selectedIngredients.set([...current, ingredientId]);
    }
  }

  removeIngredient(ingredientId: string) {
    const current = this.selectedIngredients();
    this.selectedIngredients.set(current.filter(id => id !== ingredientId));
  }

  saveRecipe() {
    if (!this.canSave()) return;

    const recipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name: this.recipeName(),
      ingredients: [...this.selectedIngredients()],
      totalCalories: this.totalCalories(),
      createdDate: new Date()
    };

    this.storageService.saveRecipe(recipe);
    this.recipeCreated.emit(recipe);
    this.savedRecipes.set(this.storageService.getAllRecipes());
    
    // Clear current recipe
    this.recipeName.set('');
    this.selectedIngredients.set([]);
  }

  isIngredientSelected(ingredientId: string): boolean {
    return this.selectedIngredients().includes(ingredientId);
  }

  getIngredientName(ingredientId: string): string {
    const ingredient = this.ingredients().find(ing => ing.id === ingredientId);
    return ingredient?.name || '';
  }

  getIngredientsForCategory(category: string): Ingredient[] {
    const grouped = this.groupedIngredients();
    return grouped[category as keyof typeof grouped] || [];
  }

  deleteRecipe(recipeId: string) {
    this.storageService.deleteRecipe(recipeId);
    this.savedRecipes.set(this.storageService.getAllRecipes());
  }
}