import { UserFixture, UserRole } from '../@types';
import { initCodes } from '../constants';

const erlan: UserFixture = {
  username: 'erlan',
  email: 'admin@exmple.com',
  avatarPath: '',
  role: UserRole.superAdmin,
  data: {},
  rt: '',
  confirmed: true,
  confirmAttempts: 999,
  codes: initCodes,
  productIds: [],
};

export const superAdminFixtures: Array<UserFixture> = [erlan];
