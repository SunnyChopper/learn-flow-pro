export interface SortedArticles {
    sortedArticles: SortedArticle[];
}

export interface SortedArticle {
    title: string;
    sort: number;
    reasons: string[];
    informationFlow: string[];
}