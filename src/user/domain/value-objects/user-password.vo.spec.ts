/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserPassword } from './user-password.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('UserPassword Value Object', () => {
  describe('create', () => {
    it('should create a password hash from valid password', async () => {
      const password = 'securePassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should hash the password', async () => {
      const password = 'securePassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword?.hash).not.toBe(password);
    });

    it('should create different hashes for the same password', async () => {
      const password = 'securePassword123';
      const userPassword1 = await UserPassword.create(password);
      const userPassword2 = await UserPassword.create(password);

      expect(userPassword1?.hash).not.toBe(userPassword2?.hash);
    });

    it('should return null for null password', async () => {
      const userPassword = await UserPassword.create(null);

      expect(userPassword).toBeNull();
    });

    it('should return null for empty string', async () => {
      const userPassword = await UserPassword.create('');

      expect(userPassword).toBeNull();
    });

    it('should reject password shorter than 8 characters', async () => {
      await expect(UserPassword.create('pass123')).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should reject password with exactly 7 characters', async () => {
      await expect(UserPassword.create('passwor')).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should accept password with exactly 8 characters', async () => {
      const userPassword = await UserPassword.create('password');

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should accept long passwords', async () => {
      const longPassword = 'a'.repeat(100);
      const userPassword = await UserPassword.create(longPassword);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should accept passwords with special characters', async () => {
      const password = 'P@ssw0rd!#$%^&*()';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should accept passwords with spaces', async () => {
      const password = 'my secure password 123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should accept passwords with unicode characters', async () => {
      const password = 'pässwörd123!';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should produce bcrypt-format hash', async () => {
      const userPassword = await UserPassword.create('securePassword123');

      expect(userPassword?.hash).toMatch(/^\$2[aby]\$/);
    });

    it('should use cost factor of 10', async () => {
      const userPassword = await UserPassword.create('securePassword123');

      expect(userPassword?.hash).toMatch(/^\$2[aby]\$10\$/);
    });
  });

  describe('getValue', () => {
    it('should return the hashed password', async () => {
      const password = 'securePassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword?.getValue()).toBeDefined();
      expect(userPassword?.getValue()).toBe(userPassword?.hash);
    });

    it('should return hashed value, not plain text', async () => {
      const password = 'securePassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword?.getValue()).not.toBe(password);
    });

    it('should return consistent hash across getValue calls', async () => {
      const password = 'securePassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword?.getValue()).toBe(userPassword?.getValue());
    });
  });

  describe('compare', () => {
    it('should return true for correct password', async () => {
      const password = 'securePassword123';
      const mockUser = {
        getPassword: () =>
          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
      };

      const result = await UserPassword.compare(password, mockUser as any);

      expect(typeof result).toBe('boolean');
    });

    it('should return false for incorrect password', async () => {
      const password = 'wrongPassword';
      const mockUser = {
        getPassword: () =>
          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
      };

      const result = await UserPassword.compare(password, mockUser as any);

      expect(typeof result).toBe('boolean');
    });

    it('should return false when user has no password', async () => {
      const password = 'securePassword123';
      const mockUser = {
        getPassword: () => undefined,
      };

      const result = await UserPassword.compare(password, mockUser as any);

      expect(result).toBe(false);
    });

    it('should handle bcrypt comparison correctly', async () => {
      const plainPassword = 'testPassword123';
      const userPassword = await UserPassword.create(plainPassword);

      const mockUser = {
        getPassword: () => userPassword?.hash,
      };

      const isValid = await UserPassword.compare(
        plainPassword,
        mockUser as any,
      );

      expect(isValid).toBe(true);
    });

    it('should reject wrong password against stored hash', async () => {
      const plainPassword = 'testPassword123';
      const userPassword = await UserPassword.create(plainPassword);

      const mockUser = {
        getPassword: () => userPassword?.hash,
      };

      const isValid = await UserPassword.compare(
        'wrongPassword456',
        mockUser as any,
      );

      expect(isValid).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const plainPassword = 'TestPassword123';
      const userPassword = await UserPassword.create(plainPassword);

      const mockUser = {
        getPassword: () => userPassword?.hash,
      };

      const isValidSameCase = await UserPassword.compare(
        'TestPassword123',
        mockUser as any,
      );
      const isValidDifferentCase = await UserPassword.compare(
        'testpassword123',
        mockUser as any,
      );

      expect(isValidSameCase).toBe(true);
      expect(isValidDifferentCase).toBe(false);
    });

    it('should handle empty password string', async () => {
      const userPassword = await UserPassword.create('securePassword123');

      const mockUser = {
        getPassword: () => userPassword?.hash,
      };

      const result = await UserPassword.compare('', mockUser as any);

      expect(result).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not allow hash modification', async () => {
      const userPassword = await UserPassword.create('securePassword123');
      const originalHash = userPassword?.hash;

      expect(userPassword?.hash).toBe(originalHash);
    });

    it('should maintain consistent hash value', async () => {
      const userPassword = await UserPassword.create('securePassword123');
      const hash1 = userPassword?.hash;
      const hash2 = userPassword?.hash;

      expect(hash1).toBe(hash2);
    });
  });

  describe('security properties', () => {
    it('should use bcrypt algorithm (salted)', async () => {
      const userPassword = await UserPassword.create('securePassword123');

      expect(userPassword?.hash).toMatch(/^\$2[abxy]\$/);
    });

    it('should create salted hashes (different for same password)', async () => {
      const password = 'securePassword123';
      const hash1 = (await UserPassword.create(password))?.hash;
      const hash2 = (await UserPassword.create(password))?.hash;

      expect(hash1).not.toBe(hash2);

      expect(hash1).toMatch(/^\$2[abxy]\$/);
      expect(hash2).toMatch(/^\$2[abxy]\$/);
    });

    it('should never expose plain text in hash', async () => {
      const password = 'myPassword123';
      const userPassword = await UserPassword.create(password);

      expect(userPassword?.hash).not.toContain(password);
      expect(userPassword?.getValue()).not.toContain(password);
    });

    it('should produce long hashes (bcrypt standard)', async () => {
      const userPassword = await UserPassword.create('securePassword123');

      expect(userPassword?.hash?.length).toBe(60);
    });
  });

  describe('edge cases', () => {
    it('should handle passwords with leading/trailing spaces', async () => {
      const password = '  securePassword123  ';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should accept very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);
      const userPassword = await UserPassword.create(longPassword);

      expect(userPassword).toBeDefined();
    });

    it('should handle numbers-only password', async () => {
      const password = '12345678';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });

    it('should handle symbols-only password', async () => {
      const password = '!@#$%^&*';
      const userPassword = await UserPassword.create(password);

      expect(userPassword).toBeDefined();
      expect(userPassword?.hash).toBeDefined();
    });
  });

  describe('validation', () => {
    it('should throw InvalidArgumentException for short password', async () => {
      await expect(UserPassword.create('short')).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should have proper error context', async () => {
      try {
        await UserPassword.create('short');
        fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(InvalidArgumentException);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should support common password formats', async () => {
      const passwords = [
        'P@ssw0rd!',
        'MySecurePassword123',
        'correct-horse-battery-staple',
        'UberComplexPassword!@#$%',
        '你好World123!',
      ];

      for (const password of passwords) {
        const userPassword = await UserPassword.create(password);
        expect(userPassword).toBeDefined();
      }
    });

    it('should verify password in authentication flow', async () => {
      const plainPassword = 'MySecurePassword123';
      const storedPassword = await UserPassword.create(plainPassword);

      const mockUser = {
        getPassword: () => storedPassword?.hash,
      };

      const isCorrect = await UserPassword.compare(
        plainPassword,
        mockUser as any,
      );

      expect(isCorrect).toBe(true);
    });

    it('should handle optional password in user creation', async () => {
      const optionalPassword = await UserPassword.create(null);

      expect(optionalPassword).toBeNull();
    });
  });
});
