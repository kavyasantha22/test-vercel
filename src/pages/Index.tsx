
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <img 
                src="/bilding-image.png" 
                alt="Azure Heights Property Management" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Azure Heights</h1>
              <p className="text-lg text-gray-600">
                Welcome to the Azure Heights Strata Management Portal. Access building information, committee details, upcoming meetings, and important documents.
              </p>
              <div className="pt-4">
                <a 
                  href="/dashboard" 
                  className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
