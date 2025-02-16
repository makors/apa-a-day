import { faker } from "@faker-js/faker";
import { Redis } from "@upstash/redis";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { nanoid } from 'nanoid';

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

export const changeCitation = schedules.task({
  id: "change-citation",
  // every day 12:00 am
  cron: "0 0 * * *",
  maxDuration: 300, // 5 mins
  retry: {
    maxAttempts: 3
  },
  run: async (payload, { ctx }) => {
    logger.info("fetching from openalex")
    let openAlexReq;
    let openAlexData = null;
    let count = 0;

    do {
      openAlexReq = await fetch("https://api.openalex.org/works/random");
      
      if (!openAlexReq.ok) {
        logger.error("failed to fetch from openalex", { error: openAlexReq.statusText });
        throw new Error("failed to fetch from openalex");
      }

      openAlexData = await openAlexReq.json();
      const titleWordCount = openAlexData.display_name?.split(/\s+/).length ?? 0;
      logger.info("checking work", { 
        language: openAlexData.language,
        type: openAlexData.type,
        titleWordCount,
        doi: openAlexData.doi
      });

      if (
        openAlexData.language !== "en" || 
        openAlexData.type !== "article" ||
        titleWordCount > 12
      ) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

    } while (
      (openAlexData.language !== "en" || 
       openAlexData.type !== "article" ||
       (openAlexData.display_name?.split(/\s+/).length ?? 0) > 12) && 
      count++ < 10
    );

    if (openAlexData == null) {
      throw new Error("no matching work found");
    }

    logger.info("found matching work", { openAlexData });

    // used for the apa citation later
    const authors: { firstName: string, middleName: string, lastName: string }[] = [];

    const citationInfo: CitationInfo = {
      authors: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
        let firstName: string;
        let lastName: string;

        do { firstName = faker.person.firstName() } while (firstName.length > 6);
        do { lastName = faker.person.lastName() } while (lastName.length > 6);
        const middleName = faker.person.middleName().charAt(0);

        authors.push({ firstName, middleName, lastName });

        return `${firstName} ${middleName}. ${lastName}`;
      }),
      publishedYear: openAlexData.publication_year ?? 2025,
      title: openAlexData.display_name ?? "Fictional Study",
      periodical: openAlexData.primary_location.source.display_name ?? "The Journal of Fictional Studies",
      volume: openAlexData.primary_location.source.volume ?? "5",
      issue: openAlexData.biblio.issue ?? "8",
      pageStart: openAlexData.biblio.first_page ?? "50",
      pageEnd: openAlexData.biblio.last_page ?? "55",
      doi: openAlexData.doi?.length > 30 ? `https://doi.org/${nanoid(10)}` : openAlexData.doi,
    };

    // update the citation in redis

    const upstash = new Redis({
      url: process.env.UPSTASH_URL,
      token: process.env.UPSTASH_PASSWORD,
    });

    logger.info("connected to upstash redis")

    await upstash.json.set("current_citation", "$", citationInfo as unknown as Record<string, unknown>);

    logger.info("citation updated", { citationInfo });

    // format the citation in apa format
    let authorsAPA: string = "";
    
    switch (authors.length) {
      case 1:
        authorsAPA = `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. ${authors[0].middleName}.`;
        break;
      case 2:
        authorsAPA = `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. ${authors[0].middleName}., & ${authors[1].lastName}, ${authors[1].firstName.charAt(0)}. ${authors[1].middleName}.`;
        break;
      case 3:
        authorsAPA = `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. ${authors[0].middleName}., ${authors[1].lastName}, ${authors[1].firstName.charAt(0)}. ${authors[1].middleName}., & ${authors[2].lastName}, ${authors[2].firstName.charAt(0)}. ${authors[2].middleName}.`;
        break;
    }

    let apaCitation = `${authorsAPA} (${citationInfo.publishedYear}). ${citationInfo.title}. *${citationInfo.periodical}, ${citationInfo.volume}*(${citationInfo.issue}), ${citationInfo.pageStart}-${citationInfo.pageEnd}.`;
    if (citationInfo.doi) apaCitation += ` ${citationInfo.doi}`;

    logger.info("apa citation", { apaCitation });

    await upstash.set("apa_citation", apaCitation);
  },
});