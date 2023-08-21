export interface SortedArticles {
    articles: SortedArticle[];
}

export interface SortedArticle {
    title: string;
    sort: number;
    reasons: string[];
}