// jest.config.ts
import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    setupFilesAfterEnv: ['./setupTests.ts'],
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  };
};
