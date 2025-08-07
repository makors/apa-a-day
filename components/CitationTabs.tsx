
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationInfo } from "./CitationInfo"
import CitationTextarea from "./CitationTextarea"
import { BookOpen, Edit3 } from "lucide-react"

export default function CitationTabs() {
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/60 border border-gray-800 backdrop-blur-md p-1.5 rounded-xl shadow-inner">
                <TabsTrigger 
                    value="info" 
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-orange-300 data-[state=active]:bg-gray-800/60 data-[state=active]:shadow data-[state=inactive]:hover:text-gray-200 rounded-lg transition-all duration-200"
                >
                    <BookOpen className="w-4 h-4" />
                    Info
                </TabsTrigger>
                <TabsTrigger 
                    value="citation" 
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-orange-300 data-[state=active]:bg-gray-800/60 data-[state=active]:shadow data-[state=inactive]:hover:text-gray-200 rounded-lg transition-all duration-200"
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