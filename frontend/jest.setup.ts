import '@testing-library/jest-dom';

// Mock scrollIntoView for elements, as JSDOM does not implement it.
window.HTMLElement.prototype.scrollIntoView = jest.fn();