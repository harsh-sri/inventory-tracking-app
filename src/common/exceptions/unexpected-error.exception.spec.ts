import { HttpStatus } from '@nestjs/common';
import { UnExpectedErrorException } from './unexpected-error.exception';

describe('Exception: Unexpected Error', () => {
  it('should format error correctly', async () => {
    let error;
    const details = {
      ['msg.details']: 'something went wrong',
    };

    try {
      throw new UnExpectedErrorException({ details });
    } catch (e) {
      error = e.response;
      error.status = e.status;
    } finally {
      expect(error).toBeDefined();
      expect(error.details).toEqual(details);
      expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.message).toBeFalsy();
    }
  });

  it('should format error and message both', async () => {
    let error;
    const details = {
      msg: 'something went wrong',
    };

    const message = 'internal server error';

    try {
      throw new UnExpectedErrorException({
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
      expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
});
