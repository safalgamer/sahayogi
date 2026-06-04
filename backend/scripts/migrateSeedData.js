const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const { seedProducts } = require('../data/seedData');

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI configured. Skipping migration.');
    process.exit(0);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let inserted = 0, updated = 0;

  for (const seed of seedProducts) {
    const { _id, createdAt, lastUpdated, ...productData } = seed;

    if (!productData.eligibilityCriteria.loanPurposes) {
      productData.eligibilityCriteria.loanPurposes = [];
    }
    if (productData.eligibilityCriteria.minEmployeeCount === undefined) {
      productData.eligibilityCriteria.minEmployeeCount = 0;
    }

    const result = await Product.findOneAndUpdate(
      { name: productData.name, provider: productData.provider },
      { $set: { ...productData, isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (result.createdAt.getTime() === result.updatedAt.getTime()) inserted++;
    else updated++;
  }

  console.log(`Migration complete: ${inserted} inserted, ${updated} updated`);

  const count = await Product.countDocuments({ isActive: true });
  console.log(`Total active products: ${count}`);

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
