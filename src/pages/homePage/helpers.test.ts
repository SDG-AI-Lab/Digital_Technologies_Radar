import { CAROUSEL_ITEMS } from './helpers';

describe('HomePage helpers', () => {
  it('exposes three carousel items with labels and routes', () => {
    expect(CAROUSEL_ITEMS).toHaveLength(3);
    CAROUSEL_ITEMS.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.route).toBeTruthy();
      expect(item.img_url).toBeTruthy();
    });
  });
});
