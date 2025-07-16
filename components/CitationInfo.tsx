import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getCitation } from "@/lib/actions/get_citation";
import { BookOpen, Calendar, Hash, FileText, User, Globe } from "lucide-react";

export async function CitationInfo() {
    // faker is at least a megabyte, yikes!
    const citation = await getCitation();

    return (
        <Card className="w-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 pt-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            Citation Info
                        </CardTitle>
                        <CardDescription className="hidden lg:block lg:text-base text-gray-300 mt-1">
                            Use the information below to cite the journal article of the day.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-y-4 grid-cols-6 md:grid-cols-10 gap-x-4" suppressHydrationWarning>
                {citation.authors.map((author, index) => {
                    if (index > 2) return null;
                    
                    return (
                        <div className="flex flex-col col-span-3 gap-y-2 md:gap-y-2 group" key={index}>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                                <Label className="text-gray-400 text-sm font-medium">Author #{index + 1}</Label>
                            </div>
                            <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{author}</p>
                        </div>
                    )
                })}

                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-2 group">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Pages</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{citation.pageStart} - {citation.pageEnd}</p>
                </div>

                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-1 group">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Vol.</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{citation.volume}</p>
                </div>

                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-1 group">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Issue</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{citation.issue}</p>
                </div>
                
                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-1 group">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Year</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{citation.publishedYear}</p>
                </div>

                {citation.doi && (
                    <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-4 group">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                            <Label className="text-gray-400 text-sm font-medium">DOI</Label>
                        </div>
                        <p className="text-gray-200 font-medium group-hover:text-white transition-colors break-all">{citation.doi}</p>
                    </div>
                )}

                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-6 md:col-span-10 group">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Title</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors leading-relaxed">{citation.title}</p>
                </div>
                
                <div className="flex flex-col gap-y-2 md:gap-y-2 col-span-6 md:col-span-10 group">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <Label className="text-gray-400 text-sm font-medium">Periodical</Label>
                    </div>
                    <p className="text-gray-200 font-medium group-hover:text-white transition-colors italic">{citation.periodical}</p>
                </div>
            </CardContent>
        </Card>
    )
}
