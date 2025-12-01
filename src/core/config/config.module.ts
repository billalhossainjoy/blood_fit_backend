import { Module } from '@nestjs/common';
import { ConfigModule as GlobalConfigModule } from '@nestjs/config';
import { ConfigValidateEnv } from './config.schema';
import appConfig from './app.config';

@Module({
  imports: [
    GlobalConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidateEnv,
    }),
    GlobalConfigModule.forFeature(appConfig),
  ],
  exports: [GlobalConfigModule],
})
export class ConfigModule {}
