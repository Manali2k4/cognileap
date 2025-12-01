import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const ChildSelector = ({ onClose }) => {
  const { children, setChildren, setSelectedChild } = useContext(AuthContext);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childData, setChildData] = useState({ name: '', age: '' });
  const [loading, setLoading] = useState(false);

  const handleSelectChild = (child) => {
    setSelectedChild(child);
    toast.success(`Selected ${child.name}`);
    onClose();
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/children`, {
        name: childData.name,
        age: parseInt(childData.age)
      });
      
      setChildren([...children, response.data]);
      toast.success('Child profile created!');
      setChildData({ name: '', age: '' });
      setShowAddChild(false);
    } catch (error) {
      toast.error('Failed to add child profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="child-selector-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ color: '#6EC1E4' }}>
            Select Child Profile
          </DialogTitle>
        </DialogHeader>
        
        {!showAddChild ? (
          <div className="space-y-4 mt-4">
            {children.length > 0 ? (
              <>
                <div className="space-y-3" data-testid="children-list">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleSelectChild(child)}
                      className="w-full p-4 rounded-xl text-left hover-lift"
                      style={{ background: '#6EC1E410', border: '2px solid #6EC1E4' }}
                      data-testid={`select-child-${child.id}`}
                    >
                      <p className="font-bold text-lg" style={{ color: '#333' }}>{child.name}</p>
                      <p className="text-sm text-gray-600">Age: {child.age}</p>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => setShowAddChild(true)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  data-testid="show-add-child-btn"
                >
                  <UserPlus size={16} />
                  Add Another Child
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No child profiles yet</p>
                <Button
                  onClick={() => setShowAddChild(true)}
                  className="btn-primary"
                  data-testid="show-add-first-child-btn"
                >
                  Add Child Profile
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleAddChild} className="space-y-4 mt-4" data-testid="add-child-form">
            <div>
              <Label htmlFor="child-name">Child's Name</Label>
              <Input
                id="child-name"
                type="text"
                value={childData.name}
                onChange={(e) => setChildData({ ...childData, name: e.target.value })}
                required
                placeholder="Enter child's name"
                data-testid="child-name-input"
              />
            </div>
            
            <div>
              <Label htmlFor="child-age">Age</Label>
              <Input
                id="child-age"
                type="number"
                min="1"
                max="18"
                value={childData.age}
                onChange={(e) => setChildData({ ...childData, age: e.target.value })}
                required
                placeholder="Enter age"
                data-testid="child-age-input"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 btn-primary" 
                disabled={loading}
                data-testid="add-child-submit-btn"
              >
                {loading ? 'Adding...' : 'Add Child'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddChild(false)}
                className="flex-1"
                data-testid="cancel-add-child-btn"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChildSelector;