
import React, { useState, useEffect, useCallback } from 'react';
import { generateDragAndDropItems } from '../services/geminiService';

type Category = 'House' | 'Senate' | 'Both';

interface DraggableItem {
    id: number;
    content: string;
    category: Category;
}

interface DragAndDropViewProps {
    onComplete: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

const DragAndDropView: React.FC<DragAndDropViewProps> = ({ onComplete }) => {
    const [items, setItems] = useState<DraggableItem[]>([]);
    const [unassignedItems, setUnassignedItems] = useState<DraggableItem[]>([]);
    const [columns, setColumns] = useState<Record<Category, DraggableItem[]>>({
        House: [],
        Senate: [],
        Both: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [draggingItem, setDraggingItem] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const generatedItems = await generateDragAndDropItems();
            const itemsWithIds = generatedItems.map((item, index) => ({ ...item, id: index }));
            setItems(itemsWithIds);
            setUnassignedItems(itemsWithIds);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggableItem) => {
        if(checked) return;
        setDraggingItem(item.id);
        e.dataTransfer.setData('text/plain', item.id.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: Category | 'unassigned') => {
        e.preventDefault();
        const itemId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const item = items.find(i => i.id === itemId);
        setDraggingItem(null);
        if (!item || checked) return;

        // Remove from all lists
        setUnassignedItems(prev => prev.filter(i => i.id !== itemId));
        setColumns(prev => ({
            House: prev.House.filter(i => i.id !== itemId),
            Senate: prev.Senate.filter(i => i.id !== itemId),
            Both: prev.Both.filter(i => i.id !== itemId),
        }));
        
        // Add to the new list
        if (targetCategory === 'unassigned') {
            setUnassignedItems(prev => [...prev, item]);
        } else {
            setColumns(prev => ({...prev, [targetCategory]: [...prev[targetCategory], item] }));
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleCheckAnswers = () => setChecked(true);

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-indigo-100"><LoadingSpinner /></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-600 font-bold text-xl">{error}</div>;

    const allItemsPlaced = unassignedItems.length === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Knowledge Check!</h1>
                    <p className="text-lg text-gray-600 mt-2">Drag each characteristic to the correct column. Are you ready for the final challenge?</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Unassigned Items */}
                    <div 
                        onDrop={(e) => handleDrop(e, 'unassigned')} 
                        onDragOver={handleDragOver}
                        className="lg:col-span-1 bg-gray-100/80 p-4 rounded-xl border-2 border-dashed border-gray-300 min-h-[200px]"
                    >
                         <h2 className="text-xl font-bold text-gray-700 text-center mb-4">Characteristics</h2>
                         <div className="space-y-3">
                             {unassignedItems.map(item => (
                                <div key={item.id} draggable={!checked} onDragStart={(e) => handleDragStart(e, item)}
                                 className={`p-3 bg-white rounded-lg shadow cursor-grab transition-opacity ${draggingItem === item.id ? 'opacity-50' : 'opacity-100'}`}>
                                    {item.content}
                                </div>
                            ))}
                         </div>
                    </div>
                    {/* Columns */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['House', 'Senate', 'Both'] as Category[]).map(category => (
                            <div key={category} onDrop={(e) => handleDrop(e, category)} onDragOver={handleDragOver}
                                className="bg-white/80 p-4 rounded-xl shadow-md min-h-[400px]">
                                <h3 className={`text-2xl font-bold text-center mb-4 ${
                                    category === 'House' ? 'text-green-600' : category === 'Senate' ? 'text-purple-600' : 'text-orange-500'
                                }`}>{category}</h3>
                                <div className="space-y-3">
                                    {columns[category].map(item => {
                                        const isCorrect = item.category === category;
                                        let feedbackClass = '';
                                        if (checked) {
                                            feedbackClass = isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
                                        }
                                        return (
                                             <div key={item.id} draggable={!checked} onDragStart={(e) => handleDragStart(e, item)}
                                                 className={`p-3 bg-white rounded-lg shadow cursor-grab border-2 ${feedbackClass} ${draggingItem === item.id ? 'opacity-50' : 'opacity-100'}`}>
                                                {item.content}
                                             </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="text-center mt-8">
                    {!checked ? (
                        <button onClick={handleCheckAnswers} disabled={!allItemsPlaced}
                         className="px-10 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transform hover:scale-105 transition">
                            Check My Answers
                        </button>
                    ) : (
                        <button onClick={onComplete}
                         className="px-10 py-4 text-xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transform hover:scale-105 transition animate-pulse">
                            Continue to Final Challenge!
                        </button>
                    )}
                    {!allItemsPlaced && <p className="text-gray-600 mt-2">Place all items before checking your answers.</p>}
                 </div>
            </div>
        </div>
    );
};

export default DragAndDropView;
