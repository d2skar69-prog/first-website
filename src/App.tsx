import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RunFrenzy from "@/pages/RunFrenzy";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Work from "@/pages/Work";
import Journal from "@/pages/Journal";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Work} />
      <Route path="/home" component={RunFrenzy} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/work" component={Work} />
      <Route path="/journal" component={Journal} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
