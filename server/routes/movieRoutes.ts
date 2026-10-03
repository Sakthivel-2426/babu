import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  syncSeedMovies,
} from '../controllers/movieController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', getMovies);
router.post('/sync', syncSeedMovies);
router.get('/:id', getMovieById);
router.post('/', optionalAuth, createMovie);
router.put('/:id', optionalAuth, updateMovie);
router.delete('/:id', optionalAuth, deleteMovie);

export default router;
