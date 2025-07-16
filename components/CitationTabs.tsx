
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationInfo } from "./CitationInfo"

// Dynamically import the heavy CitationTextarea component
const CitationTextarea = dynamic(() => import("./CitationTextarea"), {
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
    </div>
  ),
});

export default function CitationTabs() {
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="citation">Citation</TabsTrigger>
            </TabsList>
            <TabsContent value="info" forceMount className="data-[state=inactive]:hidden">
                <CitationInfo />
            </TabsContent>
            <TabsContent value="citation" forceMount className="data-[state=inactive]:hidden">
                <CitationTextarea />
            </TabsContent>
        </Tabs>
    )
}