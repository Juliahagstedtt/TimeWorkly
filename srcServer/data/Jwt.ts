import jwt from 'jsonwebtoken'
import { payloadSchema } from './types.js'

// skapa och verifiera jwt
const Secret: string = process.env.JWT_SECRET || 'secret-token1313'

// Skapa jwt för användare med userId
export function createToken(userId: string) {
    return jwt.sign({ userId }, Secret, { expiresIn: '1h'})
}

// Verifierar jwt och returnerar payload
export function verifyToken(token: string) {
    const payload = jwt.verify(token, Secret);

    const parsed = payloadSchema.safeParse(payload);


    // Om payload inte är ett objekt eller null, token ogiltig
    if(!parsed.success) {
        throw new Error('Ogiltig token')
    }

    // returnerar info om användaren
    return parsed.data;
}