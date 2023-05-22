import IRecipe from '../database/interfaces/IRecipe';
import { Recipe } from '../database/schemas/recipe.schema';

/**
 * Add a new recipe to the database.
 * @param recipe The recipe to add to the database.
 * @returns The recipe that was added to the database.
 */

export const addRecipe = async (recipe: IRecipe) => {
    const newRecipe = Recipe.add(recipe);
    return await newRecipe.save();
};

/**
 * Get a recipe from the database by its id.
 * @param id The id of the recipe to get from the database.
 * @returns The recipe that was retrieved from the database.
 */

export const getRecipeById = async (id: string): Promise<IRecipe | null> => {
    return await Recipe.findById(id).populate('userId', '-password');
};

/**
 * Get all recipes from the database.
 * @returns All recipes from the database.
 */

export const getRecipes = async (): Promise<IRecipe[]> => {
    return await Recipe.find().populate('userId', '-password');
};

/**
 * Update a recipe in the database.
 * @param id The id of the recipe to update in the database.
 * @param recipe The recipe to update in the database.
 * @returns The recipe that was updated in the database.
 */

export const updateRecipe = async (
    id: string,
    recipe: IRecipe
): Promise<IRecipe | null> => {
    return await Recipe.findByIdAndUpdate(id, recipe, { new: true }).populate(
        'userId',
        '-password'
    );
};

/**
 * Delete a recipe from the database.
 * @param id The id of the recipe to delete from the database.
 * @returns The recipe that was deleted from the database.
 */

export const deleteRecipe = async (id: string): Promise<IRecipe | null> => {
    return await Recipe.findByIdAndDelete(id);
};

/**
 * Get all recipes from the database that belong to a user.
 * @param userId The id of the user to get recipes for.
 * @returns All recipes from the database that belong to the user.
 */

export const getRecipesByUserId = async (
    userId: string
): Promise<IRecipe[]> => {
    return await Recipe.find({ userId }).populate('userId', '-password');
};
