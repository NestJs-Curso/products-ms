import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
  //* Los mensajes de Error como los muestra por defaul NestJs.
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    void this.$connect();
    this.logger.log('Conected');
  }
  create(createProductoDto: CreateProductoDto) {
    return this.product.create({
      data: createProductoDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalItems = await this.product.count();
    const lastPage = Math.ceil(totalItems / (limit ?? 10));

    return {
      data: await this.product.findMany({
        skip: ((page ?? 1) - 1) * (limit ?? 10),
        take: limit,
      }),
      meta: {
        total: totalItems,
        current: page,
        last: lastPage,
      },
    };
  }

  async findOne(id: string) {
    const producto = await this.product.findFirst({
      where: { id: Number(id) },
    });
    return producto;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
