export type userPayload = {
  sub: string;
  username: string;
  role: string;
  email: string;
};

export type jwtReponse = {
  payload: userPayload;
  type: string;
  iat: number;
  exp: number;
};
