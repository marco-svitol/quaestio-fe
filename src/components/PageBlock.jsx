const PageBlock = ({ children, width, items, relative }) => {
    return (
        <div className={`bg-white/90 backdrop-blur-sm p-8 flex flex-col items-${items} gap-4 border border-white/20 rounded-2xl ${width === 'full' ? 'w-full': width === 'fit' ? 'w-full' : 'w-full lg:w-fit'} ${relative ? 'relative' : ''} shadow-lg hover:shadow-xl transition-all duration-300`}>
            {children}
        </div>
    )
}

export default PageBlock;