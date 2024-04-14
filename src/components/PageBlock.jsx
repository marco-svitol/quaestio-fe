const PageBlock = ({ children, width, items }) => {
    return (
        <div className={`bg-white p-8 flex flex-col items-${items} gap-3 border-2 border-red-200 rounded-lg ${width === 'full' ? 'w-full': 'w-full lg:w-fit'}`} style={{'box-shadow': '5px 5px 30px 2px rgba(0, 0, 0, 0.2)'}}>
            {children}
        </div>
    )
}

export default PageBlock;