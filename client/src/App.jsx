import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import { Toaster } from "sonner";

const AppLayout = lazy(() => import("./layouts/AppLayout"));

function App() {
  return (
    <div className="bg-neutral-900 text-neutral-200 min-h-screen flex flex-col">
      <Suspense fallback={<>LOADING...</>}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<>BOOKING PAGEasddddddd</>} />
          </Route>
          <Route path="/login" element={<>LOGIN PAGE</>} />
          <Route path="/register" element={<>REGISTER PAGE</>} />
          <Route path="*" element={<>PAGE NOT FOUND</>} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
