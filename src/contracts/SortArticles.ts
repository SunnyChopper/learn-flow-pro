export interface SortedArticles {
    sortedArticles: SortedArticle[];
}

export interface SortedArticle {
    id: number;
    title: string;
    sort: number;
    reason: string;
    informationFlow: string;
}