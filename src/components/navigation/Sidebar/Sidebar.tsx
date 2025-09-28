const menu = [
  { label: "Projects" },
  { label: "Boards" },
  { label: "Filters" },
  { label: "Dashboards" },
  { label: "Goals" },
  { label: "Teams" },
  { label: "Customize" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-zinc-900 text-gray-200 flex flex-col h-screen border-r border-zinc-800">
      <div className="p-4 font-bold text-xl">Jira Clone</div>
      <nav className="flex-1 space-y-1 px-2">
        {menu.map((item, idx) => (
          <button
            key={idx}
            className="flex items-center w-full gap-3 px-3 py-2 text-left rounded-lg hover:bg-zinc-800"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
