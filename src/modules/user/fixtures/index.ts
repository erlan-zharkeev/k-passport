import { UserFixture, UserRole } from '../@types';
import { initCodes } from '../constants';

const erlan: UserFixture = {
  username: 'erlan',
  email: 'zharkeev.post@gmail.com',
  avatarPath: '',
  role: UserRole.superAdmin,
  data: {},
  rt: '',
  confirmed: true,
  confirmAttempts: 999,
  codes: initCodes,
};

const oleg: UserFixture = {
  username: 'oleg',
  email: 'oleg@gmail.com',
  avatarPath: '',
  role: UserRole.superAdmin,
  data: {},
  rt: '',
  confirmed: true,
  confirmAttempts: 999,
  codes: initCodes,
};

export const superAdminFixtures: Array<UserFixture> = [erlan, oleg];
