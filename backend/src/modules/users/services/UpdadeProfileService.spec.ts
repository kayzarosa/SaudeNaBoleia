import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdadeProfileService from './UpdadeProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updadeProfile: UpdadeProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updadeProfile = new UpdadeProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const updateUser = await updadeProfile.execute({
      user_id: user.id,
      name: 'Jonh Trê',
      email: 'jonhtre@gmail.com',
    });

    expect(updateUser.name).toBe('Jonh Trê');
    expect(updateUser.email).toBe('jonhtre@gmail.com');
  });

  it('must not find the user informed', async () => {
    await expect(
      updadeProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Jonh Trê',
        email: 'jonhtre@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      cpf: 11111111111,
      email: 'test@gmail.com',
      password: '123456',
    });

    await expect(
      updadeProfile.execute({
        user_id: user.id,
        name: 'Jonh Trê',
        email: 'jonhdoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const updateUser = await updadeProfile.execute({
      user_id: user.id,
      name: 'Jonh Trê',
      email: 'jonhtre@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    await expect(
      updadeProfile.execute({
        user_id: user.id,
        name: 'Jonh Trê',
        email: 'jonhtre@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    await expect(
      updadeProfile.execute({
        user_id: user.id,
        name: 'Jonh Trê',
        email: 'jonhtre@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
