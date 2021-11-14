export interface AccessTokenClaims {
    userId: string;
    isEmailVerified: boolean;
    email: string;
    username: string;
    isAdmin: boolean;
    roleId: number,
    xsrfToken: string
};

export type AccessToken = string;