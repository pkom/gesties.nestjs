import { Module, Global } from '@nestjs/common';

import { AutomapperModule } from 'nestjsx-automapper';

@Global()
@Module({
  imports: [AutomapperModule.withMapper()],
})
export class MapperModule {}
