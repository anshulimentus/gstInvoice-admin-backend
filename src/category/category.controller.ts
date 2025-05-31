import {Controller, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getCategories() {
        return await this.categoryService.getCategories();
    }

    @Get(':id')
    async getCategory(id: number) {
        return await this.categoryService.getCategory(id);
    }
}