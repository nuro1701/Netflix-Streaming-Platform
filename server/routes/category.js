const categoryController = require('../controllers/category');

const express = require('express');
const router = express.Router();

router.route('/')
    .post(categoryController.createCategory)
    .get(categoryController.getAllCategories)

router.route('/:id')
    .get(categoryController.getCategoryById)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router;