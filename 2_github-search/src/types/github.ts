export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
