import { Injectable } from '@angular/core';

export type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  totalCalories: number;
  createdDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeStorageService {
  private readonly STORAGE_KEY = 'saved-recipes';

  saveRecipe(recipe: Recipe): void {
    const recipes = this.getAllRecipes();
    recipes.push(recipe);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
  }

  getAllRecipes(): Recipe[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const recipes = JSON.parse(data);
      return recipes.map((recipe: any) => ({
        ...recipe,
        createdDate: new Date(recipe.createdDate)
      }));
    } catch {
      return [];
    }
  }

  deleteRecipe(recipeId: string): void {
    const recipes = this.getAllRecipes().filter(recipe => recipe.id !== recipeId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
  }
}