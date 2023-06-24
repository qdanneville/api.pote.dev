export interface AccessTokenClaims {
    userId: string;
    isEmailVerified: boolean;
    email: string;
    username: string;
    isAdmin: boolean;
    roleName: string,
    xsrfToken: string
};

export type AccessToken = string;