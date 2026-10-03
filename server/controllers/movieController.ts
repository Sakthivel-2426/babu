import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

export async function getMovies(req: Request, res: Response) {
  try {
    const { status, q } = req.query;
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (q) {
      const searchRegex = new RegExp(String(q).trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { language: searchRegex },
        { genre: searchRegex },
        { director: searchRegex },
        { 'cast.name': searchRegex },
      ];
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // Find by custom ID or Mongo _id
    let movie = await Movie.findOne({ id });
    if (!movie && id.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(id);
    }

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found in theatre registry' });
    }

    res.json({ success: true, data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createMovie(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.title || !data.director) {
      return res.status(400).json({ success: false, message: 'Title and director are required.' });
    }

    const customId = data.id || `movie-${Date.now()}`;
    const newMovie = await Movie.create({
      ...data,
      id: customId,
    });

    res.status(201).json({ success: true, data: newMovie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const movie = await Movie.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found to update' });
    }

    res.json({ success: true, data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await Movie.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Movie not found to delete' });
    }

    res.json({ success: true, message: 'Movie deleted successfully from theatre registry' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function syncSeedMovies(req: Request, res: Response) {
  try {
    const { SEED_MOVIES } = await import('../utils/seedData');
    await Movie.deleteMany({ language: { $ne: 'Tamil' } });
    const existingMovies = await Movie.find({}, { id: 1 });
    const existingIds = new Set(existingMovies.map((m) => m.id));
    const toInsert = SEED_MOVIES.filter((m) => !existingIds.has(m.id));
    if (toInsert.length > 0) {
      await Movie.insertMany(toInsert);
    }
    const allTamilMovies = await Movie.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      message: `Database synchronized with ${allTamilMovies.length} official Tamil movies.`,
      count: allTamilMovies.length,
      data: allTamilMovies,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

