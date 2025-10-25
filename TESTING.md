# Testing Guide

This guide explains how to test your hexagonal architecture application.

## 🧪 Testing Strategy

We use a **3-tier testing approach** following the testing pyramid:

```
        ┌─────────┐
        │   E2E   │  ← Fewest tests, slowest
        │  Tests  │     (Full HTTP → Database)
        └─────────┘
      ┌─────────────┐
      │ Integration │  ← Medium quantity
      │    Tests    │     (Controller + Use Case + Repository)
      └─────────────┘
    ┌─────────────────┐
    │   Unit Tests    │  ← Most tests, fastest
    │ (Domain + VOs)  │     (Pure business logic)
    └─────────────────┘
```

---

## 📦 Test Types

### 1. Unit Tests - Domain Layer

**Location**: `src/user/domain/**/*.spec.ts`

**Purpose**: Test pure business logic without any dependencies

**Example**:
```typescript
// user.entity.spec.ts
describe('User Entity', () => {
  it('should create a user with valid data', () => {
    const user = User.create('John Doe', 'john@example.com');

    expect(user.getName()).toBe('John Doe');
    expect(user.getEmail().getValue()).toBe('john@example.com');
  });
});
```

**Run**:
```bash
npm run test:unit
```

**Benefits**:
- ✅ Very fast (no I/O)
- ✅ No setup required
- ✅ Tests business rules in isolation
- ✅ Easy to debug

---

### 2. Unit Tests - Use Cases (with In-Memory Repository)

**Location**: `src/user/application/**/*.spec.ts`

**Purpose**: Test business workflows using in-memory data

**Example**:
```typescript
// create-user.use-case.spec.ts
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository(); // Fast!
    useCase = new CreateUserUseCase(repository);
  });

  it('should create a new user', async () => {
    const user = await useCase.execute({
      name: 'John',
      email: 'john@example.com',
    });

    expect(user).toBeDefined();
  });
});
```

**Run**:
```bash
npm run test:unit
```

**Benefits**:
- ✅ Fast (no database)
- ✅ No database setup required
- ✅ Easy to test edge cases
- ✅ Predictable data

---

### 3. Unit Tests - Use Cases (with Jest Mocks)

**Location**: `src/user/application/**/*.mock.spec.ts`

**Purpose**: Test use cases with fine-grained control over repository behavior

**Example**:
```typescript
describe('CreateUserUseCase (Mocks)', () => {
  let mockRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      // ... other methods
    };
  });

  it('should check email before saving', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.save.mockImplementation(async (u) => u);

    await useCase.execute({ name: 'John', email: 'john@example.com' });

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

**Run**:
```bash
npm run test:unit
```

**Benefits**:
- ✅ Can verify method calls
- ✅ Can test specific scenarios
- ✅ More control than in-memory repo

---

### 4. Integration Tests - Controller + Use Case + Repository

**Location**: `src/user/*.spec.ts`

**Purpose**: Test full module with NestJS DI

**Example**:
```typescript
describe('UserController (Integration)', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: InMemoryUserRepository, // Swap implementation!
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should create user and return response', async () => {
    const response = await controller.createUser({
      name: 'John',
      email: 'john@example.com',
    });

    expect(response).toHaveProperty('id');
    expect(response.name).toBe('John');
  });
});
```

**Run**:
```bash
npm test
```

**Benefits**:
- ✅ Tests NestJS dependency injection
- ✅ Tests full request flow
- ✅ Still uses in-memory repository (fast)

---

### 5. E2E Tests - HTTP to In-Memory

**Location**: `test/user.e2e-spec.ts`

**Purpose**: Test HTTP endpoints with in-memory storage

**Example**:
```typescript
describe('User API (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useClass(InMemoryUserRepository) // Fast E2E!
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST /users should create user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });
});
```

**Run**:
```bash
npm run test:e2e
```

**Benefits**:
- ✅ Tests full HTTP flow
- ✅ No database required
- ✅ Fast and reliable
- ✅ Good for CI/CD

---

### 6. E2E Tests - HTTP to Real Database

**Location**: `test/user-database.e2e-spec.ts`

**Purpose**: Test with actual PostgreSQL database

**Setup**:
```bash
# 1. Start database
docker compose up -d postgres

# 2. Run migrations
npm run migration:run
```

**Example**:
```typescript
describe('User API (E2E - Real Database)', () => {
  beforeEach(async () => {
    // Clean database before each test
    await dataSource.query('DELETE FROM users');
  });

  it('should persist to database', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    // Verify in database
    const result = await dataSource.query(
      'SELECT * FROM users WHERE email = $1',
      ['john@example.com'],
    );
    expect(result).toHaveLength(1);
  });
});
```

**Run**:
```bash
npm run test:e2e:db
```

**Benefits**:
- ✅ Tests actual database behavior
- ✅ Tests constraints and triggers
- ✅ Catches database-specific issues

**Drawbacks**:
- ⚠️ Slower (database I/O)
- ⚠️ Requires Docker running
- ⚠️ Requires migrations

---

## 🚀 Running Tests

### Quick Commands

```bash
# Run all tests (unit + integration)
npm test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:cov

# Run E2E tests (with in-memory)
npm run test:e2e

# Run E2E tests (with real database)
npm run test:e2e:db

# Debug tests
npm run test:debug
```

---

## 🎯 When to Use Each Test Type

### ✅ Use Unit Tests (Domain) When:
- Testing business rules
- Testing validations
- Testing value objects
- Testing entity methods

### ✅ Use Unit Tests (Use Cases) When:
- Testing workflows
- Testing business logic flow
- Testing error handling
- You want fast feedback

### ✅ Use Integration Tests When:
- Testing NestJS module wiring
- Testing dependency injection
- Testing controller → use case → repository flow

### ✅ Use E2E Tests (In-Memory) When:
- Testing HTTP endpoints
- Testing request/response format
- Running in CI/CD
- You want reliable tests

### ✅ Use E2E Tests (Database) When:
- Testing database constraints
- Testing transactions
- Testing migrations
- Before deploying to production

---

## 💡 Best Practices

### 1. Follow the Testing Pyramid

```
E2E with DB:    ~5% of tests   (slowest, most brittle)
E2E in-memory: ~10% of tests   (medium speed)
Integration:   ~20% of tests   (medium speed)
Unit:          ~65% of tests   (fastest, most reliable)
```

### 2. Use In-Memory Repository for Most Tests

```typescript
// ✅ GOOD: Fast, reliable
const repository = new InMemoryUserRepository();

// ❌ AVOID: Slow, requires setup
const repository = new TypeOrmUserRepository();
```

### 3. Clean State Between Tests

```typescript
beforeEach(() => {
  repository = new InMemoryUserRepository(); // Fresh instance
});
```

### 4. Test Business Logic, Not Implementation

```typescript
// ✅ GOOD: Tests behavior
it('should reject duplicate emails', async () => {
  await useCase.execute({ name: 'John', email: 'john@test.com' });
  await expect(
    useCase.execute({ name: 'Jane', email: 'john@test.com' })
  ).rejects.toThrow();
});

// ❌ BAD: Tests implementation details
it('should call repository.findByEmail', async () => {
  expect(mockRepo.findByEmail).toHaveBeenCalled();
});
```

---

## 📊 Coverage

Generate coverage report:

```bash
npm run test:cov
```

Open coverage report:
```bash
open coverage/lcov-report/index.html
```

**Aim for**:
- Domain layer: 100% coverage
- Use cases: 90%+ coverage
- Controllers: 80%+ coverage

---

## 🔄 The Power of Hexagonal Architecture

### Easy to Swap Implementations

```typescript
// Production
{
  provide: USER_REPOSITORY,
  useClass: TypeOrmUserRepository, // PostgreSQL
}

// Testing
{
  provide: USER_REPOSITORY,
  useClass: InMemoryUserRepository, // In-Memory
}
```

### Your business logic (use cases) stays the same! 🎉

---

## 🐛 Debugging Tests

### 1. Run Single Test File
```bash
npm test -- user.entity.spec.ts
```

### 2. Run Single Test Case
```bash
npm test -- -t "should create a user"
```

### 3. Use VSCode Debugger
Add breakpoints and press F5 (with Jest extension)

### 4. Use console.log
```typescript
it('should work', () => {
  console.log('User:', user);
  expect(user).toBeDefined();
});
```

---

## ✅ Summary

1. **Unit tests** are your friend - write lots of them!
2. **In-memory repository** makes tests fast and reliable
3. **E2E tests with database** are for final verification
4. **Hexagonal architecture** makes swapping implementations easy
5. **Focus on behavior**, not implementation details

Happy Testing! 🚀
