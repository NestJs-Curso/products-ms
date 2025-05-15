import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
    const totalItems = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalItems / (limit ?? 10));

    return {
      data: await this.product.findMany({
        where: {
          available: true,
        },
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

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);
    return product;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
