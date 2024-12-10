import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProyectosService {
  private readonly logger = new Logger(ProyectosService.name);

  constructor(
    @InjectRepository(Project)
    private readonly proyectosRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    this.logger.log(`📂 Creando un nuevo proyecto para el usuario: ${createProjectDto.user}`);

    if (!createProjectDto.user || !createProjectDto.name) {
      this.logger.error('❌ Usuario o nombre del proyecto no proporcionados.');
      throw new BadRequestException('Usuario o nombre del proyecto no válidos.');
    }

    const { name, description, user } = createProjectDto;

    const newProject = this.proyectosRepository.create({
      name,
      description,
      user: { username: user },
    });

    try {
      const savedProject = await this.proyectosRepository.save(newProject);
      this.logger.log(`✅ Proyecto creado exitosamente: ${savedProject.name} (ID: ${savedProject.id})`);
      return savedProject;
    } catch (error) {
      this.logger.error(`❌ Error al guardar el proyecto: ${error.message}`);
      throw new BadRequestException('No se pudo guardar el proyecto.');
    }
  }

  async findAll(username: string): Promise<Project[]> {
    this.logger.log(`🔍 Consultando todos los proyectos del usuario: ${username}`);

    try {
      const projects = await this.proyectosRepository.find({ where: { user: { username } } });

      if (projects.length === 0) {
        this.logger.warn(`⚠️ No se encontraron proyectos para el usuario: ${username}`);
      } else {
        this.logger.log(`✅ Proyectos encontrados: ${projects.length}`);
      }

      return projects;
    } catch (error) {
      this.logger.error(`❌ Error al consultar proyectos: ${error.message}`);
      throw new BadRequestException('No se pudieron recuperar los proyectos.');
    }
  }

  async update(username: string, id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    this.logger.log(`✏️ Intentando actualizar el proyecto con ID: ${id} para el usuario: ${username}`);

    const project = await this.proyectosRepository.findOne({ where: { id, user: { username } } });

    if (!project) {
      this.logger.error(`❌ Proyecto no encontrado: ID ${id} (Usuario: ${username})`);
      throw new NotFoundException('Proyecto no encontrado.');
    }

    try {
      Object.assign(project, updateProjectDto);
      const updatedProject = await this.proyectosRepository.save(project);
      this.logger.log(`✅ Proyecto actualizado exitosamente: ${updatedProject.name} (ID: ${updatedProject.id})`);
      return updatedProject;
    } catch (error) {
      this.logger.error(`❌ Error al actualizar el proyecto: ${error.message}`);
      throw new BadRequestException('No se pudo actualizar el proyecto.');
    }
  }

  async remove(username: string, id: number): Promise<{ message: string }> {
    this.logger.log(`🗑️ Intentando eliminar el proyecto con ID: ${id} para el usuario: ${username}`);

    const project = await this.proyectosRepository.findOne({ where: { id, user: { username } } });

    if (!project) {
      this.logger.error(`❌ Proyecto no encontrado: ID ${id} (Usuario: ${username})`);
      throw new NotFoundException('Proyecto no encontrado.');
    }

    try {
      await this.proyectosRepository.remove(project);
      this.logger.log(`✅ Proyecto eliminado exitosamente: ID ${id} (Usuario: ${username})`);
      return { message: 'Proyecto eliminado exitosamente.' };
    } catch (error) {
      this.logger.error(`❌ Error al eliminar el proyecto: ${error.message}`);
      throw new BadRequestException('No se pudo eliminar el proyecto.');
    }
  }
}
