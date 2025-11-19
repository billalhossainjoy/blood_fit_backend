import { SetMetadata } from '@nestjs/common';

export const IS_VERIFIED = 'isVerified';
export const UnVerified = () => {
  return SetMetadata(IS_VERIFIED, true);
};
