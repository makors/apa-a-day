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

// Memoized author component to prevent unnecessary re-renders
const AuthorField = React.memo(({ author, index }: { author: string; index: number }) => (
    <div className="flex flex-col col-span-3 gap-y-1 md:gap-y-2">
        <Label className="text-gray-400">Author #{index + 1}</Label>
        <p>{author}</p>
    </div>
));

AuthorField.displayName = 'AuthorField';

export const CitationInfo = React.memo(async function CitationInfo() {
    // faker is at least a megabyte, yikes!
    const citation = await getCitation();

    // Memoize the authors array to prevent unnecessary re-renders
    const authorsToShow = React.useMemo(() => 
        citation.authors.slice(0, 3), 
        [citation.authors]
    );

    return (
        <Card className="w-full">
            <CardHeader className="pb-3 pt-4 md:pt-6">
                <CardTitle className="text-xl md:text-2xl">Citation Info</CardTitle>
                <CardDescription className="hidden lg:block lg:text-base">
                    Use the information below to cite the journal article of the day.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-y-3 grid-cols-6 md:grid-cols-10 gap-x-4" suppressHydrationWarning>
                {authorsToShow.map((author, index) => (
                    <AuthorField key={index} author={author} index={index} />
                ))}

                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-2">
                    <Label className="text-gray-400">Pages</Label>
                    <p>{citation.pageStart} - {citation.pageEnd}</p>
                </div>

                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-1">
                    <Label className="text-gray-400">Vol.</Label>
                    <p>{citation.volume}</p>
                </div>

                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-1">
                    <Label className="text-gray-400">Issue</Label>
                    <p>{citation.issue}</p>
                </div>
                
                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-1">
                    <Label className="text-gray-400">Year</Label>
                    <p>{citation.publishedYear}</p>
                </div>

                {citation.doi && <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-4">
                    <Label className="text-gray-400">DOI</Label>
                    <p>{citation.doi}</p>
                </div>}

                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-6 md:col-span-10">
                    <Label className="text-gray-400">Title</Label>
                    <p>{citation.title}</p>
                </div>
                
                <div className="flex flex-col gap-y-1 md:gap-y-2 col-span-6 md:col-span-10">
                    <Label className="text-gray-400">Periodical</Label>
                    <p>{citation.periodical}</p>
                </div>
            </CardContent>
        </Card>
    )
});
