import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <BackgroundBeams />
      {children}
    </div>
  );
};

export default layout;
