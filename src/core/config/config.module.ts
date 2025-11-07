import { Module } from '@nestjs/common';
import { ConfigModule as GlobalConfigModule } from '@nestjs/config';
import { ConfigValidateEnv } from './config.schema';

@Module({
  imports: [
    GlobalConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidateEnv,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigModule {}
