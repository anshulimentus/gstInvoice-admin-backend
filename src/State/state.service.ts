import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { State } from "./entities/state.entity";
import { CreateStateDto } from "./dto/create-state.dto";

@Injectable()
export class StateService {
    constructor(
        @InjectRepository(State)
        private readonly stateRepository: Repository<State>,
    ) { }

    async getStates(): Promise<State[]> {
        return await this.stateRepository.find();
    }

    async getState(id: number): Promise<State> {
        const state = await this.stateRepository.findOne({ where: { id } }); // ✅ FIXED
        if (!state) {
            throw new NotFoundException(`State with id ${id} not found`);
        }
        return state;
    }

    async createState(dto: CreateStateDto): Promise<State> {
        const category = this.stateRepository.create(dto);
        return await this.stateRepository.save(category);
    }

    async updateState(id: number, name: string): Promise<State> {
        const state = await this.stateRepository.findOne({ where: { id } }); // ✅ FIXED
        if (!state) {
            throw new NotFoundException(`State with id ${id} not found`);
        }
        state.name = name;
        return await this.stateRepository.save(state);
    }

    async deleteState(id: number): Promise<void> {
        const state = await this.stateRepository.findOne({ where: { id } }); // ✅ FIXED
        if (!state) {
            throw new NotFoundException(`State with id ${id} not found`);
        }
        try {
            await this.stateRepository.remove(state);
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting state with id ${id}`);
        }
    }
}
