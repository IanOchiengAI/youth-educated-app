import { buildKnowledgeIndex, KnowledgeIndex } from './localKnowledge';

let _index: KnowledgeIndex | null = null;

export function getKnowledgeIndex(): KnowledgeIndex {
  if (!_index) _index = buildKnowledgeIndex();
  return _index;
}
