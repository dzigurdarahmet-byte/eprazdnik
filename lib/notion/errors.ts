// Domain-typed errors thrown by lib/notion/*. Page-level error.tsx can switch on `name`.

export class NotionError extends Error {
  public override readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "NotionError";
    this.cause = cause;
  }
}

export class ProgramNotFoundError extends NotionError {
  public readonly slug: string;
  constructor(slug: string) {
    super(`Program not found: ${slug}`);
    this.name = "ProgramNotFoundError";
    this.slug = slug;
  }
}

export class NotionRateLimitError extends NotionError {
  public readonly retryAfter?: number;
  constructor(retryAfter?: number) {
    super("Notion API rate limit exceeded");
    this.name = "NotionRateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class NotionParseError extends NotionError {
  public readonly blockType?: string;
  constructor(message: string, blockType?: string) {
    super(`Failed to parse Notion block: ${message}`);
    this.name = "NotionParseError";
    this.blockType = blockType;
  }
}
