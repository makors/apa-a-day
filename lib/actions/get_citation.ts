'use server';

import { Redis } from "@upstash/redis";

interface CitationInfo {
    authors: string[];
    publishedYear: number;
    title: string;
    periodical: string;
    volume: string;
    issue: string;
    pageStart: string;
    pageEnd: string;
    doi: string | null;
}

const redis = new Redis({
    url: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_PASSWORD,
});

export async function getCitation(): Promise<CitationInfo> {
    return (await redis.json.get("current_citation", "$") as CitationInfo[])[0];
}

export async function getAPAFormatted(): Promise<string> {
    const apaCitation = await redis.get("apa_citation");
    if (!apaCitation) throw new Error("No APA citation found");
    
    return apaCitation as string;
}
