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
import {
    createRecipe,
    deleteRecipeByIdNeo,
    getAllRecipesByUserIdNeo,
    getAllRecipesNeo,
    getRecipeByIdNeo,
    updateRecipeByIdNeo,
} from '../services/neo4j/recipe.service';

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
        const dataBaseType = req.body.dataBaseType;

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

        let newRecipe: IRecipe | undefined;
        //save the recipe in mongoDB
        if (dataBaseType === 'mongoDB') newRecipe = await addRecipe(recipe);
        else if (dataBaseType === 'neo4j')
            newRecipe = await createRecipe(recipe);

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
 * @path /v1/recipe/dataBaseType/:dataBaseType
 * Get all recipes from the database.
 * @response 200: The recipes that were retrieved from the database.
 * @response 400: The recipes were not retrieved from the database.
 */

router.get(
    '/dataBaseType/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const dataBaseType = req.params.dataBaseType;

            let recipes: IRecipe[] | undefined;
            //get the recipes from mongoDB
            if (dataBaseType === 'mongoDB') recipes = await getRecipes();
            else if (dataBaseType === 'neo4j')
                recipes = (await getAllRecipesNeo()) || [];

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
 * @path /v1/recipe/:id/:dataBaseType
 * Get a recipe from the database by id.
 * @param id: The id of the recipe to retrieve from the database.
 * @response 200: The recipe that was retrieved from the database.
 * @response 400: The recipe was not retrieved from the database.
 */

router.get(
    '/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType = req.params.dataBaseType;

            if (!id)
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an id',
                });

            let recipe: IRecipe | null | undefined;
            //get the recipe from mongoDB
            if (dataBaseType === 'mongoDB') recipe = await getRecipeById(id);
            else if (dataBaseType === 'neo4j')
                recipe = await getRecipeByIdNeo(Number(id));

            if (!recipe)
                return res.status(400).json({
                    success: false,
                    message: 'Recipe was not retrieved',
                });

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
    }
);

/**
 *  @path /v1/recipe/user/:id/:dataBaseType
 *  Get all recipes from the database that belong to a user.
 *  @param id: The id of the user to retrieve recipes from the database.
 * @response 200: The recipes that were retrieved from the database.
 * @response 400: The recipes were not retrieved from the database.
 */

router.get(
    '/user/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType = req.params.dataBaseType;

            if (!id)
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an id',
                });
            let recipes: IRecipe[] = [];
            //get the recipes from mongoDB
            if (dataBaseType === 'mongoDB')
                recipes = await getRecipesByUserId(id);
            else if (dataBaseType === 'neo4j')
                recipes = (await getAllRecipesByUserIdNeo(Number(id))) || [];

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
 * @path /v1/recipe/:id/:dataBaseType
 * Update a recipe in the database by id.
 * @param id: The id of the recipe to update in the database.
 * @body recipe: The recipe to update in the database.
 * @response 200: The recipe that was updated in the database.
 * @response 400: The recipe was not updated in the database.
 */

router.put(
    '/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType = req.params.dataBaseType;

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

            let updatedRecipe: IRecipe | null | undefined;
            //update the recipe in mongoDB
            if (dataBaseType === 'mongoDB')
                updatedRecipe = await updateRecipe(id, recipe);
            else if (dataBaseType === 'neo4j')
                updatedRecipe = await updateRecipeByIdNeo(Number(id), recipe);

            if (!updatedRecipe)
                return res.status(400).json({
                    success: false,
                    message: 'Recipe was not updated',
                });

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
    }
);

/**
 * @path /v1/recipe/:id/:dataBaseType
 * Delete a recipe from the database by id.
 * @param id: The id of the recipe to delete from the database.
 * @response 200: The recipe that was deleted from the database.
 * @response 400: The recipe was not deleted from the database.
 */

router.delete(
    '/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType = req.params.dataBaseType;
            if (!id)
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an id',
                });

            let deletedRecipe: IRecipe | null | undefined;
            //delete the recipe from mongoDB
            if (dataBaseType === 'mongoDB')
                deletedRecipe = await deleteRecipe(id);
            else if (dataBaseType === 'neo4j')
                deletedRecipe = await deleteRecipeByIdNeo(Number(id));

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
