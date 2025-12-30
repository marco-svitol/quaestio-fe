import logo from '../images/logo.png';

const WelcomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center max-w-2xl mx-auto">
                <div className="mb-8">

                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Discover, search, and manage patent information
                    </p>
                </div>
                
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
                        <div className="relative bg-white rounded-full p-8 shadow-xl">
                            <img src={logo} alt="logo" className="w-32 h-32 object-contain" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <i className="fi fi-sr-search text-white text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-slate-800">Intelligent Search</h3>
                        <p className="text-slate-600 text-sm">Expert-customized filters tailored for specialized patent research</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <i className="fi fi-sr-star text-white text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-slate-800">Favorites</h3>
                        <p className="text-slate-600 text-sm">Save and organize your most important patents</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <i className="fi fi-sr-download text-white text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-slate-800">Export & Print</h3>
                        <p className="text-slate-600 text-sm">Export patent data in various formats for your needs</p>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-slate-500 text-sm">
                        Please log in to access the patent search platform
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;