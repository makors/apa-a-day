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

// Create a singleton Redis instance for connection pooling
let redisInstance: Redis | null = null;

function getRedisInstance(): Redis {
    if (!redisInstance) {
        redisInstance = new Redis({
            url: process.env.UPSTASH_URL,
            token: process.env.UPSTASH_PASSWORD,
        });
    }
    return redisInstance;
}

export async function getCitation(): Promise<CitationInfo> {
    try {
        const redis = getRedisInstance();
        const result = await redis.json.get("current_citation", "$") as CitationInfo[];
        
        if (!result || result.length === 0) {
            throw new Error("No citation data found");
        }
        
        return result[0];
    } catch (error) {
        console.error("Error fetching citation:", error);
        // Return fallback data if Redis fails
        return {
            authors: ["John", "Doe"],
            publishedYear: 2024,
            title: "Sample Research Paper",
            periodical: "Journal of Studies",
            volume: "1",
            issue: "1",
            pageStart: "1",
            pageEnd: "10",
            doi: null,
        };
    }
}

export async function getAPAFormatted(): Promise<string> {
    try {
        const redis = getRedisInstance();
        const apaCitation = await redis.get("apa_citation");
        
        if (!apaCitation) {
            throw new Error("No APA citation found");
        }
        
        return apaCitation as string;
    } catch (error) {
        console.error("Error fetching APA citation:", error);
        // Return fallback citation if Redis fails
        return "Doe, J. (2024). Sample Research Paper. *Journal of Studies, 1*(1), 1-10.";
    }
}
