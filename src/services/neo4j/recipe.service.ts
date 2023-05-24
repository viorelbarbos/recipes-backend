import { Driver, QueryResult, Session } from 'neo4j-driver';
import IRecipe from '../../database/interfaces/IRecipe';
import neo4jConnect from '../../database/ne04j/neo4jConnect';

// Define your Neo4j connection details
const driver: Driver = neo4jConnect()!;

const session: Session = driver.session();

export const createRecipe = async (
    recipe: IRecipe
): Promise<IRecipe | undefined> => {
    const query = `
        CREATE (recipe:Recipe { 
          name: $name,
          description: $description,
          type: $type,
          cookTime: $cookTime,
          prepTime: $prepTime,
          servings: $servings,
          image: $image,
          userId: $userId
        })
        WITH recipe
        UNWIND $ingredients as ingredient
        CREATE (recipe)-[:CONTAINS]->(i:Ingredient { 
          name: ingredient.name,
          weight: ingredient.weight
        }) RETURN {_id: ID(recipe), name: recipe.name, description: recipe.description, type:recipe.type, ingredients:recipe.ingredients, cookTime:recipe.cookTime, prepTime:recipe.cookTime, servings:recipe.servings, image:recipe.image, userId:recipe.userId} as recipe LIMIT 1
      `;

    const params = {
        name: recipe.name,
        description: recipe.description,
        type: recipe.type,
        cookTime: recipe.cookTime,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        image: recipe.image,
        userId: recipe.userId,
        ingredients: recipe.ingredients,
    };

    const response = await session.run(query, params);

    //return the recipe
    return {
        _id: response.records[0].get('recipe')._id.low,
        name: response.records[0].get('recipe').name,
        description: response.records[0].get('recipe').description,
        type: response.records[0].get('recipe').type,
        ingredients: response.records[0].get('recipe').ingredients,
        cookTime: response.records[0].get('recipe').cookTime,
        prepTime: response.records[0].get('recipe').prepTime,
        servings: response.records[0].get('recipe').servings,
        image: response.records[0].get('recipe').image,
        userId: response.records[0].get('recipe').userId,
    };
};

/**
 * Get recipe by id
 * @param id  - Recipe id
 * @returns  - Recipe object
 */

export const getRecipeByIdNeo = async (
    id: number
): Promise<IRecipe | undefined> => {
    const query = `MATCH (recipe:Recipe) WHERE ID(recipe) = $id RETURN {_id: ID(recipe), name: recipe.name, description: recipe.description, type:recipe.type, ingredients:recipe.ingredients, cookTime:recipe.cookTime, prepTime:recipe.cookTime, servings:recipe.servings, image:recipe.image, userId:recipe.userId} as user LIMIT 1`;

    const result = await session.run(query, { id });

    if (result.records.length === 0) return undefined;

    return {
        _id: result.records[0].get('recipe')._id.low,
        name: result.records[0].get('recipe').name,
        description: result.records[0].get('recipe').description,
        type: result.records[0].get('recipe').type,
        ingredients: result.records[0].get('recipe').ingredients,
        cookTime: result.records[0].get('recipe').cookTime,
        prepTime: result.records[0].get('recipe').prepTime,
        servings: result.records[0].get('recipe').servings,
        image: result.records[0].get('recipe').image,
        userId: result.records[0].get('recipe').userId,
    };
};
/**
 * Get all recipes
 * @returns  - Recipes array
 */

export const getAllRecipesNeo = async (): Promise<IRecipe[] | undefined> => {
    const query = `MATCH (recipe:Recipe)-[:CONTAINS]->(i:Ingredient) RETURN {_id: ID(recipe), name: recipe.name, description: recipe.description, type:recipe.type, cookTime:recipe.cookTime, prepTime:recipe.cookTime, servings:recipe.servings, image:recipe.image, userId:recipe.userId} as recipe, COLLECT(i) AS ingredients`;

    const result = await session.run(query);

    if (result.records.length === 0) return undefined;

    return result.records.map((record) => {
        return {
            _id: record.get('recipe')._id.low,
            name: record.get('recipe').name,
            description: record.get('recipe').description,
            type: record.get('recipe').type,
            ingredients: record.get('ingredients').map((ingredient: any) => {
                return ingredient.properties;
            }),
            cookTime: record.get('recipe').cookTime,
            prepTime: record.get('recipe').prepTime,
            servings: record.get('recipe').servings,
            image: record.get('recipe').image,
            userId: record.get('recipe').userId,
        };
    });
};

/**
 * Get all recipes by user id
 * @param userId  - User id
 * @returns  - Recipes array
 */

export const getAllRecipesByUserIdNeo = async (
    userId: number
): Promise<IRecipe[] | undefined> => {
    const query = `MATCH (recipe:Recipe)-[:CONTAINS]->(i:Ingredient) WHERE recipe.userId = $userId RETURN {_id: ID(recipe), name: recipe.name, description: recipe.description, type:recipe.type, ingredients:recipe.ingredients, cookTime:recipe.cookTime, prepTime:recipe.cookTime, servings:recipe.servings, image:recipe.image, userId:recipe.userId} as recipe, COLLECT(i) AS ingredients`;

    const result = await session.run(query, { userId });
    if (result.records.length === 0) return undefined;
    return result.records.map((record) => {
        return {
            _id: record.get('recipe')._id.low,
            name: record.get('recipe').name,
            description: record.get('recipe').description,
            type: record.get('recipe').type,
            ingredients: record.get('ingredients').map((ingredient: any) => {
                return ingredient.properties;
            }),
            cookTime: record.get('recipe').cookTime,
            prepTime: record.get('recipe').prepTime,
            servings: record.get('recipe').servings,
            image: record.get('recipe').image,
            userId: record.get('recipe').userId,
        };
    });
};

/**
 * Update recipe by id
 * @param id  - Recipe id
 * @param recipe  - Recipe object
 * @returns  - Recipe object
 */

export const updateRecipeByIdNeo = async (
    id: Number,
    recipe: IRecipe
): Promise<IRecipe | undefined> => {
    const query = `MATCH (recipe:Recipe) WHERE ID(recipe) = $id SET recipe = $recipe RETURN {_id: ID(recipe), name: recipe.name, description: recipe.description, type:recipe.type, ingredients:recipe.ingredients, cookTime:recipe.cookTime, prepTime:recipe.cookTime, servings:recipe.servings, image:recipe.image, userId:recipe.userId} as recipe`;

    const result = await session.run(query, { id, recipe });
    return {
        _id: result.records[0].get('recipe')._id.low,
        name: result.records[0].get('recipe').name,
        description: result.records[0].get('recipe').description,
        type: result.records[0].get('recipe').type,
        ingredients: result.records[0].get('recipe').ingredients,
        cookTime: result.records[0].get('recipe').cookTime,
        prepTime: result.records[0].get('recipe').prepTime,
        servings: result.records[0].get('recipe').servings,
        image: result.records[0].get('recipe').image,
        userId: result.records[0].get('recipe').userId,
    };
};

/**
 * Delete recipe by id
 * @param id  - Recipe id
 * @returns  - Recipe object
 */

export const deleteRecipeByIdNeo = async (
    id: Number
): Promise<IRecipe | undefined> => {
    const query = `MATCH (recipe:Recipe) WHERE ID(recipe) = $id DETACH DELETE recipe `;
    console.log('aici');

    const result = await session.run(query, { id });

    return {
        _id: '0',
        name: 'deleted',
        description: 'deleted',
        type: 'deleted',
        ingredients: [],
        cookTime: 0,
        prepTime: 0,
        servings: 0,
        image: 'deleted',
        userId: 'deleted',
    };
};
