/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment */
import { BadRequestException } from '@nestjs/common';
import { OAuthLoginUseCase, OAuthLoginDto } from './oauth-login.use-case';
import { IOAuthProvider, OAuthProfile } from '../ports/oauth-provider.port';
import { UserRepositoryPort } from '../../../user/application/ports/user.repository.port';
import { IAuthTokenGenerator } from '../ports/auth-token-generator.port';
import { User } from '../../../user/domain/entities/user.entity';

describe('OAuthLoginUseCase', () => {
  let useCase: OAuthLoginUseCase;
  let googleOAuthProvider: jest.Mocked<IOAuthProvider>;
  let garminOAuthProvider: jest.Mocked<IOAuthProvider>;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let authTokenGenerator: jest.Mocked<IAuthTokenGenerator>;

  beforeEach(() => {
    // Create mock OAuth providers
    googleOAuthProvider = {
      getProfile: jest.fn(),
      refreshToken: jest.fn(),
    } as unknown as jest.Mocked<IOAuthProvider>;

    garminOAuthProvider = {
      getProfile: jest.fn(),
      refreshToken: jest.fn(),
    } as unknown as jest.Mocked<IOAuthProvider>;

    // Create mock repositories
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    // Create mock token generator
    authTokenGenerator = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<IAuthTokenGenerator>;

    // Create use case with mocked dependencies
    useCase = new OAuthLoginUseCase(
      googleOAuthProvider,
      garminOAuthProvider,
      userRepository,
      authTokenGenerator,
    );
  });

  describe('execute with Google OAuth', () => {
    const validGoogleDto: OAuthLoginDto = {
      code: 'auth_code_12345',
      provider: 'google',
    };

    const mockGoogleProfile: OAuthProfile = {
      id: 'google_user_123',
      email: 'user@gmail.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      provider: 'google',
    };

    it('should create new user and return token for first-time Google login', async () => {
      // Arrange
      const expectedUser = await User.create({
        name: mockGoogleProfile.name,
        email: mockGoogleProfile.email,
        password: `oauth_${mockGoogleProfile.provider}_${mockGoogleProfile.id}`,
      });

      googleOAuthProvider.getProfile.mockResolvedValue(mockGoogleProfile);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue('jwt_token_12345');

      // Act
      const result = await useCase.execute(validGoogleDto);

      // Assert
      expect(result.token).toBe('jwt_token_12345');
      expect(result.user).toBeDefined();
      expect(googleOAuthProvider.getProfile).toHaveBeenCalledWith(
        validGoogleDto.code,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockGoogleProfile.email,
      );
      expect(userRepository.save).toHaveBeenCalled();
      expect(authTokenGenerator.generate).toHaveBeenCalledWith({
        sub: expect.any(String),
      });
    });

    it('should return token for existing Google user without creating new user', async () => {
      // Arrange
      const existingUser = await User.create({
        name: 'John Doe',
        email: 'user@gmail.com',
        password: 'any_password',
      });

      googleOAuthProvider.getProfile.mockResolvedValue(mockGoogleProfile);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      authTokenGenerator.generate.mockResolvedValue('jwt_token_existing_user');

      // Act
      const result = await useCase.execute(validGoogleDto);

      // Assert
      expect(result.token).toBe('jwt_token_existing_user');
      expect(result.user).toBeDefined();
      expect(googleOAuthProvider.getProfile).toHaveBeenCalledWith(
        validGoogleDto.code,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockGoogleProfile.email,
      );
      // Save should not be called for existing user
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(authTokenGenerator.generate).toHaveBeenCalled();
    });

    it('should handle Google OAuth profile correctly', async () => {
      // Arrange
      const googleProfile: OAuthProfile = {
        id: 'google_user_456',
        email: 'jane@gmail.com',
        name: 'Jane Smith',
        avatar: 'https://example.com/jane.jpg',
        provider: 'google',
      };

      const expectedUser = await User.create({
        name: googleProfile.name,
        email: googleProfile.email,
        password: `oauth_${googleProfile.provider}_${googleProfile.id}`,
      });

      googleOAuthProvider.getProfile.mockResolvedValue(googleProfile);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue('token');

      // Act
      const result = await useCase.execute({
        code: 'code_456',
        provider: 'google',
      });

      // Assert
      expect(result.user.getName()).toBe(googleProfile.name);
      expect(result.user.getEmail().getValue()).toBe(googleProfile.email);
    });
  });

  describe('execute with Garmin OAuth', () => {
    const validGarminDto: OAuthLoginDto = {
      code: 'garmin_auth_code',
      provider: 'garmin',
    };

    const mockGarminProfile: OAuthProfile = {
      id: 'garmin_user_789',
      email: 'rider@garmin.com',
      name: 'Bob Rider',
      avatar: 'https://example.com/bob.jpg',
      provider: 'garmin',
    };

    it('should create new user and return token for first-time Garmin login', async () => {
      // Arrange
      const expectedUser = await User.create({
        name: mockGarminProfile.name,
        email: mockGarminProfile.email,
        password: `oauth_${mockGarminProfile.provider}_${mockGarminProfile.id}`,
      });

      garminOAuthProvider.getProfile.mockResolvedValue(mockGarminProfile);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue('jwt_token_garmin');

      // Act
      const result = await useCase.execute(validGarminDto);

      // Assert
      expect(result.token).toBe('jwt_token_garmin');
      expect(result.user).toBeDefined();
      expect(garminOAuthProvider.getProfile).toHaveBeenCalledWith(
        validGarminDto.code,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockGarminProfile.email,
      );
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should return token for existing Garmin user without creating new user', async () => {
      // Arrange
      const existingUser = await User.create({
        name: 'Bob Rider',
        email: 'rider@garmin.com',
        password: 'any_password',
      });

      garminOAuthProvider.getProfile.mockResolvedValue(mockGarminProfile);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      authTokenGenerator.generate.mockResolvedValue(
        'jwt_token_existing_garmin',
      );

      // Act
      const result = await useCase.execute(validGarminDto);

      // Assert
      expect(result.token).toBe('jwt_token_existing_garmin');
      expect(result.user).toBeDefined();
      expect(garminOAuthProvider.getProfile).toHaveBeenCalledWith(
        validGarminDto.code,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockGarminProfile.email,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('provider selection', () => {
    it('should use Google provider when provider is "google"', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'user_id',
        email: 'test@gmail.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      const expectedUser = await User.create({
        name: mockProfile.name,
        email: mockProfile.email,
        password: 'oauth_password',
      });

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue('token');

      // Act
      await useCase.execute({
        code: 'code',
        provider: 'google',
      });

      // Assert
      expect(googleOAuthProvider.getProfile).toHaveBeenCalled();
      expect(garminOAuthProvider.getProfile).not.toHaveBeenCalled();
    });

    it('should use Garmin provider when provider is "garmin"', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'user_id',
        email: 'test@garmin.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'garmin',
      };

      const expectedUser = await User.create({
        name: mockProfile.name,
        email: mockProfile.email,
        password: 'oauth_password',
      });

      garminOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue('token');

      // Act
      await useCase.execute({
        code: 'code',
        provider: 'garmin',
      });

      // Assert
      expect(garminOAuthProvider.getProfile).toHaveBeenCalled();
      expect(googleOAuthProvider.getProfile).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for unsupported provider', async () => {
      // Arrange & Act & Assert
      await expect(
        useCase.execute({
          code: 'code',
          provider: 'unsupported_provider' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('token generation', () => {
    it('should generate token with correct subject (user id)', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'oauth_id',
        email: 'test@gmail.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      const createdUser = await User.create({
        name: mockProfile.name,
        email: mockProfile.email,
        password: 'oauth_password',
      });

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(createdUser);
      authTokenGenerator.generate.mockResolvedValue('jwt_token');

      // Act
      await useCase.execute({
        code: 'code',
        provider: 'google',
      });

      // Assert
      expect(authTokenGenerator.generate).toHaveBeenCalledWith({
        sub: expect.any(String),
      });

      const callArgs = authTokenGenerator.generate.mock.calls[0][0];
      expect(callArgs.sub).toBe(createdUser.getId().getValue());
    });

    it('should return generated token in response', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'oauth_id',
        email: 'test@gmail.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      const expectedUser = await User.create({
        name: mockProfile.name,
        email: mockProfile.email,
        password: 'oauth_password',
      });

      const expectedToken = 'jwt_token_xyz123';

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockResolvedValue(expectedToken);

      // Act
      const result = await useCase.execute({
        code: 'code',
        provider: 'google',
      });

      // Assert
      expect(result.token).toBe(expectedToken);
    });
  });

  describe('synthetic password for OAuth users', () => {
    it('should create OAuth user with synthetic password containing provider and id', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'unique_oauth_id_123',
        email: 'test@gmail.com',
        name: 'OAuth User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(null);

      let savedUser: User | undefined;
      userRepository.save.mockImplementation((user: User) => {
        savedUser = user;
        return Promise.resolve(user);
      });

      authTokenGenerator.generate.mockResolvedValue('token');

      // Act
      await useCase.execute({
        code: 'code',
        provider: 'google',
      });

      // Assert
      expect(savedUser).toBeDefined();
      // Password should be hashed, so we can't directly compare
      expect(savedUser?.getPassword()).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should propagate OAuth provider errors', async () => {
      // Arrange
      googleOAuthProvider.getProfile.mockRejectedValue(
        new Error('OAuth request failed'),
      );

      // Act & Assert
      await expect(
        useCase.execute({
          code: 'invalid_code',
          provider: 'google',
        }),
      ).rejects.toThrow('OAuth request failed');
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'oauth_id',
        email: 'test@gmail.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockRejectedValue(
        new Error('Database connection error'),
      );

      // Act & Assert
      await expect(
        useCase.execute({
          code: 'code',
          provider: 'google',
        }),
      ).rejects.toThrow('Database connection error');
    });

    it('should propagate token generation errors', async () => {
      // Arrange
      const mockProfile: OAuthProfile = {
        id: 'oauth_id',
        email: 'test@gmail.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      const expectedUser = await User.create({
        name: mockProfile.name,
        email: mockProfile.email,
        password: 'oauth_password',
      });

      googleOAuthProvider.getProfile.mockResolvedValue(mockProfile);
      userRepository.findByEmail.mockResolvedValue(expectedUser);
      authTokenGenerator.generate.mockRejectedValue(
        new Error('Token generation failed'),
      );

      // Act & Assert
      await expect(
        useCase.execute({
          code: 'code',
          provider: 'google',
        }),
      ).rejects.toThrow('Token generation failed');
    });
  });

  describe('multiple OAuth login flows', () => {
    it('should handle sequential logins with different providers', async () => {
      // Arrange
      const googleProfile: OAuthProfile = {
        id: 'google_id',
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'avatar.jpg',
        provider: 'google',
      };

      const garminProfile: OAuthProfile = {
        id: 'garmin_id',
        email: 'user@garmin.com',
        name: 'Garmin User',
        avatar: 'avatar.jpg',
        provider: 'garmin',
      };

      const googleUser = await User.create({
        name: googleProfile.name,
        email: googleProfile.email,
        password: 'oauth_password_google',
      });

      const garminUser = await User.create({
        name: garminProfile.name,
        email: garminProfile.email,
        password: 'oauth_password_garmin',
      });

      googleOAuthProvider.getProfile.mockResolvedValue(googleProfile);
      garminOAuthProvider.getProfile.mockResolvedValue(garminProfile);

      userRepository.findByEmail.mockImplementation((email: string) => {
        if (email === googleProfile.email) return Promise.resolve(googleUser);
        if (email === garminProfile.email) return Promise.resolve(garminUser);
        return Promise.resolve(null);
      });

      authTokenGenerator.generate.mockResolvedValue('token');

      // Act
      const googleResult = await useCase.execute({
        code: 'google_code',
        provider: 'google',
      });

      const garminResult = await useCase.execute({
        code: 'garmin_code',
        provider: 'garmin',
      });

      // Assert
      expect(googleResult.token).toBe('token');
      expect(garminResult.token).toBe('token');
      expect(googleOAuthProvider.getProfile).toHaveBeenCalled();
      expect(garminOAuthProvider.getProfile).toHaveBeenCalled();
    });
  });
});
