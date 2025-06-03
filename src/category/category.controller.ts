import {Controller, Get, Post, Body } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async createCategory(@Body() dto: CreateCategoryDto) {
        return await this.categoryService.createCategory(dto);
    }

    @Get()
    async getCategories() {
        return await this.categoryService.getCategories();
    }

    @Get(':id')
    async getCategory(id: number) {
        return await this.categoryService.getCategory(id);
    }
}