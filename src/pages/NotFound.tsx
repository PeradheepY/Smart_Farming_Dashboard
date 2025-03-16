
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-card rounded-lg shadow-lg animate-fade-in">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">404</h1>
          <p className="text-xl text-gray-400 mb-6">Page not found</p>
          <p className="text-gray-500 mb-8">
            The requested resource "{location.pathname}" could not be found on this server.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-fieldgreen text-black font-medium rounded-md transition-all hover:bg-fieldgreen/90"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
