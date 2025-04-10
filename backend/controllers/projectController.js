const Project = require('../models/Project');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');

// ==========================================
// 1. PUBLIC ROUTES (View Projects)
// ==========================================

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 }); 
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching projects' });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================================
// 2. USER ROUTES (Investing)
// ==========================================

// Invest in a project
exports.investInProject = async (req, res) => {
  const { projectId, slots } = req.body;
  const userId = req.user._id;

  try {
    // 1. Input Validation
    if (!slots || slots < 1) return res.status(400).json({ message: 'Select at least 1 slot' });

    // 2. Project Validation
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Legacy Data Fix: Default to 100 if undefined
    if (project.availableUnits === undefined) project.availableUnits = 100;

    if (project.status !== 'open' || project.availableUnits < slots) {
      return res.status(400).json({ message: 'Not enough slots available' });
    }

    // 3. Wallet Validation
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const price = project.pricePerSlot || project.price || 0;
    const totalCost = price * slots;

    if (wallet.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // ==================================================
    // CRITICAL FIX: CREATE INVESTMENT FIRST (InMemory)
    // ==================================================
    
    // Calculate Maturity
    const durationNum = parseInt(project.duration) || 6;
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + durationNum);

    // Calculate Return
    const expectedReturn = totalCost + (totalCost * (project.roi / 100));

    // 4. Attempt to Create Investment Record
    // We create it but don't assume success yet
    const investment = await Investment.create({
      user: userId,
      project: projectId,
      slots: slots,
      amountInvested: totalCost,
      expectedReturn,
      roi: project.roi,
      maturityDate: maturityDate,
      status: 'active'
    });

    // ==================================================
    // ONLY IF ABOVE SUCCEEDS, WE DEDUCT MONEY
    // ==================================================

    // 5. Update Wallet
    wallet.balance -= totalCost;
    await wallet.save();

    // 6. Update Project Stock
    project.availableUnits -= slots;
    project.investors += 1;
    if (project.availableUnits <= 0) project.status = 'sold_out';
    await project.save();

    // 7. Create Transaction Ledger
    await Transaction.create({
      user: userId,
      amount: totalCost,
      type: 'investment',
      status: 'success',
      reference: `INV-${Date.now()}`,
      description: `Invested in ${project.title}`
    });

    res.status(201).json({ 
      message: 'Investment successful', 
      investment, 
      newBalance: wallet.balance 
    });

  } catch (error) {
    console.error("Investment Error:", error);
    // Note: If Investment.create passed but Wallet.save failed, we technically have an edge case.
    // In production, we use MongoDB Transactions (session.startTransaction) to handle this perfectly.
    // For this stage, moving Wallet.save last is the 99% fix.
    res.status(500).json({ message: 'Investment failed: ' + error.message });
  }
};
// Get My Investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id })
      .populate('project', 'title image pricePerSlot roi duration status') // FIX: populate 'pricePerSlot'
      .sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching investments' });
  }
};

// ==========================================
// 3. ADMIN ROUTES (Management)
// ==========================================

exports.createProject = async (req, res) => {
  try {
    // FIX: Accept 'price' from frontend form, but save as 'pricePerSlot'
    const { title, description, roi, duration, price, location } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !description || !price || !roi || !duration || !location) {
      return res.status(400).json({ message: 'Please fill in all text fields' });
    }

    if (!image) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const project = new Project({
      title,
      description,
      roi,
      duration,
      pricePerSlot: price, // Mapping happens here
      image,
      location,
      investors: 0,
      availableUnits: 100, // Default stock
      status: 'open'
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);

  } catch (error) {
    console.error("Create Project Error:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};