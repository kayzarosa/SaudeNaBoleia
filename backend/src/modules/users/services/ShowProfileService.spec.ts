import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      cpf: 11111111111,
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const updateUser = await showProfile.execute({
      user_id: user.id,
    });

    expect(updateUser.name).toBe('Jonh Doe');
    expect(updateUser.email).toBe('jonhdoe@gmail.com');
  });

  it('must not find the user informed', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
