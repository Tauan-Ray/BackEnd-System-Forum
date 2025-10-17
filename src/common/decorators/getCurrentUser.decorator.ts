import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtReponse } from "../guards/types";

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext): jwtReponse => {
    const request = context.switchToHttp().getRequest()
    if (!data || !request?.user) return request?.user;

    return request?.user[data];
})