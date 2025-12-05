import React, { useState } from 'react';
import { PlusCircle, Save,LayoutGrid, Loader2 } from 'lucide-react';
import API_ADMIN_MOVIE_THEATER from '../../../api/Admin/api.admin.movie.theater';
import { useEffect } from 'react';

export default function TheaterForm({ onCreated, initialData }) {
    const [formData, setFormData] = useState({
        iName: '',
        iAddress: '',
        iHallCount: 1,
        layoutType: 'standard'
    });

    
    const [loading, setLoading] = useState(false);

    const layoutOptions = [
        { id: 'standard', name: 'Standard Room', rows: 10, cols: 10, capacity: 100 },
        { id: 'large', name: 'Grand Hall (VIP)', rows: 10, cols: 15, capacity: 150 },
    ];

    useEffect(() => {
        if(initialData){
            setFormData({
                iName: initialData.name,
                iAddress: initialData.address,
                iHallCount: initialData.hallCount,
                layoutType: 'standard'
            })
        } else {
            setFormData({
                iName: '',
                iAddress: '',
                iHallCount: 1,
                layoutType: 'standard'
            })
        }
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedLayout = layoutOptions.find(l => l.id === formData.layoutType);
            
            if(initialData){
                const playLoadEdit = {
                    iName: formData.iName,
                    iAddress: formData.iAddress
                }

                await API_ADMIN_MOVIE_THEATER.put(`/edit/${initialData._id}`, playLoadEdit)
                alert("✅ Updated successfully!")
            } else {
                const payload = {
                    iName: formData.iName,
                    iAddress: formData.iAddress,
                    iHallCount: formData.iHallCount,
                    rowLayout: selectedLayout.rows,
                    colLayout: selectedLayout.cols
                };

                await API_ADMIN_MOVIE_THEATER.post('/create_theater', payload);
                alert("✅ Created successfully!");

            }
            
            if (onCreated) onCreated();

            if (!initialData) {
                setFormData({ iName: '', iAddress: '', iHallCount: 1, layoutType: 'standard' });
            }
        } catch (error) {
            alert("❌ Failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all";

    const isEditMode = !!initialData;

    return (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-500/20 rounded-full text-rose-500">
                    { isEditMode ? <Save size={24}/> : <PlusCircle size={24} />}
                </div>
                <h2 className="text-xl font-bold text-white">
                    {isEditMode ? `Edit mode: ${initialData.name}` : "Create New Theater"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        className="text-gray-400 text-sm mb-1 block"
                    >
                        Theater Name
                    </label>

                    <input 
                        type="text" 
                        placeholder="e.g. CGV Aeon Mall" 
                        className={inputClass}
                        value={formData.iName} 
                        onChange={e => setFormData({...formData, iName: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Address</label>
                    <input 
                        type="text" placeholder="e.g. 123 Street, Dist 1" className={inputClass}
                        value={formData.iAddress} onChange={e => setFormData({...formData, iAddress: e.target.value})}
                        required
                    />
                </div>

            {/* Responsive Grid: 1 cột mobile, 2 cột desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    {/* Khoá lại khi ở chế độ edit */}
                        <label className="text-gray-400 text-sm mb-1 block">
                            Total Halls { isEditMode && <span className='text-xs text-rose-500'>
                                (Looked)
                            </span>}
                        </label>
                        <input 
                        type="number" min="1" max="20" className={inputClass}
                        value={formData.iHallCount} onChange={e => setFormData({...formData, iHallCount: e.target.value})}
                        required
                        disabled={isEditMode}
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Room Layout</label>
                        <select 
                        className={inputClass}
                        value={formData.layoutType} onChange={e => setFormData({...formData, layoutType: e.target.value})}
                        disabled={isEditMode}
                        >
                        {layoutOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.rows}x{opt.cols} ({opt.capacity} seats)</option>
                        ))}
                        </select>
                    </div>
                </div>

                {!isEditMode && (
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 border-dashed flex items-center gap-3 text-sm text-gray-400">
                        <LayoutGrid size={16} />
                        <span>Selected: {layoutOptions.find(l => l.id === formData.layoutType)?.name}</span>
                    </div>
                )}

                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 border-dashed flex items-center gap-3 text-sm text-gray-400">
                    <LayoutGrid size={16} />
                    <span>Selected: {layoutOptions.find(l => l.id === formData.layoutType).name}</span>
                </div>

                <button 
                type="submit" disabled={loading}
                className={`w-full mt-4 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                    ${isEditMode 
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' 
                        : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:shadow-rose-900/40'}`
                }
                >
                {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isEditMode ? 'Save Changes' : 'Create System')}
                </button>
            </form>
        </div>
    );
}
