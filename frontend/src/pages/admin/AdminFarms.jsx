import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, X, UploadCloud, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminFarms = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', roi: '', duration: '', location: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects");
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!window.confirm("Publish this project?")) return;
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('roi', formData.roi);
    data.append('duration', formData.duration);
    data.append('location', formData.location);
    if(imageFile) data.append('image', imageFile);

    try {
      await api.post('/projects', data);
      alert('Project Created Successfully!');
      setShowForm(false);
      fetchProjects();
      // Reset
      setFormData({ title: '', description: '', price: '', roi: '', duration: '', location: '' });
      setImageFile(null);
    } catch (error) {
      alert('Failed to create project: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white">Farm Inventory</h1>
           <p className="text-gray-400">Manage your investment opportunities</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus size={20} className="mr-2"/> Add New Farm</>}
        </Button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 animate-in fade-in slide-in-from-top-4 relative">
          <button 
             onClick={() => setShowForm(false)}
             className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
             <X size={24} />
          </button>
          
          <h3 className="text-xl font-bold text-white mb-6">Create New Opportunity</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Cashew Export A" />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Oyo State" />
            
            <div className="grid grid-cols-2 gap-4">
               <Input label="ROI (%)" name="roi" type="number" value={formData.roi} onChange={handleChange} placeholder="25" />
               <Input label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="6 Months" />
            </div>
            
            <Input label="Price per Unit (₦)" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="50000" />
            
            <div className="md:col-span-2">
               <label className="block text-gray-400 text-sm font-bold mb-2">Project Image</label>
               <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-400">
                            {imageFile ? <span className="text-green-400 font-bold">{imageFile.name}</span> : "Click to upload image"}
                          </p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
               </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-1 block">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-24 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Details about the farm..."
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-2">
               <Button fullWidth type="submit" isLoading={loading}>Publish Project</Button>
            </div>
          </form>
        </div>
      )}

      {/* LIST OF FARMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all group">
            <div className="h-48 bg-gray-700 relative">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs text-white uppercase font-bold ${project.status === 'sold_out' ? 'bg-red-600' : 'bg-black/60'}`}>
                 {project.status.replace('_', ' ')}
               </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-1 truncate">{project.title}</h3>
              
              {/* STOCK LEVEL DISPLAY */}
              <div className="flex justify-between text-xs text-gray-400 mb-4 bg-gray-900 p-2 rounded-lg mt-2">
                 <span>Available Stock:</span>
                 <span className={project.availableUnits < 10 ? "text-red-400 font-bold" : "text-white font-bold"}>
                   {project.availableUnits !== undefined ? project.availableUnits : 100} Units
                 </span>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <MapPin size={14} className="mr-1" /> {project.location}
              </div>
              
              <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-4">
                <div>
                  <p className="text-gray-500 text-xs">Unit Price</p>
                  <p className="text-white font-bold">₦{(project.pricePerSlot || project.price || 0).toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-gray-500 text-xs">ROI</p>
                   <p className="text-green-400 font-bold">{project.roi}%</p>
                </div>
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                  title="Delete Farm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminFarms;