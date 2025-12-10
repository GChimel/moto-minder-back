import { Manufacturer } from './manufacturer.entity';
import { InvalidManufacturerNameException } from '../exceptions/invalid-manufacturer-name.exception';

describe('Manufacturer Entity', () => {
  describe('create', () => {
    it('should create a valid manufacturer', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');

      expect(manufacturer.getId()).toBeDefined();
      expect(manufacturer.getName()).toBe('Harley-Davidson');
    });

    it('should trim whitespace from name', () => {
      const manufacturer = Manufacturer.create('  Harley-Davidson  ');

      expect(manufacturer.getName()).toBe('Harley-Davidson');
    });

    it('should accept minimum valid name length (2 characters)', () => {
      const manufacturer = Manufacturer.create('HD');

      expect(manufacturer.getName()).toBe('HD');
    });

    it('should reject empty name', () => {
      expect(() => Manufacturer.create('')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should reject whitespace-only name', () => {
      expect(() => Manufacturer.create('   ')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should reject name shorter than 2 characters', () => {
      expect(() => Manufacturer.create('A')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should accept long manufacturer names', () => {
      const longName = 'Legendary German Engineering Motorcycle Manufacturers';
      const manufacturer = Manufacturer.create(longName);

      expect(manufacturer.getName()).toBe(longName);
    });

    it('should accept names with special characters', () => {
      const nameWithSpecialChars = "Harley-Davidson's & Co.";
      const manufacturer = Manufacturer.create(nameWithSpecialChars);

      expect(manufacturer.getName()).toBe(nameWithSpecialChars);
    });

    it('should accept names with numbers', () => {
      const nameWithNumbers = 'BMW Motorrad 2024';
      const manufacturer = Manufacturer.create(nameWithNumbers);

      expect(manufacturer.getName()).toBe(nameWithNumbers);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute from database values', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const name = 'Harley-Davidson';

      const manufacturer = Manufacturer.reconstitute(id, name);

      expect(manufacturer.getId().getValue()).toBe(id);
      expect(manufacturer.getName()).toBe(name);
    });

    it('should preserve exact name without trimming during reconstitute', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const name = 'Harley-Davidson';

      const manufacturer = Manufacturer.reconstitute(id, name);

      expect(manufacturer.getName()).toBe(name);
    });
  });

  describe('updateName', () => {
    it('should update manufacturer name successfully', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      manufacturer.updateName('Ducati');

      expect(manufacturer.getName()).toBe('Ducati');
    });

    it('should trim whitespace when updating name', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      manufacturer.updateName('  Ducati  ');

      expect(manufacturer.getName()).toBe('Ducati');
    });

    it('should reject empty name during update', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');

      expect(() => manufacturer.updateName('')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should reject whitespace-only name during update', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');

      expect(() => manufacturer.updateName('   ')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should reject name shorter than 2 characters during update', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');

      expect(() => manufacturer.updateName('X')).toThrow(
        InvalidManufacturerNameException,
      );
    });

    it('should accept valid updated name', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      manufacturer.updateName('Kawasaki');

      expect(manufacturer.getName()).toBe('Kawasaki');
    });

    it('should handle multiple name updates', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');

      manufacturer.updateName('Ducati');
      expect(manufacturer.getName()).toBe('Ducati');

      manufacturer.updateName('BMW Motorrad');
      expect(manufacturer.getName()).toBe('BMW Motorrad');

      manufacturer.updateName('Suzuki');
      expect(manufacturer.getName()).toBe('Suzuki');
    });
  });

  describe('getters', () => {
    it('should return id via getId', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      const id = manufacturer.getId();

      expect(id).toBeDefined();
      expect(id.getValue()).toBeDefined();
    });

    it('should return name via getName', () => {
      const manufacturerName = 'Harley-Davidson';
      const manufacturer = Manufacturer.create(manufacturerName);

      expect(manufacturer.getName()).toBe(manufacturerName);
    });

    it('should return consistent id across multiple getter calls', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      const id1 = manufacturer.getId();
      const id2 = manufacturer.getId();

      expect(id1.equals(id2)).toBe(true);
    });
  });

  describe('id generation', () => {
    it('should generate unique ids for different manufacturers', () => {
      const manufacturer1 = Manufacturer.create('Harley-Davidson');
      const manufacturer2 = Manufacturer.create('Ducati');

      expect(manufacturer1.getId().equals(manufacturer2.getId())).toBe(false);
    });

    it('should generate valid UUID format', () => {
      const manufacturer = Manufacturer.create('Harley-Davidson');
      const id = manufacturer.getId().getValue();

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(id)).toBe(true);
    });
  });

  describe('real-world manufacturers', () => {
    it('should support major motorcycle manufacturers', () => {
      const manufacturers = [
        'Harley-Davidson',
        'Ducati',
        'BMW Motorrad',
        'Kawasaki',
        'Yamaha',
        'Suzuki',
        'Honda',
        'KTM',
        'Royal Enfield',
        'Triumph Motorcycles',
      ];

      manufacturers.forEach((name) => {
        const manufacturer = Manufacturer.create(name);
        expect(manufacturer.getName()).toBe(name);
      });
    });

    it('should support motorcycle brands with special formatting', () => {
      const manufacturer = Manufacturer.create("Harley-Davidson's");
      expect(manufacturer.getName()).toBe("Harley-Davidson's");
    });
  });

  describe('immutability of id', () => {
    it('should return same id object after reconstitute', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const manufacturer = Manufacturer.reconstitute(id, 'Test');

      expect(manufacturer.getId().getValue()).toBe(id);
    });
  });
});
