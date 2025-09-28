const Navbar = () => {
  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 text-gray-200">
      {/* Left */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search"
          className="bg-zinc-800 text-sm px-3 py-1.5 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {/* <Search size={18} className="text-gray-400 -ml-7" /> */}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm">
          {/* <Plus size={16} /> Create */}
        </button>
        {/* <Bell size={20} className="cursor-pointer" /> */}
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-sm font-bold">CF</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
