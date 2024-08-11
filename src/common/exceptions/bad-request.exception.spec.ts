import { HttpStatus } from '@nestjs/common';
import { BadRequestException } from './bad-request.exception';

describe('Exception: Bad Request', () => {
  it('should format error details', async () => {
    let error;
    const details = {
      ['param.Id']: 'is not valid',
    };

    try {
      throw new BadRequestException({ details });
    } catch (e) {
      error = e.response;
      error.status = e.status;
    } finally {
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(error.details).toEqual(details);
      expect(error.message).toBeFalsy();
    }
  });

  it('should pass error & message details', async () => {
    let error;
    const details = {
      ['param.Id']: 'is not valid',
    };

    const message = 'input validation failed!';

    try {
      throw new BadRequestException({ details, message });
    } catch (e) {
      error = e.response;
      error.status = e.status;
    } finally {
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(error.details).toEqual(details);
      expect(error.message).toEqual(message);
    }
  });
});
