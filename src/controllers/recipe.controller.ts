import { Router, Request, Response } from 'express';
import IResponseStructure from '../utils/models/generic/IResponseStructure';
import IRecipe from '../database/interfaces/IRecipe';

import {
    addRecipe,
    getRecipeById,
    getRecipes,
    updateRecipe,
    deleteRecipe,
    getRecipesByUserId,
} from '../services/mongoDB/recipe.service';

const router = Router();

/**
 * @path /v1/recipe/
 * Add a new recipe to the database.
 * @body recipe: The recipe to add to the database.
 * @response 201: The recipe that was added to the database.
 * @response 400: The recipe was not added to the database.
 */

router.post('/', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const recipe: IRecipe = req.body.recipe;

        if (
            !recipe ||
            !recipe.name ||
            !recipe.description ||
            !recipe.type ||
            !recipe.ingredients ||
            !recipe.cookTime ||
            !recipe.prepTime ||
            !recipe.userId
        )
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields',
            });

        //add recipe to database
        const newRecipe = await addRecipe(recipe);

        return res.status(201).json({
            success: true,
            message: 'Recipe added successfully',
            data: {
                newRecipe,
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Recipe was not added',
            error: error.message,
        });
    }
});

/**
 * @path /v1/recipe/
 * Get all recipes from the database.
 * @response 200: The recipes that were retrieved from the database.
 * @response 400: The recipes were not retrieved from the database.
 */

router.get('/', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const recipes = await getRecipes();

        return res.status(200).json({
            success: true,
            message: 'Recipes retrieved successfully',
            data: {
                recipes,
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Recipes were not retrieved',
            error: error.message,
        });
    }
});

/**
 * @path /v1/recipe/:id
 * Get a recipe from the database by id.
 * @param id: The id of the recipe to retrieve from the database.
 * @response 200: The recipe that was retrieved from the database.
 * @response 400: The recipe was not retrieved from the database.
 */

router.get('/:id', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const id = req.params.id;

        if (!id)
            return res.status(400).json({
                success: false,
                message: 'Please provide an id',
            });

        const recipe = await getRecipeById(id);

        return res.status(200).json({
            success: true,
            message: 'Recipe retrieved successfully',
            data: {
                recipe,
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,

            message: 'Recipe was not retrieved',
            error: error.message,
        });
    }
});

/**
 *  @path /v1/recipe/user/:id
 *  Get all recipes from the database that belong to a user.
 *  @param id: The id of the user to retrieve recipes from the database.
 * @response 200: The recipes that were retrieved from the database.
 * @response 400: The recipes were not retrieved from the database.
 */

router.get(
    '/user/:id',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;

            if (!id)
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an id',
                });

            const recipes = await getRecipesByUserId(id);

            return res.status(200).json({
                success: true,
                message: 'Recipes retrieved successfully',
                data: {
                    recipes,
                },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,

                message: 'Recipes were not retrieved',
                error: error.message,
            });
        }
    }
);

/**
 * @path /v1/recipe/:id
 * Update a recipe in the database by id.
 * @param id: The id of the recipe to update in the database.
 * @body recipe: The recipe to update in the database.
 * @response 200: The recipe that was updated in the database.
 * @response 400: The recipe was not updated in the database.
 */

router.put('/:id', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const id = req.params.id;

        if (!id)
            return res.status(400).json({
                success: false,
                message: 'Please provide an id',
            });

        const recipe: IRecipe = req.body.recipe;
        if (
            !recipe ||
            !recipe.name ||
            !recipe.description ||
            !recipe.type ||
            !recipe.ingredients ||
            !recipe.cookTime ||
            !recipe.prepTime ||
            !recipe.userId
        )
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields',
            });

        const updatedRecipe = await updateRecipe(id, recipe);

        return res.status(200).json({
            success: true,
            message: 'Recipe updated successfully',
            data: {
                updatedRecipe,
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Recipe was not updated',
            error: error.message,
        });
    }
});

/**
 * @path /v1/recipe/:id
 * Delete a recipe from the database by id.
 * @param id: The id of the recipe to delete from the database.
 * @response 200: The recipe that was deleted from the database.
 * @response 400: The recipe was not deleted from the database.
 */

router.delete(
    '/:id',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;

            if (!id)
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an id',
                });

            const deletedRecipe = await deleteRecipe(id);

            return res.status(200).json({
                success: true,
                message: 'Recipe deleted successfully',
                data: {
                    deletedRecipe,
                },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: 'Recipe was not deleted',
                error: error.message,
            });
        }
    }
);

export default router;
