import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import InvestModal from '../components/InvestModal';

const Marketplace = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // FIX 1: Define the missing state variable
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FIX 2: Fetch Projects AND Wallet together
        const [projectsRes, walletRes] = await Promise.all([
           api.get('/projects'),
           api.get('/wallet')
        ]);
        
        setProjects(projectsRes.data);
        setWallet(walletRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FIX 3: Update handler to actually open the modal
  const handleInvestClick = (project) => {
    setSelectedProject(project);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Farm Opportunities</h1>
          </div>
          
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search farms..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
               <Filter size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onInvest={handleInvestClick} 
              />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
           <div className="text-center py-20 text-gray-500">
             No farms found matching your search.
           </div>
        )}
      </main>
      
      {/* Modal - Now this will work because selectedProject is defined */}
      <InvestModal 
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        walletBalance={wallet.balance}
      />
    </div>
  );
};

export default Marketplace;