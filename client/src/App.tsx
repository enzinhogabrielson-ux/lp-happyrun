import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";

// Use hash location for routing to support static hosting
// This ensures paths like /#/admin work without server-side configuration
function HashRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
