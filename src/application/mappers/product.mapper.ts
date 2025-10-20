import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto, ProductQueryDto } from '../dto/product';
import { ProductQueryFilters } from '../../domain/repositories/product.repository';

export class ProductMapper {
  // DTO → Entidad
  static toDomain(dto: CreateProductDto, id: string): Product {
    return Product.create(
      id,
      dto.storeId,
      dto.sku,
      dto.name,
      dto.purchasePrice,
      dto.salePrice,
      dto.minimumStock || 5,
      dto.unitOfMeasure || 'UNIT' as any,
      dto.description,
      dto.categoryId,
      dto.brandId,
      dto.imageUrl
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      storeId: product.storeId,
      sku: product.sku,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      maximumStock: product.maximumStock,
      unitOfMeasure: product.unitOfMeasure,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryId: product.categoryId,
      brandId: product.brandId,
    };
  }

  // Aplicar actualizaciones a entidad existente
  static toUpdateDomain(dto: UpdateProductDto, existingProduct: Product): Product {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.name !== undefined) {
      existingProduct.updateName(dto.name);
    }
    if (dto.description !== undefined) {
      existingProduct.updateDescription(dto.description);
    }
    if (dto.purchasePrice !== undefined) {
      existingProduct.updatePurchasePrice(dto.purchasePrice);
    }
    if (dto.salePrice !== undefined) {
      existingProduct.updateSalePrice(dto.salePrice);
    }
    if (dto.minimumStock !== undefined) {
      existingProduct.updateMinimumStock(dto.minimumStock);
    }
    if (dto.maximumStock !== undefined) {
      existingProduct.updateMaximumStock(dto.maximumStock);
    }
    if (dto.unitOfMeasure !== undefined) {
      existingProduct.updateUnitOfMeasure(dto.unitOfMeasure);
    }
    if (dto.imageUrl !== undefined) {
      existingProduct.updateImageUrl(dto.imageUrl);
    }
    if (dto.categoryId !== undefined) {
      existingProduct.updateCategory(dto.categoryId);
    }
    if (dto.brandId !== undefined) {
      existingProduct.updateBrand(dto.brandId);
    }
    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        existingProduct.activate();
      } else {
        existingProduct.deactivate();
      }
    }

    return existingProduct;
  }

  // DTO de query → Filtros del repositorio
  static toQueryFilters(query: ProductQueryDto): ProductQueryFilters {
    const filters: ProductQueryFilters = {};

    if (query.storeId) {
      filters.storeId = query.storeId;
    }
    if (query.categoryId) {
      filters.categoryId = query.categoryId;
    }
    if (query.brandId) {
      filters.brandId = query.brandId;
    }
    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }
    if (query.search) {
      filters.search = query.search;
    }
    if (query.lowStock !== undefined) {
      filters.lowStock = query.lowStock;
    }
    if (query.outOfStock !== undefined) {
      filters.outOfStock = query.outOfStock;
    }
    if (query.page) {
      filters.page = query.page;
    }
    if (query.limit) {
      filters.limit = query.limit;
    }
    if (query.sortBy) {
      filters.sortBy = query.sortBy;
    }
    if (query.sortOrder) {
      filters.sortOrder = query.sortOrder;
    }

    // Calcular offset si se proporciona page y limit
    if (query.page && query.limit) {
      filters.offset = (query.page - 1) * query.limit;
    }

    return filters;
  }

  // Validar DTO de actualización
  static validateUpdateDto(dto: UpdateProductDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateProductDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
