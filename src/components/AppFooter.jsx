import { NavLink, Link } from "react-router-dom";

function AppFooter() {

    return (
        <footer className="rounded-lg">
            <div className="w-full mx-auto p-4 md:py-8">
                <hr className="my-6 border-gray-500 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 
                <Link to="/" className="hover:underline"> ClotheHub</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}

export default AppFooter;