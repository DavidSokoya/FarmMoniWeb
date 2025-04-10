const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo Connected for Seeding'))
  .catch(err => console.log(err));

const projects = [
  {
    title: "Cashew Nut Export Cycle A",
    description: "Invest in the aggregation and export of raw cashew nuts to Vietnam. High demand season.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
    pricePerUnit: 25000,
    roi: 25,
    duration: "6 Months",
    location: "Ogbomosho, Oyo State",
    availableUnits: 450,
    totalUnits: 500,
    status: "open",
    startDate: new Date("2026-02-01"),
    maturityDate: new Date("2026-08-01")
  },
  {
    title: "Palm Oil Storage Fund",
    description: "Buy and store palm oil during peak production season and resell during scarcity.",
    image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800",
    pricePerUnit: 50000,
    roi: 30,
    duration: "9 Months",
    location: "Edo State",
    availableUnits: 120,
    totalUnits: 200,
    status: "open",
    startDate: new Date("2026-03-01"),
    maturityDate: new Date("2026-12-01")
  },
  {
    title: "Maize Farming Cluster",
    description: "Mechanized maize farming for animal feed production.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
    pricePerUnit: 15000,
    roi: 15,
    duration: "4 Months",
    location: "Kaduna",
    availableUnits: 0, // Sold out test
    totalUnits: 1000,
    status: "sold_out",
    startDate: new Date("2026-04-01"),
    maturityDate: new Date("2026-08-01")
  }
];

const importData = async () => {
  try {
    await Project.deleteMany(); // Clear old data
    await Project.insertMany(projects);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();