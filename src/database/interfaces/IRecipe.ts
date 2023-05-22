export default interface IRecipe {
    _id?: string;
    name: string;
    description: string;
    type: string;
    ingredients: {
        name: string;
        weight: number;
    }[];
    cookTime: number;
    prepTime: number;
    servings: number;
    image?: string;
    userId: string;
}
