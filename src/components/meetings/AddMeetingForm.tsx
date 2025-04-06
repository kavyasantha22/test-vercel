
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AddMeetingForm = ({ onMeetingAdded }: { onMeetingAdded: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'Committee',
    is_upcoming: true
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'Committee',
      is_upcoming: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('meetings')
        .insert([formData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Meeting has been added successfully",
      });
      
      resetForm();
      setOpen(false);
      onMeetingAdded();
      
      // Use fetch to call our API with a 307 redirect
      try {
        const response = await fetch('/api/health-check?redirect=true&url=/meetings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        
        // If the fetch is successful but we're still here (no redirect happened client-side),
        // manually redirect
        if (response.ok) {
          window.location.href = '/meetings';
        }
      } catch (redirectError) {
        console.error('Error during redirect:', redirectError);
        // Fallback to direct navigation
        window.location.href = '/meetings';
      }
    } catch (error) {
      console.error('Error adding meeting:', error);
      toast({
        title: "Error",
        description: "Failed to add meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Calendar className="h-4 w-4" />
          Add Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new meeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter meeting title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                placeholder="e.g., October 15, 2023"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                placeholder="e.g., 7:00 PM"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter meeting location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Meeting Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Committee">Committee Meeting</SelectItem>
                <SelectItem value="AGM">Annual General Meeting</SelectItem>
                <SelectItem value="Special">Special Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter meeting description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeetingForm;
