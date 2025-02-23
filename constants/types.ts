interface User {
	token: string;
	firstName: string;
	lastName: string;
	email: string;
	id: number;
	roles: string[];
	name: string;
}
export interface TokenPayload {
	user: User;
	expires: string;
	name: string;
	email: string;
	sub: string;
	iat: number;
	exp: number;
	jti: string;
}