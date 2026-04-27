export interface NutritionalInfo {
  calories: number | null | string; // por 100g o por unidad base
  protein: number | null | string; // gramos
  carbohydrates: number | null | string; // gramos
  fat: number | null | string; // gramos
  sugar?: number | null | string; // gramos
  sodium?: number | null | string; // miligramos
}
