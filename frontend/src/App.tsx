import Login from "./pages/Login/Login";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorBoundary>
      <Login />
      </ErrorBoundary>
     
    </div>
  );
}

export default App;