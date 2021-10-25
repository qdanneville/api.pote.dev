export interface RefreshTokenClaims {
    userId: string;
    isEmailVerified: boolean;
    email: string;
    username: string;
    adminUser: boolean;
    roleId: number
};

export type RefreshToken = string;