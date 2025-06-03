import { NextFunction, Request, Response } from 'express'; // Add this at the top
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from "express";
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import chalk from 'chalk';
import * as bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
// import { DatabaseInitService } from './database/database-init.service';

async function bootstrap() {

  // ✅ Explicitly specify that we're using Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(chalk.bgMagenta.white(`✅✅🧪✅✅ [${new Date().toISOString()}] ${req.method} ${req.url}`));
    next();
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


  // ✅ Add global validation
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Fix static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // ✅ Fix CORS
  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,

  });

  await app.listen(3000);
  console.log("✅ NestJS server running on http://localhost:3000");
}

bootstrap();
