


import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    HttpCode,
    ValidationPipe,
    ParseUUIDPipe,
    Res,
    UseGuards,
    
  } from '@nestjs/common';
  import { InvoiceService } from './invoice.service';
  import { CreateInvoiceDto } from './dto/create-invoice.dto';
  import { UpdateInvoiceDto } from './dto/update-invoice.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { Response } from 'express';
  import { RolesGuard } from "src/auth/roles.guard";
  import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
  import { Roles } from "src/auth/roles.decorator";
  import { Role } from "src/users/roles.enum";
  
  
  @ApiTags('invoices')
  @Controller('invoices')
  export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
  
 
    @Get()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.User)
    @ApiOperation({ summary: 'Get all invoices' })
    @ApiResponse({ status: 200, description: 'List of all invoices' })
    async findAll() {
      return await this.invoiceService.findAll();
    }
  
    @Get(':id')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.User)
    @ApiOperation({ summary: 'Get invoice by ID' })
    @ApiParam({ name: 'id', description: 'Invoice UUID' })
    @ApiResponse({ status: 200, description: 'Invoice found' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return await this.invoiceService.findOne(id);
    }




  
    @Get('invoice-number/:invoiceNo')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.User)
    @ApiOperation({ summary: 'Get invoice by invoice number' })
    @ApiParam({ name: 'invoiceNo', description: 'Invoice number' })
    @ApiResponse({ status: 200, description: 'Invoice found' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    async findByInvoiceNo(@Param('invoiceNo') invoiceNo: string) {
      return await this.invoiceService.findByInvoiceNo(invoiceNo);
    }
  
  


  }