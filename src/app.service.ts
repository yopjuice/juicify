import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './i18n/generated/i18n.generated';

@Injectable()
export class AppService {
   constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  getHello(): string {
    return this.i18n.t('test.HELLO', { lang: I18nContext.current()?.lang })
  }
}
