'use client'

import {
  Sidebar,
  SidebarContent,
} from "@resume/ui/sidebar";
import { useSearchParams } from "next/navigation";
import Tabs from "./Tabs";
import { steps } from "./steps";

export function AppSidebar() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0]!.key;
  
  function setCurrentStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className=" border-r"
      style={{
        '--sidebar-width': '3.5rem',
        '--sidebar-width-icon': '3rem',
      } as React.CSSProperties}
    >
      <SidebarContent className="bg-gray-100 dark:bg-[#242627] dark:border-[hsl(0,0,17)] h-full p-1">
        <Tabs 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </SidebarContent>
    </Sidebar>
  );
}