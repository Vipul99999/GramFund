export const LoadingState = ({ label='Loading...' }: { label?: string }) => <div className="rounded-xl border bg-white p-4" aria-busy="true">{label}</div>;
export const ErrorState = ({ message }: { message: string }) => <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{message}</div>;
export const EmptyState = ({ message }: { message: string }) => <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-500">{message}</div>;
