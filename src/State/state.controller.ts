import { Controller, Get, Post, Body } from "@nestjs/common";
import { StateService } from "./state.service";
import { CreateStateDto } from "./dto/create-state.dto";

@Controller('state')
export class StateController {
    constructor(private readonly stateService: StateService) { }

    @Post()
    async createState(@Body() dto: CreateStateDto) {
        return await this.stateService.createState(dto);
    }


    @Get()
    async getStates() {
        return await this.stateService.getStates();
    }

    @Get(':id')
    async getState(id: number) {
        return await this.stateService.getState(id);
    }
}