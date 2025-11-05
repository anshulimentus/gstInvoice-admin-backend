import { DataSource } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const categories = [
  'Sole Proprietorship',
  'Partnership Firm',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
  'Private Limited Company (Pvt. Ltd.)',
  'Public Limited Company',
  'Section 8 Company (Non-Profit Organization)',
  'Cooperative Society',
  'Joint Venture',
  'Subsidiary of a Foreign Company',
  'Producer Company',
  'Trust',
  'Society'
];

async function seedCategories() {
  // Import the AppDataSource from data-source.ts
  const { AppDataSource } = await import('../data-source');

  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Database connection established');

    const categoryRepository = AppDataSource.getRepository(Category);

    // Check if categories already exist
    const existingCount = await categoryRepository.count();
    if (existingCount > 0) {
      console.log(`Categories already exist (${existingCount} found). Skipping seed.`);
      return;
    }

    // Insert categories
    const categoryEntities = categories.map(name => ({ name }));
    await categoryRepository.save(categoryEntities);

    console.log(`Successfully seeded ${categories.length} categories:`);
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedCategories().catch(console.error);
