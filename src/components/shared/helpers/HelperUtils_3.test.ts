import { sliceForBadge } from './HelperUtils';
import { totalParameterCount } from './HelperUtils';

describe('sliceForBadge', () => {
  it('should return the original array when its length is 0', () => {
    const inputArray: any = [];

    const result = sliceForBadge(inputArray);

    expect(result).toEqual([]);
  });

  it('should return the original array when its length is 1', () => {
    const inputArray: string[] = ['Project 1'];

    const result = sliceForBadge(inputArray);

    expect(result).toEqual(['Project 1']);
  });
  it('should handle arrays with various types of elements', () => {
    const inputArray: any = [42, 'Hello', true, { key: 'value' }, [1, 2, 3]];

    const result = sliceForBadge(inputArray);

    expect(result).toEqual([42, 'Hello', '...']);
  });
});

describe('totalParameterCount', () => {
  it('should return 0 when no parameters are provided', () => {
    const parameters = {};

    const result = totalParameterCount(parameters);

    expect(result).toEqual(0);
  });

  it('should return the sum of parameter counts', () => {
    const parameters = {
      Region: 2,
      'Sub Region': 1,
      Country: 3,
      'Disaster Type': 0,
      'UN Host': 1,
      SDG: 4,
      Data: 2
    };

    const result = totalParameterCount(parameters);

    expect(result).toEqual(13);
  });

  it('should handle parameter counts of various types', () => {
    const parameters = {
      Region: 2,
      'Sub Region': 1,
      Country: 3,
      'Disaster Type': 0,
      'UN Host': 1,
      SDG: 4,
      Data: 2
    };

    const result = totalParameterCount(parameters);

    expect(result).toEqual(13);
  });

  it('should return 0 when parameters object is empty', () => {
    const parameters = {};

    const result = totalParameterCount(parameters);

    expect(result).toEqual(0);
  });
});
