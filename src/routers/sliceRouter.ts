import { Router } from 'express';
import { createSlice, getAllSlices, updateSlice, deleteSlice } from '../controllers/sliceController.js';

const router = Router();

// Define routes for slice operations
router.post('/', createSlice);     // Create a new slice
router.get('/', getAllSlices);     // Retrieve all slices
router.put('/:id', updateSlice);   // Update a slice by ID
router.delete('/:id', deleteSlice); // Delete a slice by ID

export default router;
