import supertest from 'supertest';
import app from '../index';
import { generateToken, verifyToken } from '../utils/token';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../__mocks__/db';
import { vi,describe,it, expect } from 'vitest';

vi.mock("../db")

describe('Token Generation', () => {
    
  it('should generate a token with correct user details and expiration', () => {
      const user = { userId: '12345', email: 'test@example.com' };
      const token = generateToken(user);
        
      const decoded = jwt.decode(token) as jwt.JwtPayload;
  
      expect(decoded).toMatchObject({ userId: user.userId, email: user.email });
      expect(decoded.exp).toBeDefined();
  
      // Check if the token expires in 1 hour (3600 seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = 3600; // 1 hour in seconds 
      expect(decoded.exp).toBeGreaterThan(currentTime);
      expect(decoded.exp).toBeLessThanOrEqual(currentTime + expiresIn); 
    });

    it('should verify a token and return correct user details', () => { 
        const user = { userId: '12345', email: 'test@example.com' }; 
        const token = generateToken(user);
        
        const verified = verifyToken(token) as jwt.JwtPayload;
        
        expect(verified).toMatchObject({ userId: user.userId, email: user.email });
      });
    
      it('should return null for an invalid token', () => {
        const invalidToken = 'invalid.token';
        const verified = verifyToken(invalidToken);
        expect(verified).toBeNull();
      });

      it('should register a user', async () => {
                prismaClient.user.create.mockResolvedValue({ 
                        userId: '1',                
                        firstName: "ssa",
                        lastName: "klp",
                        email: "test@gmail.com",
                        phone: "08012345678",
                        password: "123 ",
                        createdAt: new Date(),
                        updatedAt: new Date()  
                });

                const response = await supertest(app).post('/auth/register').send({
                    firstName: "ssa", 
                    lastName: "klp", 
                    email: "test@gmail.com",
                    phone: "08012345678",
                    password: "123 "   
                }) 
                console.log(response.body);
                
                // expect(response.statu).toEqual("success"); 
                // expect(response.).toHaveProperty('data'); 
        });   
})
 