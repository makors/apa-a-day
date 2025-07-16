
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationInfo } from "./CitationInfo"
import CitationTextarea from "./CitationTextarea"
import { BookOpen, Edit3 } from "lucide-react"

export default function CitationTabs() {
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm p-1 rounded-lg">
                <TabsTrigger 
                    value="info" 
                    className="flex items-center gap-2 text-gray-200 data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 transition-all duration-200"
                >
                    <BookOpen className="w-4 h-4" />
                    Info
                </TabsTrigger>
                <TabsTrigger 
                    value="citation" 
                    className="flex items-center gap-2 text-gray-200 data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 transition-all duration-200"
                >
                    <Edit3 className="w-4 h-4" />
                    Citation
                </TabsTrigger>
            </TabsList>
            <TabsContent value="info" forceMount className="data-[state=inactive]:hidden mt-6">
                <CitationInfo />
            </TabsContent>
            <TabsContent value="citation" forceMount className="data-[state=inactive]:hidden mt-6">
                <CitationTextarea />
            </TabsContent>
        </Tabs>
    )
}