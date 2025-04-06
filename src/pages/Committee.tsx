
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const CommitteePage = () => {
  const [committeeMembers, setCommitteeMembers] = useState<Tables<'committee_members'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('committee_members')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching committee members:', error);
          return;
        }

        setCommitteeMembers(data);
      } catch (error) {
        console.error('Error in fetchCommitteeMembers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitteeMembers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Committee Members</h1>
        <p className="text-muted-foreground mt-2">
          Current Strata Committee for Azure Heights
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Committee</CardTitle>
              <CardDescription>
                Elected March 2023 • {committeeMembers.length} of 9 positions filled
              </CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading committee members...</div>
          ) : committeeMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No committee members found</div>
          ) : (
            <div className="space-y-6">
              {committeeMembers.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b last:border-0 last:pb-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">{member.name}</h3>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {member.role}
                      </span>
                      <span className="text-sm text-muted-foreground">{member.lot}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Email:</span> {member.email}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Member since:</span> {member.since}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommitteePage;
