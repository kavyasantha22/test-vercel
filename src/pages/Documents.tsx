
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Category = 'All' | 'Financial' | 'Minutes' | 'Bylaws' | 'Reports';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Tables<'documents'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>('All');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching documents:', error);
          return;
        }

        setDocuments(data);
      } catch (error) {
        console.error('Error in fetchDocuments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Financial":
        return "bg-blue-100 text-blue-800";
      case "Minutes":
        return "bg-green-100 text-green-800";
      case "Bylaws":
        return "bg-purple-100 text-purple-800";
      case "Reports":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterDocuments = (category: Category) => {
    if (category === "All") return documents;
    return documents.filter(doc => doc.category === category);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground mt-2">
          Strata records, financial documents, and meeting minutes
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strata Documents</CardTitle>
              <CardDescription>
                All records for Azure Heights strata scheme
              </CardDescription>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
          ) : (
            <Tabs defaultValue="All" onValueChange={(value) => setActiveTab(value as Category)}>
              <TabsList className="mb-4">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Financial">Financial</TabsTrigger>
                <TabsTrigger value="Minutes">Minutes</TabsTrigger>
                <TabsTrigger value="Bylaws">Bylaws</TabsTrigger>
                <TabsTrigger value="Reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Name</th>
                          <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Category</th>
                          <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Date</th>
                          <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Size</th>
                          <th className="py-3 px-4 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterDocuments(activeTab).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">No documents found</td>
                          </tr>
                        ) : (
                          filterDocuments(activeTab).map((doc) => (
                            <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{doc.name}</span>
                                </div>
                                <div className="sm:hidden flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                                  <span>{doc.date}</span>
                                  <span>{doc.size}</span>
                                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${getCategoryColor(doc.category)}`}>
                                    {doc.category}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(doc.category)}`}>
                                  {doc.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{doc.date}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{doc.size}</td>
                              <td className="py-3 px-4 text-right">
                                <a 
                                  href="#" 
                                  className="text-primary hover:underline text-sm font-medium"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
