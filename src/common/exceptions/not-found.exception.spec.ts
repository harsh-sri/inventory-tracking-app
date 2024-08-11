import { HttpStatus } from '@nestjs/common';
import { NotFoundException } from './not-found.exception';

describe('Exceptions: NotFound', () => {
  it('should format the error', async () => {
    let error;

    const details = {
      ['param.id']: 'not found',
    };

    try {
      throw new NotFoundException({ details });
    } catch (e) {
      error = e.response;
      error.status = e.status;
    } finally {
      expect(error).toBeDefined();
      expect(error.details).toEqual(details);
      expect(error.message).toBeFalsy();
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });

  it('should format both error and message', async () => {
    let error;

    const details = {
      ['param.id']: 'not found',
    };
    const message = 'Sorry! requested resource not found.';

    try {
      throw new NotFoundException({
        details,
        message,
      });
    } catch (e) {
      error = e.response;
      error.status = e.status;
    } finally {
      expect(error).toBeDefined();
      expect(error.details).toEqual(details);
      expect(error.message).toEqual(message);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
