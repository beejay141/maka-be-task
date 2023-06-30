import { GENERIC_ERROR_MESSAGE } from './constants';
import { ErrorResponse } from './response.util';

describe('ErrorResponse', () => {
  it('should return generic error message', () => {
    const result = ErrorResponse();

    expect(result).toEqual({ message: GENERIC_ERROR_MESSAGE });
  });

  it('should return error message passed as param', () => {
    const message = 'error occurred';

    const result = ErrorResponse(message);

    expect(result).toEqual({ message });
  });

  it('should return object containing message and errors field', () => {
    const result = ErrorResponse('error', ['error']);

    expect(result).toEqual({ message: 'error', errors: ['error'] });
  });
});
