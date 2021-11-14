export interface AuthProviderProfileInfo extends AuthProviderProfileEmail {
    username: string
}

export interface AuthProviderProfileEmail {
    email: string
    verified: boolean
}