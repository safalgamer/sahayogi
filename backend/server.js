const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many auth attempts, please try again later' },
});

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use('/api/', limiter);

let products = [];

app.get('/', (req, res) => {
  res.json({
    app: 'Sahayogi SME Finance Navigator',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/eligibility/check',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'POST /api/auth/refresh',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password/:token',
      'PUT /api/auth/change-password',
      'GET /api/guide',
      'GET /api/guide/:type',
    ],
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const Product = require('./models/Product');
    let dbStatus = 'disconnected';
    let productCount = products.length;
    if (require('./config/database').isConnected()) {
      dbStatus = 'connected';
      productCount = await Product.countDocuments({ isActive: true });
    }
    res.json({
      status: 'ok',
      message: 'Sahayogi API is running',
      version: '1.0.0',
      database: dbStatus,
      productsCount: productCount,
    });
  } catch (err) {
    res.json({ status: 'ok', message: 'Sahayogi API is running', version: '1.0.0', database: 'error' });
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const { providerType, loanType } = req.query;
    const Product = require('./models/Product');
    if (require('./config/database').isConnected()) {
      let query = { isActive: true };
      if (providerType) query.providerType = providerType;
      if (loanType) query.loanType = loanType;
      const dbProducts = await Product.find(query).sort({ name: 1 });
      return res.json(dbProducts);
    }
    let filtered = [...products];
    if (providerType) filtered = filtered.filter(p => p.providerType === providerType);
    if (loanType) filtered = filtered.filter(p => p.loanType === loanType);
    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

app.get('/api/products/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const Product = require('./models/Product');
    if (require('./config/database').isConnected()) {
      const results = await Product.find(
        { $text: { $search: q }, isActive: true },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).limit(20);
      return res.json(results);
    }
    const term = q.toLowerCase();
    const results = products.filter(p =>
      p.isActive !== false && (
        p.name.toLowerCase().includes(term) ||
        p.provider.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      )
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const Product = require('./models/Product');
    if (require('./config/database').isConnected()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
    const product = products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

app.post('/api/eligibility/check', async (req, res, next) => {
  try {
    const { businessType, establishedYear, monthlyRevenue, employeeCount = 0, loanAmount, loanPurpose = 'working_capital', hasCollateral = false, previousLoan = false } = req.body;
    const yearsInBusiness = new Date().getFullYear() - parseInt(establishedYear);

    const Product = require('./models/Product');
    let productsToScore;
    if (require('./config/database').isConnected()) {
      productsToScore = await Product.find({ isActive: true });
    } else {
      productsToScore = products;
    }

    const results = productsToScore.map(product => {
      let matchScore = 50;
      const reasons = [];
      const breakdown = {};

      const criteria = product.eligibilityCriteria || {};

      if (yearsInBusiness >= (criteria.minYearsInBusiness || 0)) {
        matchScore += 10;
        breakdown.businessAge = 10;
      } else {
        matchScore -= 15;
        breakdown.businessAge = -15;
        reasons.push('Business age below minimum requirement');
      }

      if (monthlyRevenue >= (criteria.minMonthlyRevenue || 0)) {
        matchScore += 10;
        breakdown.revenue = 10;
      } else {
        matchScore -= 10;
        breakdown.revenue = -10;
        reasons.push('Monthly revenue below minimum requirement');
      }

      const businessTypes = criteria.businessTypes || [];
      if (businessTypes.length === 0 || businessTypes.includes(businessType)) {
        matchScore += 10;
        breakdown.businessType = 10;
      } else {
        matchScore -= 10;
        breakdown.businessType = -10;
        reasons.push('Business type not supported');
      }

      if (loanAmount >= product.minAmount && loanAmount <= product.maxAmount) {
        matchScore += 15;
        breakdown.loanAmount = 15;
      } else if (loanAmount < product.minAmount) {
        matchScore -= 5;
        breakdown.loanAmount = -5;
        reasons.push('Loan amount below minimum');
      } else {
        matchScore -= 5;
        breakdown.loanAmount = -5;
        reasons.push('Loan amount exceeds maximum');
      }

      if (product.collateralRequired && !hasCollateral) {
        matchScore -= 10;
        breakdown.collateral = -10;
        reasons.push('Collateral required');
      } else if (!product.collateralRequired) {
        matchScore += 5;
        breakdown.collateral = 5;
      } else {
        breakdown.collateral = 0;
      }

      const allowedPurposes = criteria.loanPurposes || [];
      if (allowedPurposes.length === 0 || allowedPurposes.includes(loanPurpose)) {
        matchScore += 5;
        breakdown.loanPurpose = 5;
      } else {
        matchScore -= 5;
        breakdown.loanPurpose = -5;
        reasons.push('Loan purpose not supported');
      }

      const minEmployees = criteria.minEmployeeCount || 0;
      if (employeeCount >= minEmployees) {
        const empBonus = Math.min(Math.max(parseInt(employeeCount) || 0, 0), 10);
        matchScore += empBonus;
        breakdown.employeeCount = empBonus;
      } else {
        breakdown.employeeCount = 0;
      }

      if (previousLoan) {
        matchScore += 5;
        breakdown.previousLoan = 5;
      } else {
        breakdown.previousLoan = 0;
      }

      const provinces = criteria.provinces || [];
      if (req.body.province && provinces.length > 0 && !provinces.includes(req.body.province)) {
        matchScore -= 5;
        breakdown.province = -5;
        reasons.push('Product not available in your province');
      } else {
        breakdown.province = 0;
      }

      matchScore = Math.max(0, Math.min(100, matchScore));

      return {
        productId: product._id || product._id?.toString(),
        productName: product.name,
        provider: product.provider,
        providerType: product.providerType,
        matchScore,
        estimatedAmount: Math.min(loanAmount, product.maxAmount),
        estimatedRate: `${product.interestRateMin}% - ${product.interestRateMax}%`,
        breakdown,
        reasoning: reasons.length > 0 ? reasons.join('; ') : 'Good match for your profile',
      };
    });

    const sortedResults = results.sort((a, b) => b.matchScore - a.matchScore);
    const topResults = sortedResults.slice(0, 10);

    const EligibilityCheck = require('./models/EligibilityCheck');
    if (require('./config/database').isConnected() && req.user) {
      await EligibilityCheck.create({
        user: req.user._id,
        inputData: { businessType, establishedYear, monthlyRevenue, employeeCount, loanAmount, loanPurpose, hasCollateral, previousLoan, province: req.body.province },
        results: topResults,
        topMatch: topResults[0]?.productName || 'none',
        totalProductsScored: sortedResults.length,
        ipAddress: req.ip,
      });
    }

    res.json({
      totalProductsFound: sortedResults.length,
      recommendations: topResults.filter(r => r.matchScore >= 60),
      partialMatches: topResults.filter(r => r.matchScore >= 30 && r.matchScore < 60),
      lowMatches: topResults.filter(r => r.matchScore < 30),
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/guide', (req, res) => {
  res.json({ guides: ['loan-checklist', 'government-schemes', 'financial-tips'] });
});

app.get('/api/guide/:type', (req, res) => {
  const guides = {
    'loan-checklist': {
      title: 'Loan Application Checklist',
      content: [
        'Business registration certificate (Company / PAN)',
        'Tax clearance certificate (last 2 years minimum)',
        'Audited financial statements (P&L, Balance Sheet)',
        'Bank statements (last 6-12 months)',
        'Business proposal / project report',
        'Personal guarantee documents',
        'Collateral documents (property title deed, valuation)',
        'Partnership deed / MOA (if applicable)',
        'Citizenship certificate of owner(s)',
        'Proof of business address (rent agreement or utility bill)',
      ],
    },
    'government-schemes': {
      title: 'Government SME Financing Schemes',
      content: [
        { name: 'SME Development Bank Loan', desc: 'Subsidized loans at 6-8% for registered SMEs', eligibility: 'Business registered for at least 2 years, annual turnover up to NPR 50M' },
        { name: 'Startup Enterprise Credit (2024)', desc: 'Subsidized loans under Industrial Enterprise Regulation', eligibility: 'Registered startups with innovative business model' },
        { name: 'Youth Self-Employment Program', desc: 'Loans for entrepreneurs aged 18-40', eligibility: 'Nepali citizens aged 18-40 with viable business plan' },
      ],
    },
    'financial-tips': {
      title: 'Tips to Improve Loan Approval',
      content: [
        'Maintain separate business and personal bank accounts',
        'Keep accurate and up-to-date financial records',
        'File your taxes on time every year',
        'Maintain a good credit score by paying loans on time',
        'Prepare a clear business plan explaining loan utilization',
        'Build savings for at least 3 months of operating expenses',
        'Start with smaller loans to build banking relationship',
        'Consider microfinance as a stepping stone to formal banking',
      ],
    },
  };
  const guide = guides[req.params.type];
  if (!guide) return res.status(404).json({ message: 'Guide not found' });
  res.json(guide);
});

app.use('/api/auth', authLimiter, authRoutes);

app.use(errorHandler);

const { seedProducts } = require('./data/seedData');
products = [...seedProducts];

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sahayogi server running on port ${PORT}`);
  console.log(`Products loaded: ${products.length}`);
});

app.get('/api/debug/seed', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const { seedProducts } = require('./data/seedData');
    let existing = await Product.countDocuments();
    if (existing > 0) return res.json({ message: 'Already seeded', count: existing });
    let seeded = 0, errors = [];
    for (const seed of seedProducts) {
      try {
        const { _id, createdAt, lastUpdated, ...data } = seed;
        await Product.create(data);
        seeded++;
      } catch (e) {
        errors.push({ name: seed.name, error: e.message });
      }
    }
    return res.json({ message: 'Seeding done', seeded, errors, total: seedProducts.length });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
});

connectDB().then(async connected => {
  if (connected) {
    try {
      const Product = require('./models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        const { seedProducts } = require('./data/seedData');
        await Product.insertMany(
          seedProducts.map(({ _id, createdAt, lastUpdated, ...data }) => data)
        );
        console.log(`Seeded ${seedProducts.length} products into MongoDB`);
      }
    } catch (err) {
      console.log('Auto-seed skipped:', err.message);
    }
  }
  console.log(`Database: ${connected ? 'MongoDB' : 'In-memory'}`);
});
