import { Injectable, Inject } from '@nestjs/common';
import type { CategoryRepository } from '../../domain/repositories';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategoryQueryDto,
  ChangeCategoryStatusDto,
} from '../dto/category';
import {
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  GetCategoryByIdUseCase,
  ListCategoriesUseCase,
  ChangeCategoryStatusUseCase,
  DeleteCategoryUseCase,
  ListCategoriesResult,
} from '../use-cases/category';

@Injectable()
export class CategoryService {
  private readonly createCategoryUseCase: CreateCategoryUseCase;
  private readonly updateCategoryUseCase: UpdateCategoryUseCase;
  private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase;
  private readonly listCategoriesUseCase: ListCategoriesUseCase;
  private readonly changeCategoryStatusUseCase: ChangeCategoryStatusUseCase;
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase;

  constructor(@Inject('CategoryRepository') categoryRepository: CategoryRepository) {
    this.createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    this.updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
    this.getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
    this.listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
    this.changeCategoryStatusUseCase = new ChangeCategoryStatusUseCase(categoryRepository);
    this.deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.createCategoryUseCase.execute(dto);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return this.updateCategoryUseCase.execute(id, dto);
  }

  async getCategoryById(id: string): Promise<CategoryResponseDto | null> {
    return this.getCategoryByIdUseCase.execute(id);
  }

  async listCategories(query: CategoryQueryDto): Promise<ListCategoriesResult> {
    return this.listCategoriesUseCase.execute(query);
  }

  async changeCategoryStatus(id: string, dto: ChangeCategoryStatusDto): Promise<CategoryResponseDto> {
    return this.changeCategoryStatusUseCase.execute(id, dto);
  }

  async deleteCategory(id: string): Promise<CategoryResponseDto> {
    return this.deleteCategoryUseCase.execute(id);
  }
}
