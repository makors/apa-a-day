
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationInfo } from "./CitationInfo"
import CitationTextarea from "./CitationTextarea"
import { BookOpen, Edit3 } from "lucide-react"

export default function CitationTabs() {
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-1 rounded-lg">
                <TabsTrigger 
                    value="info" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                    <BookOpen className="w-4 h-4" />
                    Info
                </TabsTrigger>
                <TabsTrigger 
                    value="citation" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
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