import faker from 'faker';
import { Quote } from '../../src/entity/Quote';

export const addRandomQuotes: (count: number) => Promise<Quote[]> = async (
  count,
) => {
  const quotes: Quote[] = [];
  for (let i = 0; i < count; i++) {
    quotes.push(await addQuote(faker.lorem.sentence(), faker.name.findName()));
  }
  return quotes;
};

export const addQuote: (
  content: string,
  authorName: string,
) => Promise<Quote> = async (content, authorName) => {
  const quote = new Quote();
  quote.content = content;
  quote.authorName = authorName;
  await quote.save();
  await quote.reload();
  return quote;
};
