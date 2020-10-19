import faker from 'faker';
import supertest from 'supertest';
import { getConnection } from 'typeorm';
import app from '../src/app';
import { Quote } from '../src/entity/Quote';
import { setupDatabase } from '../src/init/database';
import { cleanDatabase } from './utils';
import { addQuote, addRandomQuotes } from './utils/quote';

const convertQuoteToObject = (quote: Quote) => ({
  id: quote.id,
  content: quote.content,
  authorName: quote.authorName,
  createdAt: quote.createdAt?.toISOString(),
  updatedAt: quote.updatedAt?.toISOString(),
});

// Connect to the db before running any test case
beforeAll(async () => {
  await setupDatabase();
});

// Clean the db connection before each test case
beforeEach(async () => {
  await cleanDatabase();
});

// Close the db connection after all the test cases have run
afterAll(async () => {
  const connection = getConnection();
  await connection.close();
});

describe('quote API', () => {
  describe('GET /quotes', () => {
    describe('when there are no quotes', () => {
      test('should return empty array', async () => {
        const response = await supertest(app).get('/api/v1/quotes');
        expect(response.status).toStrictEqual(200);
        expect(response.body.message).toStrictEqual('found');
        const receivedQuotes = response.body.quotes;
        expect(receivedQuotes).toStrictEqual([]);
      });
    });

    describe('when there are quotes', () => {
      test('should return all quotes in reverse update time', async () => {
        const randomQuotes = await addRandomQuotes(10);
        // Sort in reverse updated order
        randomQuotes.sort((q1, q2) => {
          if (!q1.updatedAt || !q2.updatedAt) {
            return 0;
          }
          if (q1.updatedAt > q2.updatedAt) {
            return -1;
          }
          if (q1.updatedAt === q2.updatedAt) {
            return 0;
          } else {
            return 1;
          }
        });
        const expectedQuotes = randomQuotes.map(convertQuoteToObject);
        const response = await supertest(app).get('/api/v1/quotes');
        expect(response.status).toStrictEqual(200);
        expect(response.body.message).toStrictEqual('found');
        const receivedQuotes = response.body.quotes;
        expect(receivedQuotes.length).toStrictEqual(expectedQuotes.length);
        expectedQuotes.forEach((expectedQuote, index) => {
          expect(receivedQuotes[index]).toStrictEqual(expectedQuote);
        });
      });
    });
  });

  describe('GET /quotes/:id', () => {
    describe('given valid id', () => {
      test('should return the correct quote', async () => {
        const quotes = (await addRandomQuotes(3)).map(convertQuoteToObject);
        const response = await supertest(app).get('/api/v1/quotes/3');
        expect(response.status).toStrictEqual(200);
        expect(response.body.message).toStrictEqual('found');
        expect(response.body.quote).toStrictEqual(quotes[2]);
      });
    });

    describe('given invalid id', () => {
      test('should return 404', async () => {
        await addRandomQuotes(2);
        const response = await supertest(app).get('/api/v1/quotes/3');
        expect(response.status).toStrictEqual(404);
        expect(response.body.message).toStrictEqual('not found');
        expect(response.body.quote).toBeUndefined();
      });
    });
  });

  describe('POST /quotes', () => {
    beforeEach(async () => {
      // Add 2 other quotes into the DB first
      await addRandomQuotes(2);
    });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const sendCreateRequest = async (quote: object) => {
      return supertest(app).post('/api/v1/quotes').send(quote);
    };

    describe('with valid request body', () => {
      const validQuote = {
        content: faker.lorem.sentence(),
        authorName: faker.name.findName(),
      };

      test('should return the created quote', async () => {
        const response = await sendCreateRequest(validQuote);
        expect(response.status).toStrictEqual(201);
        expect(response.body.message).toStrictEqual('created');
        expect(response.body.quote.id).toStrictEqual(3);
        expect(response.body.quote.content).toStrictEqual(validQuote.content);
        expect(response.body.quote.authorName).toStrictEqual(
          validQuote.authorName,
        );
      });

      test('should create a quote', async () => {
        await sendCreateRequest(validQuote);
        const dbQuote = await Quote.findOne(3);
        expect(dbQuote).not.toBeUndefined();
        expect(dbQuote?.content).toStrictEqual(validQuote.content);
        expect(dbQuote?.authorName).toStrictEqual(validQuote.authorName);
      });
    });

    describe('with invalid request body', () => {
      const invalidQuote = {
        someKey: 'someValue',
        someOtherKey: 12,
      };
      test('should not create the quote', async () => {
        await sendCreateRequest(invalidQuote);
        const [, count] = await Quote.findAndCount();
        expect(count).toStrictEqual(2);
      });

      test('should return 400', async () => {
        const response = await sendCreateRequest(invalidQuote);
        expect(response.status).toStrictEqual(400);
        expect(response.body.message).toStrictEqual(
          'content and authorName are required and must be strings',
        );
        expect(response.body.quote).toBeUndefined();
      });
    });
  });

  describe('PUT /quotes/:id', () => {
    const originalQuote = {
      content: 'original content',
      authorName: 'original name',
    };
    const updatedQuote = {
      content: 'updated content',
      authorName: 'updated name',
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    const sendUpdateRequest = async (id: number, updatedQuote: object) => {
      return supertest(app).put(`/api/v1/quotes/${id}`).send(updatedQuote);
    };

    beforeEach(async () => {
      await addQuote(originalQuote.content, originalQuote.authorName);
    });

    describe('given valid id and valid body', () => {
      test('should return the updated quote', async () => {
        const response = await sendUpdateRequest(1, updatedQuote);
        expect(response.status).toStrictEqual(200);
        expect(response.body.message).toStrictEqual('updated');
        expect(response.body.quote.id).toStrictEqual(1);
        expect(response.body.quote.content).toStrictEqual(updatedQuote.content);
        expect(response.body.quote.authorName).toStrictEqual(
          updatedQuote.authorName,
        );
      });

      test('should update the quote', async () => {
        await sendUpdateRequest(1, updatedQuote);
        const dbQuote = await Quote.findOne(1);
        expect(dbQuote).not.toBeUndefined();
        expect(dbQuote?.content).toStrictEqual(updatedQuote.content);
        expect(dbQuote?.authorName).toStrictEqual(updatedQuote.authorName);
      });
    });

    describe('given invalid id', () => {
      test('should return 404', async () => {
        const response = await sendUpdateRequest(2, updatedQuote);
        expect(response.status).toStrictEqual(404);
        expect(response.body.message).toStrictEqual('not found');
      });
    });

    describe('given invalid request body', () => {
      test('should not update the quote', async () => {
        await sendUpdateRequest(2, updatedQuote);
        const dbQuote = await Quote.findOne(1);
        expect(dbQuote).not.toBeUndefined();
        expect(dbQuote?.content).toStrictEqual(originalQuote.content);
        expect(dbQuote?.authorName).toStrictEqual(originalQuote.authorName);
      });

      test('should return 400', async () => {
        const response = await sendUpdateRequest(1, {
          someRandomField: '123',
          anotherStrangeField: 456,
        });
        expect(response.status).toStrictEqual(400);
        expect(response.body.message).toStrictEqual(
          'content and authorName are required and must be strings',
        );
      });
    });
  });

  describe('DELETE /quotes/:id', () => {
    beforeEach(async () => {
      // Add a quote first
      await addRandomQuotes(1);
      const addedQuote = await Quote.findOne(1);
      expect(addedQuote).not.toBeUndefined();
    });

    const sendDeleteRequest = (id: number) => {
      return supertest(app).delete(`/api/v1/quotes/${id}`);
    };

    describe('with valid id', () => {
      test('should delete the quote', async () => {
        const response = await sendDeleteRequest(1);
        const dbQuote = await Quote.findOne(1);
        expect(dbQuote).toBeUndefined();
        expect(response.status).toStrictEqual(204);
      });
    });

    describe('with invalid id', () => {
      test('should not delete', async () => {
        await sendDeleteRequest(2);
        const [, count] = await Quote.findAndCount();
        expect(count).toStrictEqual(1);
      });

      test('should return 404', async () => {
        const response = await sendDeleteRequest(2);
        expect(response.status).toStrictEqual(404);
      });
    });
  });
});
