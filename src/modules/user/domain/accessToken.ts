export interface AccessTokenClaims {
    userId: string;
    isEmailVerified: boolean;
    email: string;
    username: string;
    adminUser: boolean;
    roleId: number
};

export type AccessToken = string;