export default function DashboardCard({ title, value, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      {value && <p className="text-2xl font-bold">{value}</p>}
      {children}
    </div>
  );
}
