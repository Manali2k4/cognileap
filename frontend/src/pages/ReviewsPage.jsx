import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ReviewsPage = () => {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ parent_name: '', rating: 5, review_text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.parent_name || !newReview.review_text) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API}/reviews`, newReview);
      toast.success('Review submitted successfully!');
      setNewReview({ parent_name: '', rating: 5, review_text: '' });
      setShowAddReview(false);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? '#FFD166' : 'none'}
        stroke={i < rating ? '#FFD166' : '#D1D5DB'}
      />
    ));
  };

  const avatars = ['👨', '👩', '👴', '👵', '🧑', '👨‍🦱', '👩‍🦰', '👨‍🦲'];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 fade-in" data-testid="reviews-header">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#6EC1E4' }}>
              Parent Reviews
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              See what families are saying about CogniLeap
            </p>
            <Button
              onClick={() => setShowAddReview(!showAddReview)}
              className="btn-primary"
              data-testid="add-review-btn"
            >
              {showAddReview ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>

          {/* Add Review Form */}
          {showAddReview && (
            <div className="card mb-12 fade-in" data-testid="review-form">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#333' }}>Share Your Experience</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>Your Name</label>
                  <Input
                    value={newReview.parent_name}
                    onChange={(e) => setNewReview({ ...newReview, parent_name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full"
                    data-testid="review-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className="cursor-pointer transition-transform hover:scale-110"
                        fill={star <= newReview.rating ? '#FFD166' : 'none'}
                        stroke={star <= newReview.rating ? '#FFD166' : '#D1D5DB'}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        data-testid={`rating-star-${star}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>Your Review</label>
                  <Textarea
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                    placeholder="Tell us about your experience with CogniLeap..."
                    rows={4}
                    className="w-full"
                    data-testid="review-text-input"
                  />
                </div>
                <Button type="submit" className="btn-primary" data-testid="submit-review-btn">
                  Submit Review
                </Button>
              </form>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="reviews-grid">
            {reviews.map((review, index) => (
              <div 
                key={review.id} 
                className="card hover-lift fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`review-card-${index}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: '#6EC1E420' }}
                  >
                    {avatars[index % avatars.length]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: '#333' }}>{review.parent_name}</h3>
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-3">"{review.review_text}"</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12 card">
              <p className="text-gray-600 text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;