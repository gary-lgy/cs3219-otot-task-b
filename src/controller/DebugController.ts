import { Handler, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Quote } from '../entity/Quote';
import sampleQuotes from '../sampleQuotes.json';

// Create sample quotes
export const createSampleQuotes: Handler = async (
  req: Request,
  res: Response,
) => {
  try {
    const repository = getRepository(Quote);
    const quotes = sampleQuotes.map((quote) => ({
      content: quote.quote,
      authorName: quote.author,
    }));
    await repository.save(quotes);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
