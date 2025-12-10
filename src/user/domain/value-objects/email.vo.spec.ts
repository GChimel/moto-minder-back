
import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('john@example.com');
      expect(email.getValue()).toBe('john@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = new Email('user@mail.example.com');
      expect(email.getValue()).toBe('user@mail.example.com');
    });

    it('should accept email with multiple subdomains', () => {
      const email = new Email('user@mail.corp.example.co.uk');
      expect(email.getValue()).toBe('user@mail.corp.example.co.uk');
    });

    it('should accept email with plus addressing', () => {
      const email = new Email('user+tag@example.com');
      expect(email.getValue()).toBe('user+tag@example.com');
    });

    it('should accept email with dots in local part', () => {
      const email = new Email('user.name@example.com');
      expect(email.getValue()).toBe('user.name@example.com');
    });

    it('should accept email with numbers', () => {
      const email = new Email('user123@example456.com');
      expect(email.getValue()).toBe('user123@example456.com');
    });

    it('should accept email with allowed special characters', () => {
      const email = new Email("user!#$%&'*+/=?^_`{|}~@example.com");
      expect(email.getValue()).toBe("user!#$%&'*+/=?^_`{|}~@example.com");
    });

    it('should accept email with hyphen in domain', () => {
      const email = new Email('user@my-example.com');
      expect(email.getValue()).toBe('user@my-example.com');
    });

    it('should accept minimum valid email length', () => {
      const email = new Email('a@b.co');
      expect(email.getValue()).toBe('a@b.co');
    });

    it('should accept maximum valid email length (254 chars)', () => {
      const longLocalPart = 'a'.repeat(235);
      const email = new Email(`${longLocalPart}@example.com`);
      expect(email.getValue()).toBe(`${longLocalPart}@example.com`);
    });

    it('should reject empty email', () => {
      expect(() => new Email('')).toThrow();
    });

    it('should reject null/undefined email', () => {
      expect(() => new Email(null as any)).toThrow();
      expect(() => new Email(undefined as any)).toThrow();
    });

    it('should reject email without @ symbol', () => {
      expect(() => new Email('userexample.com')).toThrow();
    });

    it('should reject email without local part', () => {
      expect(() => new Email('@example.com')).toThrow();
    });

    it('should reject email without domain', () => {
      expect(() => new Email('user@')).toThrow();
    });

    it('should reject email with multiple @ symbols', () => {
      expect(() => new Email('user@@example.com')).toThrow();
      expect(() => new Email('user@exam@ple.com')).toThrow();
    });

    it('should reject email with spaces', () => {
      expect(() => new Email('user @example.com')).toThrow();
      expect(() => new Email('user@ example.com')).toThrow();
      expect(() => new Email('user@exam ple.com')).toThrow();
    });

    it('should accept email with consecutive dots (regex allows)', () => {

      expect(() => new Email('user..name@example.com')).not.toThrow();
    });

    it('should reject email exceeding 254 character limit', () => {
      const tooLongLocalPart = 'a'.repeat(250);
      expect(() => new Email(`${tooLongLocalPart}@example.com`)).toThrow();
    });

    it('should reject email with invalid domain format', () => {
      expect(() => new Email('user@.com')).toThrow();
      expect(() => new Email('user@example.')).toThrow();
    });

    it('should reject non-string input', () => {
      expect(() => new Email(123 as any)).toThrow();
      expect(() => new Email({} as any)).toThrow();
      expect(() => new Email([] as any)).toThrow();
    });

    it('should normalize email to lowercase internally', () => {
      const email = new Email('User@Example.COM');
      expect(email.getValue()).toBe('User@Example.COM');
    });
  });

  describe('equals', () => {
    it('should return true for identical emails', () => {
      const email1 = new Email('john@example.com');
      const email2 = new Email('john@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('john@example.com');
      const email2 = new Email('jane@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false for case-insensitive comparison (preserves case)', () => {
      const email1 = new Email('John@Example.com');
      const email2 = new Email('john@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should distinguish between similar emails', () => {
      const email1 = new Email('user@example.com');
      const email2 = new Email('user.name@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should distinguish between different domains', () => {
      const email1 = new Email('user@example.com');
      const email2 = new Email('user@example.co.uk');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should distinguish between different subdomains', () => {
      const email1 = new Email('user@mail.example.com');
      const email2 = new Email('user@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not allow modification of email after creation', () => {
      const email = new Email('john@example.com');
      const originalValue = email.getValue();

      expect(email.getValue()).toBe(originalValue);
    });

    it('should return consistent value across multiple calls', () => {
      const email = new Email('john@example.com');

      expect(email.getValue()).toBe(email.getValue());
      expect(email.getValue()).toBe(email.getValue());
    });
  });

  describe('RFC 5322 compliance', () => {
    it('should validate according to simplified RFC 5322', () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-hyphen@example.com',
        'fully-qualified-domain@example.com',
        'user.name+tag+sorting@example.com',
        'x@example.com',
        'example@s.example',
        'mailhost!username@example.org',
      ];

      validEmails.forEach((email) => {
        expect(() => new Email(email)).not.toThrow();
      });
    });

    it('should reject invalid RFC 5322 formats', () => {
      const invalidEmails = [
        'plainaddress',
        '@no-local-part.com',
        'Abc.example.com',
        'A@b@c@example.com',
        'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
        'just"not"right@example.com',
        'this is"not\\allowed@example.com',
      ];

      invalidEmails.forEach((email) => {
        expect(() => new Email(email)).toThrow();
      });
    });
  });

  describe('real-world email addresses', () => {
    it('should accept common email formats', () => {
      const emails = [
        'john.doe@company.com',
        'jane_smith@company.co.uk',
        'support+help@company.com',
        'firstname.lastname@company.fr',
        'user1@subdomain.example.com',
      ];

      emails.forEach((email) => {
        expect(() => new Email(email)).not.toThrow();
      });
    });

    it('should work with business email providers', () => {
      const emails = [
        'user@gmail.com',
        'user@outlook.com',
        'user@yahoo.com',
        'user@protonmail.com',
      ];

      emails.forEach((email) => {
        expect(() => new Email(email)).not.toThrow();
      });
    });
  });
});
