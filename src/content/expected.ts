import expectedJson from "./generated/expected.json";
import type { ExpectedTopic } from "./schema";

export type { ExpectedTopic } from "./schema";
export const expectedTopics = expectedJson as ExpectedTopic[];
export const expectedItemCount = expectedTopics.reduce((sum, topic) => sum + topic.items.length, 0);

export function expectedKey(topicId: string, itemId: string): string {
  return `${topicId}/${itemId}`;
}
