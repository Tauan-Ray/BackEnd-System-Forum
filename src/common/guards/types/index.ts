export type jwtReponse = {
    payload: { sub: string, username: string, role: string, email: string },
    iat: number,
    exp: number,
}