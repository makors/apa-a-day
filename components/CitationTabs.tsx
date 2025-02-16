
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationInfo } from "./CitationInfo"
import CitationTextarea from "./CitationTextarea"

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