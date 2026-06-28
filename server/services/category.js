const CategorySchema = require('../models/category');

const createCategory = async (name, promoted) => {
    try {

        // Create a new category if it doesn't exist
        const category = new CategorySchema({
            name: name,
            promoted: promoted
        });
        await category.save();
        return category;
    } catch (error) {
        console.log("Error creating category: " + error);
        return null;
    }
};

const getCategoryByName = async (name) => {
    try {
        const category = await CategorySchema.findOne({name});
        return category;
    } catch (error) {
        console.log("Error getting category: " + error);
        return null;
    }
}

const getAllCategories = async () => {
    try {
        const categories = await CategorySchema.find();
        return categories;
    } catch (error) {
        console.log("Error getting categories: " + error);
        return null;
    }
}

const getCategoryById = async (id) => {
    try {
        if (!id) {
            throw new Error('category ID is required'); // Check if ID is provided
        }

        const category = await CategorySchema.findById(id);
        return category;
    } catch (error) {
        console.log("Error getting category: " + error);
        return null;
    }
}

const updateCategory = async (id, name) => {
    try {
        const category = await CategorySchema.findById(id);
        category.name = name;
        await category.save();
        return 'success';
    } catch (error) {
        console.log("Error updating category: " + error);
        return null;
    }
}

const deleteCategory = async (id) => {
    try {
        console.log(id);
        const category = await CategorySchema.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return 'success';
    } catch (error) {
        console.log("Error deleting category: " + error);
        return null;
    }
}
const addMovieToCategory = async (categoryId, movieId) => {
    try {
        const category = await CategorySchema.findById(categoryId);
        category.movies.push(movieId);
        await category.save();
        return 'success';
    } catch (error) {
        console.log("Error adding movie to category: " + error);
        return null;
    }
}


// Removes a movie from a category by its ID.
const removeMovieFromCategory = async (categoryId, movieId) => {
    try {
        // Validate inputs - Make sure the category and movie exist.
        if (!categoryId || !movieId) {
            console.error("Category ID and Movie ID must be provided.");
            return null;
        }

        const category = await CategorySchema.findById(categoryId);
         // Where category does not exist
         if (!category) {
            console.error(`Category with ID ${categoryId} not found.`);
            return null;
        }

        // Check if the movie exists in the category's movies list.
        if (!category.movies.includes(movieId)) {
            console.warn(`Movie with ID ${movieId} does not exist in category ${categoryId}.`);
            return null;
        }

        // Remove the movie from the category's movies list.
        category.movies = category.movies.filter(movie => movie !== movieId);
        // Save the updated category to the database.
        await category.save();
        console.log(`Successfully removed movie with ID ${movieId} from category ${categoryId}.`);
        return 'success';
    }
    catch (error) {
        // Catch any errors during the process and log them.
        console.log("Error removing movie from category: " + error);
        return null;
    }
};


const getMoviesFromCategory = async (categoryId) => {
    try {
        const category = await CategorySchema
            .findById(categoryId)
            .populate('movies');
        return category.movies;
    }
    catch (error) {
        console.log("Error getting movies from category: " + error);
        return null;
    }
}

const switchPromotedCategory = async (categoryId) => {
    try {
        const category = await CategorySchema.findById(categoryId);
        category.promoted = !category.promoted;
        await category.save();
        return 'success';
    }
    catch (error) {
        console.log("Error switching promoted category: " + error);
        return null;
    }
}

module.exports = {
    createCategory, 
    getCategoryByName, 
    getAllCategories,
    getCategoryById, 
    updateCategory, 
    deleteCategory,
    addMovieToCategory, 
    removeMovieFromCategory, 
    getMoviesFromCategory, 
    switchPromotedCategory};
