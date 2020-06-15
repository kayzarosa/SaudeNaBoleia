import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import ISotorageProvider from './models/ISotorageProvider';
import DisckStorageProvider from './implementations/DisckStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: DisckStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<ISotorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
