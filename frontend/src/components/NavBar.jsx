const Navbar = () => {
    const currentPath = window.location.pathname; 
  
    const isActive = (path) => currentPath === path;
  
    return (
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl mx-auto p-4 flex justify-center">
          <ul className="flex space-x-6 font-medium">
            {/* Form Builder */}
            <li>
              <a
                href="/formbuilder"
                className={`py-2 px-4 ${
                  isActive("/formbuilder")
                    ? "text-blue-700 border-b-2 border-blue-700 dark:text-blue-500 dark:border-blue-500"
                    : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                }`}
              >
                Form Builder
              </a>
            </li>
  
            {/* Survey List */}
            <li>
              <a
                href="/surveys"
                className={`py-2 px-4 ${
                  isActive("/surveys")
                    ? "text-blue-700 border-b-2 border-blue-700 dark:text-blue-500 dark:border-blue-500"
                    : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                }`}
              >
                Survey List
              </a>
            </li>
  
            {/* Add Patient */}
            <li>
              <a
                href="/patient"
                className={`py-2 px-4 ${
                  isActive("/patient")
                    ? "text-blue-700 border-b-2 border-blue-700 dark:text-blue-500 dark:border-blue-500"
                    : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                }`}
              >
                Add Patient
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  