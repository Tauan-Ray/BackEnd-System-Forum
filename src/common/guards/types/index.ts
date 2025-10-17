export type jwtReponse = {
    payload: { ID_USER: string, USERNAME: string, ROLE: string },
    iat: number,
    exp: number,
}