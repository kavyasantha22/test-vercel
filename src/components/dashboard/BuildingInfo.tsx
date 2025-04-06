import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface BuildingInfoProps {
  buildingId?: string;
}

const BuildingInfo = ({ buildingId }: BuildingInfoProps) => {
  const [building, setBuilding] = useState<Tables<'buildings'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        let query = supabase.from('buildings').select('*');
        
        if (buildingId) {
          query = query.eq('id', buildingId);
        } else {
          query = query.limit(1);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          console.error('Error fetching building info:', error);
          return;
        }
        
        setBuilding(data);
      } catch (error) {
        console.error('Error in fetchBuilding:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Building Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Loading building information...</div>
        </CardContent>
      </Card>
    );
  }

  if (!building) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Building Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">No building information available</div>
        </CardContent>
      </Card>
    );
  }

  const buildingDetails = [
    { label: 'Building Name', value: building.name },
    { label: 'Address', value: building.address },
    { label: 'Plan Number', value: building.plan_number },
    { label: 'Total Lots', value: building.total_lots.toString() },
    { label: 'Year Built', value: building.year_built.toString() }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Building Information</CardTitle>
          <Home className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {buildingDetails.map((detail, index) => (
            <div key={index} className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">{detail.label}</span>
              <span className="text-sm font-medium text-right">{detail.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingInfo;
