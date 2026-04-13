// Members are embedded in the list detail response (GET /api/lists/:id).
// Use useListDetail instead — it populates LIST_DETAIL cache which usePermission reads.
export { useListDetail as useMembers } from '@/features/lists/hooks/useListDetail'
