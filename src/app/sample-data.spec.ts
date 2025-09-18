import { SAMPLE_INGREDIENTS } from './sample-data';

describe('Sample Data', () => {
  describe('SAMPLE_INGREDIENTS', () => {
    it('should contain 8 ingredients', () => {
      expect(SAMPLE_INGREDIENTS).toHaveLength(8);
    });

    it('should have ingredients with required properties', () => {
      SAMPLE_INGREDIENTS.forEach(ingredient => {
        expect(ingredient).toHaveProperty('id');
        expect(ingredient).toHaveProperty('name');
        expect(ingredient).toHaveProperty('category');
        expect(ingredient).toHaveProperty('calories');
        expect(typeof ingredient.id).toBe('string');
        expect(typeof ingredient.name).toBe('string');
        expect(['protein', 'grain', 'vegetable']).toContain(ingredient.category);
        expect(typeof ingredient.calories).toBe('number');
        expect(ingredient.calories).toBeGreaterThan(0);
      });
    });

    it('should contain protein ingredients', () => {
      const proteins = SAMPLE_INGREDIENTS.filter(ing => ing.category === 'protein');
      expect(proteins).toHaveLength(3);
      expect(proteins.map(p => p.name)).toEqual(['Chicken Breast', 'Salmon Fillet', 'Tofu']);
    });

    it('should contain grain ingredients', () => {
      const grains = SAMPLE_INGREDIENTS.filter(ing => ing.category === 'grain');
      expect(grains).toHaveLength(2);
      expect(grains.map(g => g.name)).toEqual(['Rice', 'Quinoa']);
    });

    it('should contain vegetable ingredients', () => {
      const vegetables = SAMPLE_INGREDIENTS.filter(ing => ing.category === 'vegetable');
      expect(vegetables).toHaveLength(3);
      expect(vegetables.map(v => v.name)).toEqual(['Broccoli', 'Bell Peppers', 'Spinach']);
    });
  });
});