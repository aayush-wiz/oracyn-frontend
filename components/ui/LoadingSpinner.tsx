// components/ui/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );
}
