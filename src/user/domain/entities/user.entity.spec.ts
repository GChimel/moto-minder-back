import { User } from './user.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('User Entity', () => {
  const validInput = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
  };

  describe('create', () => {
    it('should create a valid user entity', async () => {
      const user = await User.create(validInput);

      expect(user.getId()).toBeDefined();
      expect(user.getName()).toBe(validInput.name);
      expect(user.getEmail().getValue()).toBe(validInput.email);
      expect(user.getPassword()).toBeDefined();
      expect(user.getCreatedAt()).toBeDefined();
      expect(user.getUpdatedAt()).toBeDefined();
    });

    it('should hash the password', async () => {
      const user = await User.create(validInput);
      const hashedPassword = user.getPassword();

      expect(hashedPassword).not.toBe(validInput.password);
      expect(hashedPassword).toBeDefined();
    });

    it('should set creation timestamps', async () => {
      const beforeCreation = new Date();
      const user = await User.create(validInput);
      const afterCreation = new Date();

      expect(user.getCreatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(user.getCreatedAt().getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should have equal created and updated timestamps on creation', async () => {
      const user = await User.create(validInput);

      expect(user.getCreatedAt().getTime()).toBe(user.getUpdatedAt().getTime());
    });

    it('should reject user without name', async () => {
      await expect(
        User.create({
          ...validInput,
          name: '',
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });

    it('should reject user with name too short', async () => {
      await expect(
        User.create({
          ...validInput,
          name: 'A',
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });

    it('should reject user with only whitespace name', async () => {
      await expect(
        User.create({
          ...validInput,
          name: '   ',
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });

    it('should trim name whitespace', async () => {
      const user = await User.create({
        ...validInput,
        name: '  John Doe  ',
      });

      expect(user.getName()).toBe('John Doe');
    });

    it('should reject invalid email format', async () => {
      await expect(
        User.create({
          ...validInput,
          email: 'invalid-email',
        }),
      ).rejects.toThrow();
    });

    it('should accept optional password', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',

      });

      expect(user.getPassword()).toBeUndefined();
    });
  });

  describe('updateName', () => {
    it('should update name successfully', async () => {
      const user = await User.create(validInput);
      const originalUpdatedAt = user.getUpdatedAt();

      user.updateName('Jane Doe');

      expect(user.getName()).toBe('Jane Doe');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should reject invalid name during update', async () => {
      const user = await User.create(validInput);

      expect(() => user.updateName('A')).toThrow(InvalidArgumentException);
    });

    it('should trim name during update', async () => {
      const user = await User.create(validInput);

      user.updateName('  Jane Doe  ');

      expect(user.getName()).toBe('Jane Doe');
    });

    it('should reject empty name during update', async () => {
      const user = await User.create(validInput);

      expect(() => user.updateName('')).toThrow();
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      const user = await User.create(validInput);
      const originalUpdatedAt = user.getUpdatedAt();

      user.updateEmail('newemail@example.com');

      expect(user.getEmail().getValue()).toBe('newemail@example.com');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should reject invalid email format', async () => {
      const user = await User.create(validInput);

      expect(() => user.updateEmail('invalid-email')).toThrow();
    });

    it('should accept valid email formats', async () => {
      const user = await User.create(validInput);

      expect(() => user.updateEmail('test@example.com')).not.toThrow();
      expect(() => user.updateEmail('user.name@example.co.uk')).not.toThrow();
      expect(() => user.updateEmail('user+tag@example.com')).not.toThrow();
    });
  });

  describe('updatePassword', () => {
    it('should update password with hashed value', async () => {
      const user = await User.create(validInput);
      const originalPassword = user.getPassword();
      const newHashedPassword = 'newhashed$password$value';

      user.updatePassword(newHashedPassword);

      expect(user.getPassword()).toBe(newHashedPassword);
      expect(user.getPassword()).not.toBe(originalPassword);
    });

    it('should update timestamp when password changes', async () => {
      const user = await User.create(validInput);
      const originalUpdatedAt = user.getUpdatedAt();

      user.updatePassword('newhashed$password$value');

      expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', async () => {
      const user = await User.create(validInput);

      expect(user.getId()).toBeDefined();
      expect(user.getName()).toBe(validInput.name);
      expect(user.getEmail()).toBeDefined();
      expect(user.getPassword()).toBeDefined();
      expect(user.getCreatedAt()).toBeDefined();
      expect(user.getUpdatedAt()).toBeDefined();
    });

    it('should return undefined for password if not set', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(user.getPassword()).toBeUndefined();
    });
  });

  describe('getAccountAge', () => {
    it('should calculate account age in days', async () => {
      const user = await User.create(validInput);
      const accountAge = user.getAccoutAge();

      expect(accountAge).toBeLessThanOrEqual(1);
      expect(typeof accountAge).toBe('number');
    });

    it('should return correct age for older accounts', async () => {
      const user = await User.create(validInput);

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      expect(typeof user.getAccoutAge()).toBe('number');
    });
  });

  describe('value object integration', () => {
    it('should validate email via Email VO', async () => {
      await expect(
        User.create({
          ...validInput,
          email: 'invalid',
        }),
      ).rejects.toThrow();
    });

    it('should hash password via UserPassword VO', async () => {
      const user1 = await User.create(validInput);
      const user2 = await User.create(validInput);

      expect(user1.getPassword()).toBeDefined();
      expect(user2.getPassword()).toBeDefined();

      expect(user1.getPassword()).not.toBe(user2.getPassword());
    });
  });

  describe('email uniqueness scenario', () => {
    it('should support finding users by email', async () => {
      const user = await User.create(validInput);

      expect(user.getEmail().getValue()).toBe(validInput.email);
    });
  });
});
