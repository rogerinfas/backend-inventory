import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { ProductRepository, ProductQueryFilters } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { UnitOfMeasure } from '../../domain/enums/unit-of-measure.enum';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productData) {
      return null;
    }

    return Product.fromPersistence(
      productData.id,
      productData.storeId,
      productData.sku,
      productData.name,
      productData.description,
      productData.purchasePrice,
      productData.salePrice,
      productData.currentStock,
      productData.reservedStock,
      productData.minimumStock,
      productData.maximumStock,
      productData.unitOfMeasure as UnitOfMeasure,
      productData.imageUrl,
      productData.isActive,
      productData.createdAt,
      productData.updatedAt,
      productData.categoryId,
      productData.brandId
    );
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!productData) {
      return null;
    }

    return Product.fromPersistence(
      productData.id,
      productData.storeId,
      productData.sku,
      productData.name,
      productData.description,
      productData.purchasePrice,
      productData.salePrice,
      productData.currentStock,
      productData.reservedStock,
      productData.minimumStock,
      productData.maximumStock,
      productData.unitOfMeasure as UnitOfMeasure,
      productData.imageUrl,
      productData.isActive,
      productData.createdAt,
      productData.updatedAt,
      productData.categoryId,
      productData.brandId
    );
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { storeId },
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { categoryId },
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async findByBrandId(brandId: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { brandId },
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async findMany(filters: ProductQueryFilters = {}): Promise<Product[]> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.lowStock) {
      where.currentStock = { lte: this.prisma.product.fields.minimumStock };
    }

    if (filters.outOfStock) {
      where.currentStock = 0;
    }

    const productsData = await this.prisma.product.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async findLowStockProducts(storeId?: string): Promise<Product[]> {
    const where: any = {
      isActive: true,
    };

    if (storeId) {
      where.storeId = storeId;
    }

    const productsData = await this.prisma.product.findMany({
      where: {
        ...where,
        currentStock: {
          lte: this.prisma.product.fields.minimumStock,
        },
      },
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async findOutOfStockProducts(storeId?: string): Promise<Product[]> {
    const where: any = {
      isActive: true,
      currentStock: 0,
    };

    if (storeId) {
      where.storeId = storeId;
    }

    const productsData = await this.prisma.product.findMany({
      where,
    });

    return productsData.map(productData =>
      Product.fromPersistence(
        productData.id,
        productData.storeId,
        productData.sku,
        productData.name,
        productData.description,
        productData.purchasePrice,
        productData.salePrice,
        productData.currentStock,
        productData.reservedStock,
        productData.minimumStock,
        productData.maximumStock,
        productData.unitOfMeasure as UnitOfMeasure,
        productData.imageUrl,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
        productData.categoryId,
        productData.brandId
      )
    );
  }

  async save(product: Product): Promise<Product> {
    const productData = await this.prisma.product.create({
      data: {
        id: product.id,
        storeId: product.storeId,
        sku: product.sku,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        currentStock: product.currentStock,
        reservedStock: product.reservedStock,
        minimumStock: product.minimumStock,
        maximumStock: product.maximumStock,
        unitOfMeasure: product.unitOfMeasure,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categoryId: product.categoryId,
        brandId: product.brandId,
      },
    });

    return Product.fromPersistence(
      productData.id,
      productData.storeId,
      productData.sku,
      productData.name,
      productData.description,
      productData.purchasePrice,
      productData.salePrice,
      productData.currentStock,
      productData.reservedStock,
      productData.minimumStock,
      productData.maximumStock,
      productData.unitOfMeasure as UnitOfMeasure,
      productData.imageUrl,
      productData.isActive,
      productData.createdAt,
      productData.updatedAt,
      productData.categoryId,
      productData.brandId
    );
  }

  async update(product: Product): Promise<Product> {
    const productData = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        currentStock: product.currentStock,
        reservedStock: product.reservedStock,
        minimumStock: product.minimumStock,
        maximumStock: product.maximumStock,
        unitOfMeasure: product.unitOfMeasure,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        updatedAt: product.updatedAt,
        categoryId: product.categoryId,
        brandId: product.brandId,
      },
    });

    return Product.fromPersistence(
      productData.id,
      productData.storeId,
      productData.sku,
      productData.name,
      productData.description,
      productData.purchasePrice,
      productData.salePrice,
      productData.currentStock,
      productData.reservedStock,
      productData.minimumStock,
      productData.maximumStock,
      productData.unitOfMeasure as UnitOfMeasure,
      productData.imageUrl,
      productData.isActive,
      productData.createdAt,
      productData.updatedAt,
      productData.categoryId,
      productData.brandId
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id },
    });
    return count > 0;
  }

  async existsBySku(sku: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { sku },
    });
    return count > 0;
  }

  async count(filters: ProductQueryFilters = {}): Promise<number> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.lowStock) {
      where.currentStock = { lte: this.prisma.product.fields.minimumStock };
    }

    if (filters.outOfStock) {
      where.currentStock = 0;
    }

    return this.prisma.product.count({ where });
  }

  async increaseStock(productId: string, quantity: number, storeId: string, tx?: any): Promise<Product> {
    const prisma = tx || this.prisma;

    // Validar que el producto pertenezca a la tienda indicada
    const productData = await prisma.product.findUnique({ where: { id: productId } });
    if (!productData || productData.storeId !== storeId) {
      throw new Error('Producto no encontrado en la tienda indicada');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        currentStock: { increment: quantity },
        updatedAt: new Date(),
      },
    });

    return Product.fromPersistence(
      updated.id,
      updated.storeId,
      updated.sku,
      updated.name,
      updated.description,
      updated.purchasePrice,
      updated.salePrice,
      updated.currentStock,
      updated.reservedStock,
      updated.minimumStock,
      updated.maximumStock,
      updated.unitOfMeasure as UnitOfMeasure,
      updated.imageUrl,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
      updated.categoryId,
      updated.brandId
    );
  }

  async setReservedStock(productId: string, reservedStock: number, storeId: string, tx?: any): Promise<Product> {
    const prisma = tx || this.prisma;

    const productData = await prisma.product.findUnique({ where: { id: productId } });
    if (!productData || productData.storeId !== storeId) {
      throw new Error('Producto no encontrado en la tienda indicada');
    }
    if (reservedStock < 0) {
      throw new Error('El incremento de reservedStock debe ser >= 0');
    }

    const newReserved = productData.reservedStock + reservedStock;
    if (newReserved > productData.currentStock) {
      throw new Error('El reservedStock no puede ser mayor que el currentStock');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        reservedStock: newReserved,
        updatedAt: new Date(),
      },
    });

    return Product.fromPersistence(
      updated.id,
      updated.storeId,
      updated.sku,
      updated.name,
      updated.description,
      updated.purchasePrice,
      updated.salePrice,
      updated.currentStock,
      updated.reservedStock,
      updated.minimumStock,
      updated.maximumStock,
      updated.unitOfMeasure as UnitOfMeasure,
      updated.imageUrl,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
      updated.categoryId,
      updated.brandId
    );
  }

  async decreaseStock(productId: string, quantity: number, storeId: string, tx?: any): Promise<Product> {
    const prisma = tx || this.prisma;
    
    // Verificar que el producto existe y pertenece a la tienda
    const productData = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });
    
    if (!productData) {
      throw new Error('Producto no encontrado en la tienda indicada');
    }
    
    if (quantity <= 0) {
      throw new Error('La cantidad a decrementar debe ser mayor a 0');
    }
    
    if (productData.currentStock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${productData.currentStock}, Solicitado: ${quantity}`);
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        currentStock: productData.currentStock - quantity,
        updatedAt: new Date(),
      },
    });

    return Product.fromPersistence(
      updated.id,
      updated.storeId,
      updated.sku,
      updated.name,
      updated.description,
      updated.purchasePrice,
      updated.salePrice,
      updated.currentStock,
      updated.reservedStock,
      updated.minimumStock,
      updated.maximumStock,
      updated.unitOfMeasure as UnitOfMeasure,
      updated.imageUrl,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
      updated.categoryId,
      updated.brandId
    );
  }

  async countProductsInStock(storeId: string | null): Promise<number> {
    const where: any = {
      currentStock: {
        gt: 0,
      },
      isActive: true,
    };

    if (storeId) {
      where.storeId = storeId;
    }

    return this.prisma.product.count({ where });
  }
}
