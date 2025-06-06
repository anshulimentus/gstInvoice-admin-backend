import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async getCategories(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async getCategory(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`State with id ${id} not found`);
        }
        return category;
    }

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(dto);
        return await this.categoryRepository.save(category);
    }
}

