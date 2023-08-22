import { getParameterFilteredProjects } from './HelperUtils';

describe('getParameterFilteredProjects', () => {
  it('should return an empty list when there are no params set', () => {
    const result = getParameterFilteredProjects([], [], 0);
    expect(result).toStrictEqual([]);
  });
});
