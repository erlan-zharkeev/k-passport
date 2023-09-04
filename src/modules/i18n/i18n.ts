import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

export const I18n = I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/'),
    watch: true,
  },
  typesOutputPath: 'src/modules/i18n/i18n.generated.ts',
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
  ],
});
