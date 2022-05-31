import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';

new App({
  imports: [new FrameworkModule()],
}).run();
