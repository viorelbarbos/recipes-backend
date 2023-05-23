import IRecipe from '../../interfaces/IRecipe';
import mongoose from 'mongoose';

interface IRecipeDoc extends mongoose.Document, Omit<IRecipe, '_id'> {}

interface IRecipeSchema extends mongoose.Model<IRecipeDoc> {
    add(recipe: IRecipe): IRecipeDoc;
}

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    type: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 50,
            },
            weight: {
                type: Number,
                required: true,
                min: 0,
                max: 10000,
            },
        },
    ],
    cookTime: {
        type: Number,
        required: true,
        min: 0,
        max: 10000,
    },

    prepTime: {
        type: Number,
        required: true,
        min: 0,
        max: 10000,
    },
    servings: {
        type: Number,
        required: true,
        min: 0,
        max: 10000,
    },
    image: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },
});

RecipeSchema.statics.add = (recipe: IRecipe) => {
    return new Recipe(recipe);
};

const Recipe = mongoose.model<IRecipeDoc, IRecipeSchema>(
    'Recipes',
    RecipeSchema
);

export { Recipe, IRecipeDoc };
