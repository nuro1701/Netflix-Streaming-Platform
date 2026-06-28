const userService = require('../services/category');


const createCategory = async (req, res) => {
    try{
      const category = await userService.getCategoryByName(req.body.name);
     // Check if a category with the same name already exists.
    if (category) {
        return res.status(400).json({message: 'Category is already taken'});
    }

    const newCategory = await userService.createCategory(req.body.name, req.body.promoted);
    if (!newCategory) {
        return res.status(500).send("Error creating category."); // 500 Internal Server Error   
    }

    // Respond with the newly created category's details
    return res.status(201).json({
        name: req.body.name,
        promoted: req.body.promoted
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }

}

const getAllCategories = async (req, res) => {
    const categories = await userService.getAllCategories();
    if (!categories) {
        return res.status(404).send("Categories not found"); // 404 Not Found
    }

    return res.status(200).json(categories);
}

const getCategoryById = async (req, res) => {
    const category = await userService.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send("Category not found"); // 404 Not Found
    }

    return res.status(200).json(category);
}

const updateCategory = async (req, res) => {
    try {
      // Extract category ID and new name from the request
      const { id } = req.params; 
      const { name } = req.body;
  
      if (!name) {
        // Validate that the name is provided in the request body
        return res.status(400).send("Category name is required."); // 400 Bad Request
      }
  
      // Attempt to update the category
      const category = await userService.updateCategory(id, name);
  
      if (!category) {
        // If no category is returned, it means the update failed
        return res.status(404).send("Category not found."); // 404 Not Found
      }
  
      // Successfully updated the category
      return res.status(200).json({
        message: "Category updated successfully.",
        updatedCategory: { id, name }
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error updating category:", error);
      return res.status(500).send("Internal Server Error."); // 500 Internal Server Error
    }
  };
  
  const deleteCategory = async (req, res) => {
    try {
      // Extract category ID from the request
      const { id } = req.params;
  
      // Attempt to delete the category
      const category = await userService.deleteCategory(id);
  
      if (!category) {
        // If no category is returned, it means the category does not exist
        return res.status(404).send("Category not found."); // 404 Not Found
      }
  
      // Successfully deleted the category
      return res.status(200).json({
        message: "Category deleted successfully.",
        deletedCategoryId: id
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error deleting category:", error);
      return res.status(500).send("Internal Server Error."); // 500 Internal Server Error
    }
  };
  

module.exports = {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    updateCategory, deleteCategory
};
