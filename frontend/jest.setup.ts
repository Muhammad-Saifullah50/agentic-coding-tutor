import '@testing-library/jest-dom';

// Mock scrollIntoView for elements, as JSDOM does not implement it.
window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("@clerk/nextjs", () => ({
    useUser: () => ({
        user: {
            id: "test-user-id",
            fullName: "Test User",
            imageUrl: "https://example.com/avatar.png",
            username: "testuser",
        },
        isLoaded: true,
        isSignedIn: true,
    }),
    useClerk: () => ({
        signOut: jest.fn(),
        openSignIn: jest.fn(),
    }),
    ClerkProvider: ({ children }: any) => children,
    SignedIn: ({ children }: any) => children,
    SignedOut: ({ children }: any) => children,
    SignOutButton: ({ children }: any) => children,
}));