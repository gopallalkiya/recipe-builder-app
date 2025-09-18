import { Component, signal } from '@angular/core';
import { RecipeBuilderComponent } from './recipe-builder.component';
import { Recipe } from './recipe-storage.service';
import { SAMPLE_INGREDIENTS } from './sample-data';

@Component({
  selector: 'app-root',
  imports: [RecipeBuilderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = signal('Recipe Builder App');
  readonly availableIngredients = signal(SAMPLE_INGREDIENTS);

  onRecipeCreated(recipe: Recipe) {
    console.log('Recipe created:', recipe);
  }
}
