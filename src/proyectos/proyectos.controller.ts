import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Req, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

@ApiTags('Proyectos')
@Controller('projects')
export class ProyectosController {
  private readonly logger = new Logger(ProyectosController.name);

  constructor(private readonly proyectosService: ProyectosService) {}

  @UseGuards(AuthGuard, new RolesGuard('admin'))
  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo proyecto' })
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto): Promise<Project> {
    if (!req.user || !req.user.username) {
      this.logger.error('❌ Usuario no autenticado intentó crear un proyecto.');
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    // Asignar usuario autenticado si no está explícito en el DTO
    if (!createProjectDto.user) {
      this.logger.log('ℹ️ Usuario autenticado asignado al proyecto.');
      createProjectDto.user = req.user.username;
    }

    try {
      const result = await this.proyectosService.create(createProjectDto);
      this.logger.log(`✅ Proyecto creado exitosamente: ${result.name}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Error al registrar el proyecto: ${error.message}`);
      throw new BadRequestException('No se pudo registrar el proyecto.');
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar proyectos del usuario autenticado' })
  async findAll(@Req() req): Promise<Project[]> {
    if (!req.user || !req.user.username) {
      this.logger.error('❌ Usuario no autenticado intentó listar proyectos.');
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    this.logger.log(`🔍 Listando proyectos para el usuario: ${req.user.username}`);
    return this.proyectosService.findAll(req.user.username);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    if (!req.user || !req.user.username) {
      this.logger.error('❌ Usuario no autenticado intentó actualizar un proyecto.');
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    this.logger.log(`✏️ Intentando actualizar el proyecto ID: ${id} por el usuario: ${req.user.username}`);
    return this.proyectosService.update(req.user.username, id, updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  async remove(@Req() req, @Param('id') id: number): Promise<{ message: string }> {
    if (!req.user || !req.user.username) {
      this.logger.error('❌ Usuario no autenticado intentó eliminar un proyecto.');
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    this.logger.log(`🗑️ Intentando eliminar el proyecto ID: ${id} por el usuario: ${req.user.username}`);
    return this.proyectosService.remove(req.user.username, id);
  }
}
