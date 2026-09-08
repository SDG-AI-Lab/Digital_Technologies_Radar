// How to use jest-dom: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

import './tests/mocks/ChackraUI';

expect.extend(toHaveNoViolations);
