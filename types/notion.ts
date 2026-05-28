// Aliases over @notionhq/client types — pin the wide union types to the
// concrete shapes we actually consume, so callers don't carry narrowing logic.
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse;
export type AnyNotionBlock = BlockObjectResponse | PartialBlockObjectResponse;
export type NotionPage = PageObjectResponse;
export type NotionRichText = RichTextItemResponse;

export function isFullBlock(b: AnyNotionBlock): b is NotionBlock {
  return "type" in b;
}
