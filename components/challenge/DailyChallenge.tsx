import { getCitation } from "@/lib/actions/get_citation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChallengeInput from "./ChallengeInput";
import { BookOpen, Calendar, Hash, FileText, Globe, Users } from "lucide-react";

export default async function DailyChallenge() {
  const citation = await getCitation();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-3 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">Article of the Day</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-y-3 grid-cols-6 md:grid-cols-12 gap-x-4">
          <div className="col-span-6 md:col-span-12">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><Users className="w-4 h-4" /> Authors</div>
            <div className="text-gray-200">{citation.authors.join(', ')}</div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><Calendar className="w-4 h-4" /> Year</div>
            <div className="text-gray-200">{citation.publishedYear}</div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><Hash className="w-4 h-4" /> Vol.</div>
            <div className="text-gray-200">{citation.volume}</div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><Hash className="w-4 h-4" /> Issue</div>
            <div className="text-gray-200">{citation.issue}</div>
          </div>
          <div className="col-span-6 md:col-span-12">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><FileText className="w-4 h-4" /> Title</div>
            <div className="text-gray-200 leading-relaxed">{citation.title}</div>
          </div>
          <div className="col-span-6 md:col-span-12">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><BookOpen className="w-4 h-4" /> Journal</div>
            <div className="text-gray-200 italic">{citation.periodical}</div>
          </div>
          <div className="col-span-6 md:col-span-12">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><FileText className="w-4 h-4" /> Pages</div>
            <div className="text-gray-200">{citation.pageStart} - {citation.pageEnd}</div>
          </div>
          {citation.doi && (
            <div className="col-span-6 md:col-span-12">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><Globe className="w-4 h-4" /> DOI</div>
              <div className="text-gray-200 break-all">{citation.doi}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <ChallengeInput citation={citation} />
    </div>
  );
}