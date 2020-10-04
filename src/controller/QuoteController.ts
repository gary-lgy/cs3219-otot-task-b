import { Handler, NextFunction, Request, Response } from 'express';
import { Quote } from '../entity/Quote';

export const getQuotes: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quotes = await Quote.find();
    return res.status(200).json({ message: 'found', quotes });
  } catch (error) {
    return next(error);
  }
};

export const getQuote: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const quote = await Quote.findOne(id);
    if (!quote) {
      return res.status(404).json({ message: 'not found' });
    }
    return res.status(200).json({ message: 'found', quote });
  } catch (error) {
    return next(error);
  }
};

export const createQuote: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { content, authorName } = req.body;
    if (typeof content !== 'string' || typeof authorName !== 'string') {
      return res
        .status(400)
        .json({ message: 'content and author name must be strings' });
    }
    const quote = new Quote();
    quote.content = content;
    quote.authorName = authorName;
    await quote.save();
    return res.status(201).json({ message: 'created', quote });
  } catch (err) {
    return next(err);
  }
};

export const editQuote: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const { content, authorName } = req.body;
    if (typeof content !== 'string' || typeof authorName !== 'string') {
      return res.status(400).json({
        message: 'content and authorName are required and must be strings',
      });
    }

    const quote = await Quote.findOne(id);
    if (!quote) {
      return res.status(404).json({ message: 'not found' });
    }

    quote.content = content;
    quote.authorName = authorName;
    await quote.save();
    await quote.reload();
    return res.status(200).json({ message: 'updated', quote });
  } catch (err) {
    return next(err);
  }
};

export const deleteQuote: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const quote = await Quote.findOne(id);
    if (!quote) {
      return res.status(404).json({ message: 'not found' });
    }
    await Quote.delete(id);
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
