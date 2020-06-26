import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CentersService } from './centers.service';
import { CenterDTO } from './dto';

@Controller('center')
export class CentersController {
  constructor(private serv: CentersService) {}

  @Get()
  public async getAll(): Promise<CenterDTO[]> {
    return await this.serv.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public async post(@Body() dto: CenterDTO): Promise<CenterDTO> {
    return this.serv.create(dto);
  }
}
